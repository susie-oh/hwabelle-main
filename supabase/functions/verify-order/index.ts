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

// ─── SP-API Token Exchange ────────────────────────────────────────────
async function getAccessToken(): Promise<string> {
    const clientId = Deno.env.get("AMAZON_SP_CLIENT_ID");
    const clientSecret = Deno.env.get("AMAZON_SP_CLIENT_SECRET");
    const refreshToken = Deno.env.get("AMAZON_SP_REFRESH_TOKEN");

    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error("Missing Amazon SP-API credentials");
    }

    const res = await fetch("https://api.amazon.com/auth/o2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`LWA token exchange failed: ${res.status} — ${errText}`);
    }

    const data = await res.json();
    return data.access_token;
}

// ─── Amazon Order Verification ─────────────────────────────────────────
const FLOWER_PRESS_SKU = Deno.env.get("AMAZON_SKU_FLOWER_PRESS") || "FPK-1-2026";
const FLOWER_PRESS_ASIN = "B0GFGY8DGW"; // As documented in KI

async function verifyAmazonOrder(orderId: string): Promise<{ status: "valid" | "not-found" | "invalid-items" }> {
    try {
        const accessToken = await getAccessToken();
        const endpoint = "https://sellingpartnerapi-na.amazon.com";

        let orderFound = false;
        let validItemFound = false;

        // Try organic Orders API first
        try {
            const orderRes = await fetch(`${endpoint}/orders/v0/orders/${orderId}`, {
                headers: { "x-amz-access-token": accessToken },
            });

            if (orderRes.ok) {
                const orderData = await orderRes.json();
                if (orderData.payload?.AmazonOrderId) {
                    orderFound = true;
                    const itemsRes = await fetch(`${endpoint}/orders/v0/orders/${orderId}/orderItems`, {
                        headers: { "x-amz-access-token": accessToken },
                    });
                    if (itemsRes.ok) {
                        const itemsData = await itemsRes.json();
                        const items = itemsData.payload?.OrderItems || [];
                        validItemFound = items.some((item: any) => 
                            item.SellerSKU === FLOWER_PRESS_SKU || item.ASIN === FLOWER_PRESS_ASIN
                        );
                    }
                }
            }
        } catch (e) {
            console.error("Organic check error", e);
        }

        // If not found in organic orders or failed, try MCF Outbound API
        if (!orderFound) {
            try {
                const mcfRes = await fetch(`${endpoint}/fba/outbound/2020-07-01/fulfillmentOrders/${orderId}`, {
                    headers: { "x-amz-access-token": accessToken },
                });

                if (mcfRes.ok) {
                    const mcfData = await mcfRes.json();
                    if (mcfData.payload?.fulfillmentOrder || mcfData.fulfillmentOrder) {
                        orderFound = true;
                        const items = mcfData.payload?.fulfillmentOrderItems || mcfData.fulfillmentOrderItems || [];
                        validItemFound = items.some((item: any) => 
                            item.sellerSku === FLOWER_PRESS_SKU || item.sellerFulfillmentOrderItemId?.includes(FLOWER_PRESS_SKU)
                        );
                    }
                }
            } catch (e: any) {
                console.error("MCF check error", e);
            }
        }

        if (!orderFound) return { status: "not-found" };
        if (!validItemFound) return { status: "invalid-items" };
        return { status: "valid" };
    } catch (e: any) {
        console.error("verifyAmazonOrder error:", e);
        return { status: "not-found", debug: e.message };
    }
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
        let isExpiredToken = false;
        
        if (authHeader.startsWith("Bearer ")) {
            const jwt = authHeader.replace("Bearer ", "");
            const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
            
            // Only try to authenticate if it's a real user token, not the fallback anon key
            if (jwt !== anonKey) {
                const userClient = createClient(supabaseUrl, anonKey, {
                    global: { headers: { Authorization: `Bearer ${jwt}` } },
                });
                const { data: { user } } = await userClient.auth.getUser(jwt);
                
                if (user) {
                    authUser = user;
                } else {
                    isExpiredToken = true;
                }
            }
        }

        // ── Validation (Both Stages) ──

        // 1. Find the order by order_number or mcf_order_id and email exactly
        let { data: order, error: orderErr } = await adminClient
            .from("orders")
            .select("id, status, customer_email")
            .or(`order_number.eq.${order_number},mcf_order_id.eq.${order_number}`)
            .eq("customer_email", email.toLowerCase())
            .limit(1)
            .maybeSingle();

        // ── Check if order has items; if not, delete the broken stub ──
        if (order) {
            const { data: existingItems } = await adminClient.from("order_items").select("id").eq("order_id", order.id);
            if (!existingItems || existingItems.length === 0) {
                console.log(`Deleting broken order stub for ${order_number}`);
                await adminClient.from("orders").delete().eq("id", order.id);
                order = null; // force fallback to Amazon check
            }
        }

        // ── Amazon SP-API Verification Fallback ──
        if (!order) {
            console.log(JSON.stringify({ function: "verify-order", event: "checking_amazon_spapi", order_number, ts: new Date().toISOString() }));
            const amazonResult = await verifyAmazonOrder(order_number);
            
            if (amazonResult.status === "valid") {
                console.log(JSON.stringify({ function: "verify-order", event: "amazon_order_valid", order_number, ts: new Date().toISOString() }));
                
                // Inject the mock order so that we can proceed with standard logic
                const { data: newOrder, error: insertErr } = await adminClient
                    .from("orders")
                    .insert({
                        order_number: order_number,
                        stripe_session_id: `amz_${order_number}`, // satisfy NOT NULL constraint
                        mcf_order_id: order_number, // assign to mcf tracking column
                        customer_email: email.toLowerCase(),
                        status: "paid", // considered paid if it is valid in Amazon
                        total_amount: 0,
                        currency: "usd",
                        items: { source: "amazon", verify_method: "sp-api" }
                    })
                    .select("id, status, customer_email")
                    .single();

                if (insertErr || !newOrder) {
                    console.error("Failed to inject Amazon order:", insertErr);
                    throw new Error(`Failed to inject Amazon order: ${insertErr?.message || 'unknown'}`);
                }
                order = newOrder;
                orderErr = null;

                // Also inject the order_item for ai-designer access
                const { error: itemErr } = await adminClient.from("order_items").insert({
                    order_id: order.id,
                    product_type: "ai-designer",
                    product_name: "AI Designer Access",
                    quantity: 1,
                    unit_amount: 0,
                    stripe_line_item_id: `amz_${order_number}_item`
                });
                if (itemErr) {
                    console.error("Failed to inject order_items:", itemErr);
                    throw new Error(`Failed to inject order_items: ${itemErr.message}`);
                }
            } else if (amazonResult.status === "invalid-items") {
                console.log(JSON.stringify({ function: "verify-order", event: "amazon_order_invalid_items", order_number, ts: new Date().toISOString() }));
                return new Response(JSON.stringify({ state: "invalid-order" }), {
                    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }
        }

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
            return new Response(JSON.stringify({ state: "invalid-order", debug_order_id: order.id, debug_email: order.customer_email }), {
                status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
            });
        }

        // 3. Check existing entitlement & redemption state
        const { data: entitlement } = await adminClient
            .from("entitlements")
            .select("id, user_id")
            .eq("order_id", order.id)
            .eq("product_type", "ai-designer")
            .limit(1)
            .maybeSingle();

        const { data: requestState } = await adminClient
            .from("access_requests")
            .select("status, redemption_count, max_redemptions")
            .eq("order_id", order.id)
            .limit(1)
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
            if (isExpiredToken) {
                return new Response(JSON.stringify({ state: "auth-required" }), {
                    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }
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
