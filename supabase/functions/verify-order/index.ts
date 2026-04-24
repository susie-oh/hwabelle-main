import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

// Simple rate limiter implementation using a global Map
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
    const now = Date.now();
    let record = rateLimitMap.get(ip);
    if (!record || now > record.resetAt) {
        record = { count: 0, resetAt: now + 60000 }; // 1 min window
    }
    record.count++;
    rateLimitMap.set(ip, record);
    return record.count > 60; // Max 60 req / min
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const t0 = Date.now();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
        console.warn(JSON.stringify({ function: "verify-order", event: "rate_limited", ip, ts: new Date().toISOString() }));
        return new Response(JSON.stringify({ error: "Too many requests" }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    try {
        const body = await req.json();
        const { order_number, email } = body;

        if (!order_number || !email) {
            return new Response(JSON.stringify({ state: "not-found" }), {
                status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const adminClient = createClient(supabaseUrl, serviceRoleKey);

        // ── Verify JWT to determine Stage A vs B ──
        const authHeader = req.headers.get("Authorization") || "";
        let authUser = null;
        if (authHeader.startsWith("Bearer ")) {
            const jwt = authHeader.replace("Bearer ", "");
            const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
            const userClient = createClient(supabaseUrl, anonKey, {
                global: { headers: { Authorization: `Bearer ${jwt}` } },
            });
            const { data: { user } } = await userClient.auth.getUser();
            if (user) authUser = user;
        }

        // ── Validation (Both Stages) ──
        // 1. Find the order by order_number and email exactly
        const { data: order, error: orderErr } = await adminClient
            .from("orders")
            .select("id, status, customer_email")
            .eq("order_number", order_number)
            .eq("customer_email", email.toLowerCase())
            .maybeSingle();

        if (orderErr || !order || order.status !== "paid") {
            // Safe generic state - does not leak whether email or order_number was wrong
            console.log(JSON.stringify({ function: "verify-order", event: "order_not_found_or_unpaid", order_number, ip, ts: new Date().toISOString() }));
            return new Response(JSON.stringify({ state: "not-found" }), {
                status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // 2. Check order_items for ai-designer
        const { data: orderItems } = await adminClient
            .from("order_items")
            .select("id")
            .eq("order_id", order.id)
            .eq("product_type", "ai-designer");

        if (!orderItems || orderItems.length === 0) {
            console.log(JSON.stringify({ function: "verify-order", event: "no_ai_access_in_order", order_id: order.id, ts: new Date().toISOString() }));
            return new Response(JSON.stringify({ state: "invalid-order" }), {
                status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // 3. Check existing entitlement & redemption state
        const { data: entitlement } = await adminClient
            .from("entitlements")
            .select("id, user_id")
            .eq("order_id", order.id)
            .eq("product_type", "ai-designer")
            .maybeSingle();

        const { data: requestState } = await adminClient
            .from("access_requests")
            .select("status, redemption_count, max_redemptions")
            .eq("order_id", order.id)
            .maybeSingle();

        const maxRedemptions = requestState?.max_redemptions ?? 1;
        const currentCount = requestState?.redemption_count ?? 0;
        
        // A previous redemption either created a 'redeemed' access_request OR linked the entitlement to a user_id
        const isRedeemed = requestState?.status === 'redeemed' || (entitlement && entitlement.user_id !== null) || (currentCount >= maxRedemptions);

        if (isRedeemed) {
            return new Response(JSON.stringify({ state: "already-redeemed" }), {
                status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // ── Stage A: Anonymous Precheck ──
        if (!authUser) {
            return new Response(JSON.stringify({ state: "success", message: "Ready to claim" }), {
                status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // ── Stage B: Authenticated Claim ──
        // Link user to order
        await adminClient.from("orders").update({ user_id: authUser.id }).eq("id", order.id);

        // Claim, do not duplicate: Update the existing entitlement created by stripe-webhook
        if (entitlement) {
            await adminClient.from("entitlements").update({ user_id: authUser.id }).eq("id", entitlement.id);
        } else {
            // Safety fallback: only insert if missing entirely
            await adminClient.from("entitlements").insert({
                order_id: order.id,
                user_id: authUser.id,
                product_type: "ai-designer",
                source: "direct",
                status: "active",
                expires_at: null
            });
        }

        // Update access_requests
        await adminClient.from("access_requests").upsert({
            order_id: order.id,
            order_number: order_number,
            email: email,
            source: "website",
            status: "redeemed",
            redemption_count: currentCount + 1,
            max_redemptions: maxRedemptions,
            redeemed_by_user_id: authUser.id,
            updated_at: new Date().toISOString()
        }, { onConflict: "order_id" });

        console.log(JSON.stringify({ function: "verify-order", event: "redemption_success", order_id: order.id, user_id: authUser.id, ts: new Date().toISOString(), latency_ms: Date.now() - t0 }));

        return new Response(JSON.stringify({ state: "success", message: "Claimed successfully" }), {
            status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error(JSON.stringify({ function: "verify-order", event: "error", error: error.message, ts: new Date().toISOString() }));
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
