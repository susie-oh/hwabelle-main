import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno&no-check";

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
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };
}

// ─── Rate limiter (60 req / min per IP) ──────────────────────────────────────
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
// Two and ONLY two valid call paths:
//
//   PATH A — Authenticated self-lookup (requires JWT):
//     { action: "my-orders" }
//     Returns the caller's own orders (resolved via user_id).
//
//   PATH B — Post-checkout session verification (no JWT required):
//     { action: "verify-session", session_id: "cs_xxx" }
//     Returns ONLY { pending: boolean, has_ai_access: boolean }.
//     No PII, no order history.
//
// ALL other call patterns are rejected.
Deno.serve(async (req) => {
    const corsHeaders = getCorsHeaders(req);
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    const t0 = Date.now();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
        console.warn(JSON.stringify({ function: "lookup-orders", event: "rate_limited", ip, ts: new Date().toISOString() }));
        return new Response(JSON.stringify({ error: "Too many requests" }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")!;

    let body: any;
    try {
        body = await req.json();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const { action, session_id } = body;

    // ── PATH B: Minimal post-checkout session verification (no JWT needed) ──
    // Returns only { pending, has_ai_access } — no PII, no order list.
    if (action === "verify-session" && session_id) {
        try {
            const adminClient = createClient(supabaseUrl, serviceRoleKey);

            // Check if order already exists in our DB
            const { data: existingOrder } = await adminClient
                .from("orders")
                .select("id, status")
                .eq("stripe_session_id", session_id)
                .maybeSingle();

            if (existingOrder) {
                // Order exists — check if it includes an ai-designer item
                const { data: aiItem } = await adminClient
                    .from("order_items")
                    .select("id")
                    .eq("order_id", existingOrder.id)
                    .eq("product_type", "ai-designer")
                    .maybeSingle();

                console.log(JSON.stringify({
                    function: "lookup-orders",
                    event: "session_verified_from_db",
                    session_id,
                    has_ai_access: !!aiItem,
                    latency_ms: Date.now() - t0,
                    ts: new Date().toISOString(),
                }));

                return new Response(JSON.stringify({ pending: false, has_ai_access: !!aiItem }), {
                    status: 200,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            // Order not in DB yet (webhook may be slow) — check Stripe directly
            const stripe = new Stripe(stripeKey, {
                apiVersion: "2023-10-16",
                httpClient: Stripe.createFetchHttpClient(),
            });

            let stripeSession: any;
            try {
                stripeSession = await stripe.checkout.sessions.retrieve(session_id);
            } catch {
                return new Response(JSON.stringify({ pending: true, has_ai_access: false }), {
                    status: 200,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            const paid = stripeSession.payment_status === "paid";
            if (!paid) {
                return new Response(JSON.stringify({ pending: true, has_ai_access: false }), {
                    status: 200,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            // Payment confirmed — check metadata for AI Designer flag (set by create-checkout)
            const hasAiDesigner = stripeSession.metadata?.has_ai_designer === "true";

            console.log(JSON.stringify({
                function: "lookup-orders",
                event: "session_verified_from_stripe",
                session_id,
                has_ai_access: hasAiDesigner,
                latency_ms: Date.now() - t0,
                ts: new Date().toISOString(),
            }));

            return new Response(JSON.stringify({ pending: false, has_ai_access: hasAiDesigner }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unknown error";
            console.error(JSON.stringify({ function: "lookup-orders", event: "verify_session_error", error: message, ts: new Date().toISOString() }));
            return new Response(JSON.stringify({ error: "Failed to verify session" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }
    }

    // ── PATH A: Authenticated self-lookup — requires valid user JWT ──
    if (action === "my-orders") {
        const authHeader = req.headers.get("Authorization") || "";
        if (!authHeader.startsWith("Bearer ")) {
            console.warn(JSON.stringify({ function: "lookup-orders", event: "missing_auth", ip, ts: new Date().toISOString() }));
            return new Response(JSON.stringify({ error: "Authentication required" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }
        const jwt = authHeader.replace("Bearer ", "");

        const userClient = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: `Bearer ${jwt}` } },
        });
        const { data: { user }, error: authErr } = await userClient.auth.getUser();
        if (authErr || !user) {
            console.warn(JSON.stringify({ function: "lookup-orders", event: "invalid_jwt", ip, ts: new Date().toISOString() }));
            return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        try {
            const adminClient = createClient(supabaseUrl, serviceRoleKey);

            const { data: orders, error: orderErr } = await adminClient
                .from("orders")
                .select("id, order_number, status, total_amount, currency, created_at, customer_email, shipping_address")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (orderErr) throw orderErr;

            // Also check entitlement status so the UI can show/hide AI Designer CTA
            const { data: entitlement } = await adminClient
                .from("entitlements")
                .select("id, status, expires_at")
                .eq("user_id", user.id)
                .eq("product_type", "ai-designer")
                .eq("status", "active")
                .maybeSingle();

            const hasAiAccess =
                !!entitlement &&
                (!entitlement.expires_at || new Date(entitlement.expires_at) > new Date());

            console.log(JSON.stringify({
                function: "lookup-orders",
                event: "my_orders_returned",
                user_id: user.id,
                order_count: orders?.length ?? 0,
                has_ai_access: hasAiAccess,
                latency_ms: Date.now() - t0,
                ts: new Date().toISOString(),
            }));

            return new Response(JSON.stringify({ orders: orders ?? [], has_ai_access: hasAiAccess }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unknown error";
            console.error(JSON.stringify({ function: "lookup-orders", event: "my_orders_error", error: message, user_id: user.id, ts: new Date().toISOString() }));
            return new Response(JSON.stringify({ error: "Failed to fetch orders" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }
    }

    // All other call patterns are rejected.
    console.warn(JSON.stringify({ function: "lookup-orders", event: "invalid_action", action, ip, ts: new Date().toISOString() }));
    return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
});
