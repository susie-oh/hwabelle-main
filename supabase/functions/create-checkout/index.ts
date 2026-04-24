import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno&no-check";

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
}

Deno.serve(async (req) => {
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
        const { items, successUrl, cancelUrl, customerEmail } = body as CheckoutRequest;

        if (!items?.length) {
            return new Response(JSON.stringify({ error: "No items provided" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Build line items and collect product_type map for metadata
        // This is the ONLY place product_types are associated with line items.
        const lineItemTypes: Record<string, string> = {};  // stripe_temp_key -> product_type

        const line_items = items.map((item) => {
            const productType = PRODUCT_TYPE_MAP[item.id] ?? "other";
            // We store a mapping of product name -> product_type in metadata
            // so the webhook can read it without any string inference.
            lineItemTypes[item.name] = productType;

            return {
                price_data: {
                    currency: "usd",
                    product_data: { name: item.name },
                    unit_amount: Math.round(item.price * 100),
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
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            ...(customerEmail ? { customer_email: customerEmail } : {}),
            shipping_address_collection: {
                allowed_countries: ["US", "CA"],
            },
            metadata: {
                source: "hwabelle",
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
});
