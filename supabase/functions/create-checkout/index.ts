import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno&no-check";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

interface LineItem {
    name: string;
    price: number; // in dollars
    quantity: number;
}

interface CheckoutRequest {
    items: LineItem[];
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
}

Deno.serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
        if (!stripeKey) {
            console.error("STRIPE_SECRET_KEY not found in environment");
            return new Response(
                JSON.stringify({ error: "Payment service is not configured" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const stripe = new Stripe(stripeKey, {
            apiVersion: "2023-10-16",
            httpClient: Stripe.createFetchHttpClient(),
        });

        const body = await req.json();
        console.log("Checkout request received:", JSON.stringify(body));

        const { items, successUrl, cancelUrl, customerEmail } =
            body as CheckoutRequest;

        if (!items?.length) {
            return new Response(JSON.stringify({ error: "No items provided" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const line_items = items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100), // convert dollars to cents
            },
            quantity: item.quantity,
        }));

        console.log("Creating Stripe session with line_items:", JSON.stringify(line_items));

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
                item_names: items.map((item: LineItem) => item.name).join(", "),
            },
        });

        console.log("Stripe session created:", session.id);

        return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to create checkout session";
        console.error("Checkout error:", message, error);
        return new Response(
            JSON.stringify({ error: message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
