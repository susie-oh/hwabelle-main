import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// ─── CORS ─────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
    "https://hwabelle.com",
    "https://www.hwabelle.com",
    "https://hwabelle.shop",
    "https://www.hwabelle.shop",
    "http://localhost:8080",
    "http://localhost:5173",
];

function getCorsHeaders(req: Request) {
    const origin = req.headers.get("origin") || "";
    const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        "Access-Control-Allow-Origin": allowed,
        "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
    };
}

// ─── Simple in-process rate limiter (60 req / min per IP) ────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
        return false;
    }
    entry.count++;
    return entry.count > RATE_LIMIT;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
    const corsHeaders = getCorsHeaders(req);
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    const t0 = Date.now();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // ── Rate limit ──
    if (isRateLimited(ip)) {
        console.warn(JSON.stringify({ function: "get-entitlement", event: "rate_limited", ip, ts: new Date().toISOString() }));
        return new Response(JSON.stringify({ error: "Too many requests" }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // ── Auth: require valid user JWT ──
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) {
        console.warn(JSON.stringify({ function: "get-entitlement", event: "missing_auth", ip, ts: new Date().toISOString() }));
        return new Response(JSON.stringify({ error: "Authentication required" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
    const jwt = authHeader.replace("Bearer ", "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Service-role client for DB writes (recovery backfill)
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // User-scoped client for resolving the session
    const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: `Bearer ${jwt}` } },
    });

    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) {
        console.warn(JSON.stringify({ function: "get-entitlement", event: "invalid_jwt", ip, ts: new Date().toISOString() }));
        return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const userId = user.id;
    const userEmail = user.email || null;

    try {
        // ── Primary: check entitlements table for this user ──
        const { data: entitlement, error: entErr } = await adminClient
            .from("entitlements")
            .select("id, product_type, status, expires_at, created_at")
            .eq("user_id", userId)
            .eq("product_type", "ai-designer")
            .eq("status", "active")
            .maybeSingle();

        if (entErr) throw entErr;

        // Validate expiry (null = lifetime, never expires)
        const isActive =
            !!entitlement &&
            (!entitlement.expires_at || new Date(entitlement.expires_at) > new Date());

        if (isActive) {
            console.log(JSON.stringify({
                function: "get-entitlement",
                event: "entitlement_found",
                user_id: userId,
                product_type: "ai-designer",
                entitlement_id: entitlement.id,
                latency_ms: Date.now() - t0,
                ts: new Date().toISOString(),
            }));
            return new Response(
                JSON.stringify({ has_access: true, product_type: "ai-designer", expires_at: entitlement.expires_at }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // ── Legacy recovery bridge ──
        // Conditions (all must be true):
        //   1. User is authenticated (checked above)
        //   2. User's email is verified (email_confirmed_at is not null)
        //   3. A paid order with an ai-designer order_item exists for this email
        //   4. No existing active entitlement for this user (checked above — we got here because none exists)
        const emailVerified = !!user.email_confirmed_at;
        if (!emailVerified || !userEmail) {
            console.log(JSON.stringify({
                function: "get-entitlement",
                event: "no_entitlement_unverified_email",
                user_id: userId,
                latency_ms: Date.now() - t0,
                ts: new Date().toISOString(),
            }));
            return new Response(
                JSON.stringify({ has_access: false, product_type: null, expires_at: null }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Find historical paid orders with ai-designer order_items for this email
        const { data: historicalOrders, error: histErr } = await adminClient
            .from("orders")
            .select("id, user_id, status")
            .eq("customer_email", userEmail.toLowerCase())
            .eq("status", "paid");

        if (histErr) throw histErr;

        if (!historicalOrders?.length) {
            console.log(JSON.stringify({
                function: "get-entitlement",
                event: "no_access",
                user_id: userId,
                latency_ms: Date.now() - t0,
                ts: new Date().toISOString(),
            }));
            return new Response(
                JSON.stringify({ has_access: false, product_type: null, expires_at: null }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const orderIds = historicalOrders.map((o: any) => o.id);

        // Check that at least one of those orders has an ai-designer order_item
        const { data: aiItems, error: aiItemErr } = await adminClient
            .from("order_items")
            .select("id, order_id")
            .in("order_id", orderIds)
            .eq("product_type", "ai-designer");

        if (aiItemErr) throw aiItemErr;

        if (!aiItems?.length) {
            console.log(JSON.stringify({
                function: "get-entitlement",
                event: "no_ai_order_items",
                user_id: userId,
                email: userEmail,
                latency_ms: Date.now() - t0,
                ts: new Date().toISOString(),
            }));
            return new Response(
                JSON.stringify({ has_access: false, product_type: null, expires_at: null }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // ── All conditions met — perform atomic recovery ──
        // We do backfill + entitlement insert + audit log.
        // Each step uses ON CONFLICT / ignore to be safe under retries.

        const recoveredOrderIds: string[] = [];

        // 1. Backfill orders.user_id for all unlinked orders with this email
        for (const order of historicalOrders) {
            if (!order.user_id) {
                const { error: backfillErr } = await adminClient
                    .from("orders")
                    .update({ user_id: userId })
                    .eq("id", order.id)
                    .is("user_id", null); // only update if still null (safe under retries)

                if (backfillErr) {
                    console.error(JSON.stringify({
                        function: "get-entitlement",
                        event: "backfill_error",
                        order_id: order.id,
                        error: backfillErr.message,
                        ts: new Date().toISOString(),
                    }));
                } else {
                    recoveredOrderIds.push(order.id);
                }
            } else if (order.user_id === userId) {
                recoveredOrderIds.push(order.id);
            }
        }

        // 2. Use the first qualifying order with an ai-designer item for the entitlement
        const qualifyingOrderId = aiItems[0].order_id;

        const { error: entInsertErr } = await adminClient
            .from("entitlements")
            .upsert(
                {
                    user_id: userId,
                    order_id: qualifyingOrderId,
                    product_type: "ai-designer",
                    source: "direct",
                    status: "active",
                    expires_at: null,
                },
                { onConflict: "order_id,product_type", ignoreDuplicates: false }
            );

        if (entInsertErr) {
            // Non-fatal: could be a concurrent insert — log and continue
            console.error(JSON.stringify({
                function: "get-entitlement",
                event: "recovery_entitlement_error",
                error: entInsertErr.message,
                user_id: userId,
                ts: new Date().toISOString(),
            }));
        }

        // 3. Write audit log entry
        await adminClient.from("entitlement_recovery_log").insert({
            user_id: userId,
            email: userEmail,
            order_ids: recoveredOrderIds,
            trigger_source: "get-entitlement",
        });

        console.log(JSON.stringify({
            function: "get-entitlement",
            event: "legacy_recovery_completed",
            user_id: userId,
            email: userEmail,
            recovered_order_ids: recoveredOrderIds,
            qualifying_order_id: qualifyingOrderId,
            latency_ms: Date.now() - t0,
            ts: new Date().toISOString(),
        }));

        return new Response(
            JSON.stringify({ has_access: true, product_type: "ai-designer", expires_at: null, recovered: true }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error(JSON.stringify({
            function: "get-entitlement",
            event: "error",
            error: message,
            user_id: userId,
            latency_ms: Date.now() - t0,
            ts: new Date().toISOString(),
        }));
        return new Response(JSON.stringify({ error: "Failed to check entitlement" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
