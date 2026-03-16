import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno&no-check";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

// Check if any order contains the AI Designer product
function checkAiAccess(orders: any[]): boolean {
    for (const order of orders) {
        if (order.status !== "paid") continue;
        const items = order.items;
        if (!items) continue;
        // Check metadata keys/values or stringified items for ai-designer-access
        const itemStr = JSON.stringify(items).toLowerCase();
        if (itemStr.includes("ai-designer") || itemStr.includes("ai designer")) {
            return true;
        }
    }
    return false;
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const { email, session_id, check_ai_access } = body;

        if (!email && !session_id) {
            return new Response(
                JSON.stringify({ error: "Email or session_id is required" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // If session_id is provided, try to find/create the order directly from Stripe
        if (session_id) {
            // Check if order already exists for this session
            const { data: existingOrder } = await supabase
                .from("orders")
                .select("customer_email")
                .eq("stripe_session_id", session_id)
                .maybeSingle();

            let customerEmail = existingOrder?.customer_email;

            // If no order exists yet, fetch from Stripe and create it (fallback for webhook)
            if (!existingOrder) {
                const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
                if (stripeKey) {
                    try {
                        const stripe = new Stripe(stripeKey, {
                            apiVersion: "2023-10-16",
                            httpClient: Stripe.createFetchHttpClient(),
                        });

                        const session = await stripe.checkout.sessions.retrieve(session_id);

                        if (session.payment_status === "paid") {
                            customerEmail =
                                session.customer_details?.email ||
                                session.customer_email ||
                                null;

                            // Create the order (idempotent via unique stripe_session_id)
                            const { error: insertError } = await supabase
                                .from("orders")
                                .insert({
                                    stripe_session_id: session.id,
                                    customer_email: customerEmail,
                                    items: session.metadata || {},
                                    total_amount: session.amount_total || 0,
                                    currency: session.currency || "usd",
                                    status: "paid",
                                    shipping_address:
                                        session.shipping_details?.address || null,
                                });

                            if (insertError) {
                                // Likely duplicate — that's fine, just log it
                                console.log("Insert note:", insertError.message);
                            } else {
                                console.log(
                                    `Order created via fallback for session ${session_id}`
                                );
                            }
                        } else {
                            // Payment not completed yet
                            return new Response(
                                JSON.stringify({ orders: [], pending: true }),
                                {
                                    status: 200,
                                    headers: {
                                        ...corsHeaders,
                                        "Content-Type": "application/json",
                                    },
                                }
                            );
                        }
                    } catch (stripeErr) {
                        console.error("Stripe session fetch error:", stripeErr);
                        return new Response(
                            JSON.stringify({ orders: [], pending: true }),
                            {
                                status: 200,
                                headers: {
                                    ...corsHeaders,
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                    }
                }
            }

            // Now fetch all orders for this customer
            if (customerEmail) {
                const { data: orders, error } = await supabase
                    .from("orders")
                    .select(
                        "id, stripe_session_id, customer_email, items, total_amount, currency, status, shipping_address, created_at"
                    )
                    .eq("customer_email", customerEmail)
                    .order("created_at", { ascending: false });

                if (error) {
                    console.error("Error fetching orders:", error);
                    return new Response(
                        JSON.stringify({ error: "Failed to fetch orders" }),
                        {
                            status: 500,
                            headers: {
                                ...corsHeaders,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                }

                const result: Record<string, unknown> = { orders: orders || [] };
                if (check_ai_access) {
                    result.has_ai_access = checkAiAccess(orders || []);
                }
                return new Response(JSON.stringify(result), {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                });
            }

            // No email found
            return new Response(
                JSON.stringify({ orders: [], pending: true, has_ai_access: false }),
                {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // Email-based lookup
        const { data: orders, error } = await supabase
            .from("orders")
            .select(
                "id, stripe_session_id, customer_email, items, total_amount, currency, status, shipping_address, created_at"
            )
            .eq("customer_email", email.toLowerCase().trim())
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error);
            return new Response(
                JSON.stringify({ error: "Failed to fetch orders" }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        const result: Record<string, unknown> = { orders: orders || [] };
        if (check_ai_access) {
            result.has_ai_access = checkAiAccess(orders || []);
        }
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Failed to lookup orders";
        console.error("Lookup error:", message, error);
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
