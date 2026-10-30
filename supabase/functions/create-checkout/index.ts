import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno&no-check";
import { withAllowedOrigin } from "../_shared/cors.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

// ─── Stable product catalog ───────────────────────────────────────────────────
// Entitlement creation is driven by product_type, never by name string matching.
// When the frontend adds a cart item it must set `id` to one of these slugs.
// The webhook reads `session.metadata.line_item_types` (set here) to create
// order_items with the correct product_type — no keyword inference ever occurs.
const PRODUCT_TYPE_MAP: Record<string, "ai-designer" | "flower-press-kit" | "other"> = {
    "ai-designer-access": "ai-designer",
    "flower-press-kit": "flower-press-kit",
} as const;

// Authoritative prices in USD. The price sent by the client is ignored, so
// keep these in sync with src/pages/Shop.tsx and src/lib/site.ts.
const PRODUCT_PRICES: Record<string, number> = {
    "ai-designer-access": 19.99,
    "flower-press-kit": 34.99,
};

// Mirrors src/lib/welcomeDiscount.ts so the discount is computed server-side.
const STATIC_DISCOUNTS: Record<string, number> = { WELCOME10: 10, BLOOM10: 10, HWABELLE10: 10 };
const WELCOME_CODE_PATTERN = /^(WELCOME|HW10)(-?[2-9A-HJ-NP-Z0-9]{4,8})$/i;

function discountPercentFor(code?: string): number {
    if (!code) return 0;
    const normalized = code.trim().toUpperCase();
    if (STATIC_DISCOUNTS[normalized]) return STATIC_DISCOUNTS[normalized];
    return WELCOME_CODE_PATTERN.test(normalized) ? 10 : 0;
}

interface LineItem {
    id: string;       // must match a key in PRODUCT_TYPE_MAP or falls back to "other"
    name: string;
    price: number;    // in dollars
    quantity: number;
}

interface CheckoutRequest {
    items: LineItem[];
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    discountCode?: string;
}

Deno.serve(withAllowedOrigin(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const t0 = Date.now();
    try {
        const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
        if (!stripeKey) {
            console.log(JSON.stringify({ function: "create-checkout", event: "missing_stripe_key", ts: new Date().toISOString() }));
            return new Response(
                JSON.stringify({ error: "Payment service is not configured" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const stripe = new Stripe(stripeKey, {
            apiVersion: "2023-10-16",
            httpClient: Stripe.createFetchHttpClient(),
        });

        const body = await req.json();
        const { items, successUrl, cancelUrl, customerEmail, discountCode } = body as CheckoutRequest;

        if (!items?.length) {
            return new Response(JSON.stringify({ error: "No items provided" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const invalidItem = items.find((item) =>
            !(item.id in PRODUCT_PRICES) ||
            !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20
        );
        if (invalidItem) {
            return new Response(JSON.stringify({ error: "Invalid cart item" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const discountMultiplier = (100 - discountPercentFor(discountCode)) / 100;

        // Build line items and collect product_type map for metadata
        // This is the ONLY place product_types are associated with line items.
        const lineItemTypes: Record<string, string> = {};  // stripe_temp_key -> product_type

        const line_items = items.map((item) => {
            const productType = PRODUCT_TYPE_MAP[item.id] ?? "other";
            // We store a mapping of product name -> product_type in metadata
            // so the webhook can read it without any string inference.
            lineItemTypes[item.name] = productType;

            // Same rounding as the cart (CartDrawer.tsx) so totals match
            const unitPrice = Number((PRODUCT_PRICES[item.id] * discountMultiplier).toFixed(2));

            return {
                price_data: {
                    currency: "usd",
                    product_data: { name: item.name },
                    unit_amount: Math.round(unitPrice * 100),
                },
                quantity: item.quantity,
            };
        });

        // Whether any AI Designer item is present determines success redirect path
        const hasAiDesigner = items.some((item) => PRODUCT_TYPE_MAP[item.id] === "ai-designer");
        const hasPhysical = items.some((item) => PRODUCT_TYPE_MAP[item.id] === "flower-press-kit");
        const successPath = hasAiDesigner ? "/my-orders" : "/my-orders";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            allow_promotion_codes: true,
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            ...(customerEmail ? { customer_email: customerEmail } : {}),
            shipping_address_collection: {
                allowed_countries: ["US", "CA"],
            },
            metadata: {
                source: "hwabelle",
                discount_code: discountCode || "none",
                // Stable product type map: webhook reads this to create order_items correctly.
                // Format: JSON object of { productName: productType }
                line_item_types: JSON.stringify(lineItemTypes),
                has_ai_designer: hasAiDesigner ? "true" : "false",
                has_physical: hasPhysical ? "true" : "false",
            },
        });

        console.log(JSON.stringify({
            function: "create-checkout",
            event: "session_created",
            session_id: session.id,
            has_ai_designer: hasAiDesigner,
            has_physical: hasPhysical,
            latency_ms: Date.now() - t0,
            ts: new Date().toISOString(),
        }));

        return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to create checkout session";
        console.error(JSON.stringify({
            function: "create-checkout",
            event: "error",
            error: message,
            latency_ms: Date.now() - t0,
            ts: new Date().toISOString(),
        }));
        return new Response(
            JSON.stringify({ error: message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
}));
