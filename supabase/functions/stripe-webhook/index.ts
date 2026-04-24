import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno&no-check";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

// ─── Confirmation email ───────────────────────────────────────────────────────
async function sendConfirmationEmail(customerEmail: string, session: any) {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
        console.warn(JSON.stringify({ function: "stripe-webhook", event: "resend_key_missing", ts: new Date().toISOString() }));
        return;
    }

    const totalFormatted = session.amount_total
        ? `$${(session.amount_total / 100).toFixed(2)}`
        : "N/A";
    const customerName =
        session.customer_details?.name || customerEmail.split("@")[0];

    let itemsHtml = "";
    try {
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
            apiVersion: "2023-10-16",
            httpClient: Stripe.createFetchHttpClient(),
        });
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        itemsHtml = lineItems.data
            .map(
                (item: any) =>
                    `<tr>
            <td style="padding:12px 0;border-bottom:1px solid #f0ece8;font-family:Georgia,serif;font-size:15px;color:#2c2c2c;">${item.description || "Item"}</td>
            <td style="padding:12px 0;border-bottom:1px solid #f0ece8;text-align:center;color:#6b6b6b;font-size:14px;">${item.quantity}</td>
            <td style="padding:12px 0;border-bottom:1px solid #f0ece8;text-align:right;font-family:Georgia,serif;font-size:15px;color:#2c2c2c;">$${((item.amount_total || 0) / 100).toFixed(2)}</td>
          </tr>`
            )
            .join("");
    } catch (e) {
        itemsHtml = `<tr><td colspan="3" style="padding:12px 0;color:#6b6b6b;">See your Stripe receipt for details.</td></tr>`;
    }

    const hasAiDesigner = session.metadata?.has_ai_designer === "true";

    const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf8f5;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:600px;">
        <tr><td style="padding:40px 40px 24px;text-align:center;border-bottom:1px solid #f0ece8;">
          <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:normal;color:#2c2c2c;margin:0 0 8px;">Hwabelle</h1>
          <p style="font-size:13px;color:#9b9b9b;margin:0;letter-spacing:2px;text-transform:uppercase;">Flower Preservation</p>
        </td></tr>
        <tr><td style="padding:40px 40px 16px;text-align:center;">
          <h2 style="font-family:Georgia,serif;font-size:24px;font-weight:normal;color:#2c2c2c;margin:0 0 12px;">Thank you, ${customerName}!</h2>
          <p style="font-size:15px;color:#6b6b6b;line-height:1.6;margin:0;">Your order has been confirmed and is being prepared.</p>
        </td></tr>
        <tr><td style="padding:24px 40px 8px;">
          <p style="font-size:11px;color:#9b9b9b;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 16px;">Order Summary</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <thead><tr>
              <th style="text-align:left;padding-bottom:8px;font-size:11px;color:#9b9b9b;text-transform:uppercase;letter-spacing:1px;font-weight:normal;">Item</th>
              <th style="text-align:center;padding-bottom:8px;font-size:11px;color:#9b9b9b;text-transform:uppercase;letter-spacing:1px;font-weight:normal;">Qty</th>
              <th style="text-align:right;padding-bottom:8px;font-size:11px;color:#9b9b9b;text-transform:uppercase;letter-spacing:1px;font-weight:normal;">Total</th>
            </tr></thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </td></tr>
        <tr><td style="padding:16px 40px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-family:Georgia,serif;font-size:16px;color:#2c2c2c;padding-top:8px;">Total</td>
              <td style="font-family:Georgia,serif;font-size:18px;color:#2c2c2c;text-align:right;font-weight:bold;padding-top:8px;">${totalFormatted}</td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:32px 40px;background-color:#faf8f5;">
          <h3 style="font-family:Georgia,serif;font-size:16px;font-weight:normal;color:#2c2c2c;margin:0 0 16px;">What's Next</h3>
          <ul style="margin:0;padding:0 0 0 20px;color:#6b6b6b;font-size:14px;line-height:2;">
            ${hasAiDesigner ? `<li>To activate your AI Designer, visit <a href="https://hwabelle.com/my-orders" style="color:#2c2c2c;">hwabelle.com/my-orders</a> and sign in or create an account using this email address.</li>` : ""}
            <li>You'll receive a shipping confirmation when your order is on its way.</li>
            <li>Questions? Visit our <a href="https://hwabelle.com/faq" style="color:#2c2c2c;">FAQ</a> or reply to this email.</li>
          </ul>
        </td></tr>
        <tr><td style="padding:32px 40px;text-align:center;border-top:1px solid #f0ece8;">
          <p style="font-size:13px;color:#9b9b9b;margin:0 0 8px;">Hwabelle — Preserve nature's beauty, one bloom at a time.</p>
          <p style="font-size:12px;color:#c0c0c0;margin:0;"><a href="https://hwabelle.com" style="color:#9b9b9b;text-decoration:none;">hwabelle.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "Hwabelle <orders@hwabelle.shop>";
    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${resendKey}`,
            },
            body: JSON.stringify({
                from: fromEmail,
                to: [customerEmail],
                subject: `Order Confirmed — Thank you, ${customerName}!`,
                html: htmlBody,
            }),
        });
        if (!res.ok) {
            const errText = await res.text();
            console.error(JSON.stringify({ function: "stripe-webhook", event: "resend_error", status: res.status, detail: errText, ts: new Date().toISOString() }));
        } else {
            console.log(JSON.stringify({ function: "stripe-webhook", event: "confirmation_email_sent", to: customerEmail, ts: new Date().toISOString() }));
        }
    } catch (e) {
        console.error(JSON.stringify({ function: "stripe-webhook", event: "resend_exception", error: String(e), ts: new Date().toISOString() }));
    }
}

// ─── Product type resolution (stable, metadata-driven) ───────────────────────
// Reads from session.metadata.line_item_types (set by create-checkout).
// Falls back to Stripe description heuristic ONLY for items not in the map,
// and only to classify as 'other' vs an explicit slug.
function resolveProductType(
    itemName: string,
    lineItemTypes: Record<string, string>
): "ai-designer" | "flower-press-kit" | "other" {
    const mapped = lineItemTypes[itemName];
    if (mapped === "ai-designer" || mapped === "flower-press-kit") return mapped;
    return "other";
}

// ─── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    const t0 = Date.now();

    // ── Mandatory Stripe webhook secret ──
    // CRITICAL: never accept events without signature verification.
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeKey) {
        console.error(JSON.stringify({ function: "stripe-webhook", event: "startup_error", error: "STRIPE_SECRET_KEY not configured", ts: new Date().toISOString() }));
        return new Response(
            JSON.stringify({ error: "Payment service not configured" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    if (!webhookSecret) {
        // Hard fail — do not silently accept unsigned events in production.
        console.error(JSON.stringify({ function: "stripe-webhook", event: "startup_error", error: "STRIPE_WEBHOOK_SECRET not configured — rejecting all events", ts: new Date().toISOString() }));
        return new Response(
            JSON.stringify({ error: "Webhook secret not configured — contact administrator" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    try {
        const stripe = new Stripe(stripeKey, {
            apiVersion: "2023-10-16",
            httpClient: Stripe.createFetchHttpClient(),
        });

        const body = await req.text();
        const signature = req.headers.get("stripe-signature");
        if (!signature) {
            return new Response(
                JSON.stringify({ error: "Missing stripe-signature header" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Verify signature — throws if invalid
        const cryptoProvider = Stripe.createSubtleCryptoProvider();
        const event = await stripe.webhooks.constructEventAsync(
            body, signature, webhookSecret, undefined, cryptoProvider
        );

        console.log(JSON.stringify({
            function: "stripe-webhook",
            event: "received",
            type: event.type,
            event_id: event.id,
            ts: new Date().toISOString(),
        }));

        if (event.type === "checkout.session.completed") {
            const session = event.data.object as any;

            const supabase = createClient(
                Deno.env.get("SUPABASE_URL")!,
                Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
            );

            const customerEmail =
                session.customer_details?.email || session.customer_email || null;

            // ── Idempotency: check if order already exists ──
            const { data: existingOrder } = await supabase
                .from("orders")
                .select("id")
                .eq("stripe_session_id", session.id)
                .maybeSingle();

            let orderId: string;

            if (existingOrder) {
                orderId = existingOrder.id;
                console.log(JSON.stringify({
                    function: "stripe-webhook",
                    event: "order_exists",
                    order_id: orderId,
                    session_id: session.id,
                    ts: new Date().toISOString(),
                }));
            } else {
                // ── Resolve user_id via targeted email lookup (no pagination ceiling) ──
                // auth.admin.listUsers() caps at 1,000 users. Use a SECURITY DEFINER
                // Postgres function instead for O(1) lookup against auth.users directly.
                let userId: string | null = null;
                if (customerEmail) {
                    const { data: resolvedId, error: userLookupErr } = await supabase.rpc(
                        "get_verified_user_id_by_email",
                        { p_email: customerEmail.toLowerCase() }
                    );
                    if (userLookupErr) {
                        console.warn(JSON.stringify({
                            function: "stripe-webhook",
                            event: "user_lookup_error",
                            error: userLookupErr.message,
                            email: customerEmail,
                            ts: new Date().toISOString(),
                        }));
                    } else if (resolvedId) {
                        userId = resolvedId as string;
                    }
                }

                // ── Insert order ──
                const { data: newOrder, error: insertErr } = await supabase
                    .from("orders")
                    .insert({
                        stripe_session_id: session.id,
                        customer_email: customerEmail,
                        user_id: userId,
                        items: session.metadata || {},
                        total_amount: session.amount_total || 0,
                        currency: session.currency || "usd",
                        status: "paid",
                        shipping_address: session.shipping_details?.address || null,
                    })
                    .select("id")
                    .single();

                if (insertErr || !newOrder) {
                    console.error(JSON.stringify({
                        function: "stripe-webhook",
                        event: "order_insert_error",
                        error: insertErr?.message,
                        session_id: session.id,
                        ts: new Date().toISOString(),
                    }));
                    return new Response(
                        JSON.stringify({ error: "Failed to create order" }),
                        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                    );
                }
                orderId = newOrder.id;
                console.log(JSON.stringify({
                    function: "stripe-webhook",
                    event: "order_created",
                    order_id: orderId,
                    user_id: userId,
                    session_id: session.id,
                    ts: new Date().toISOString(),
                }));
            }

            // ── Fetch Stripe line items — used for both order_items and MCF ──
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

            // ── Parse product type map from metadata (set by create-checkout) ──
            let lineItemTypes: Record<string, string> = {};
            try {
                lineItemTypes = JSON.parse(session.metadata?.line_item_types || "{}");
            } catch {
                lineItemTypes = {};
            }

            // ── Insert order_items (idempotent — UNIQUE on order_id + stripe_line_item_id) ──
            let hasAiDesigner = false;
            const aiDesignerOrderItemIds: string[] = [];

            for (const li of lineItems.data) {
                const productType = resolveProductType(
                    li.description || "",
                    lineItemTypes
                );
                if (productType === "ai-designer") hasAiDesigner = true;

                const { data: insertedItem, error: itemErr } = await supabase
                    .from("order_items")
                    .upsert(
                        {
                            order_id: orderId,
                            stripe_line_item_id: li.id,
                            stripe_price_id: li.price?.id || null,
                            product_name: li.description || "Unknown",
                            product_type: productType,
                            unit_amount: li.price?.unit_amount || 0,
                            quantity: li.quantity || 1,
                        },
                        { onConflict: "order_id,stripe_line_item_id", ignoreDuplicates: true }
                    )
                    .select("id")
                    .maybeSingle();

                if (itemErr) {
                    console.error(JSON.stringify({
                        function: "stripe-webhook",
                        event: "order_item_error",
                        error: itemErr.message,
                        line_item_id: li.id,
                        ts: new Date().toISOString(),
                    }));
                } else if (insertedItem && productType === "ai-designer") {
                    aiDesignerOrderItemIds.push(insertedItem.id);
                }
            }

            // ── Create entitlement if AI Designer purchased ──
            if (hasAiDesigner) {
                // Resolve user_id from order (may have been set above or pre-existing)
                const { data: orderRow } = await supabase
                    .from("orders")
                    .select("user_id")
                    .eq("id", orderId)
                    .single();
                const userId = orderRow?.user_id || null;

                // Check for existing active entitlement for this user (repeat purchase guard)
                if (userId) {
                    const { data: existingEnt } = await supabase
                        .from("entitlements")
                        .select("id")
                        .eq("user_id", userId)
                        .eq("product_type", "ai-designer")
                        .eq("status", "active")
                        .maybeSingle();

                    if (existingEnt) {
                        console.log(JSON.stringify({
                            function: "stripe-webhook",
                            event: "entitlement_already_active",
                            user_id: userId,
                            product_type: "ai-designer",
                            existing_entitlement_id: existingEnt.id,
                            order_id: orderId,
                            note: "Repeat purchase — existing entitlement untouched",
                            ts: new Date().toISOString(),
                        }));
                        // Still record the order and order_items (valid purchase record),
                        // but do not create a duplicate entitlement.
                    } else {
                        // Create new entitlement
                        await insertEntitlement(supabase, userId, orderId);
                    }
                } else {
                    // No user account yet — create entitlement with null user_id.
                    // get-entitlement will backfill user_id when the customer signs in.
                    await insertEntitlement(supabase, null, orderId);
                }
            }

            // ── Confirmation email ──
            if (customerEmail) {
                await sendConfirmationEmail(customerEmail, session);
            }

            // ── Amazon MCF auto-fulfillment for physical items ──
            if (session.shipping_details?.address) {
                try {
                    const mcfItems: { productId: string; quantity: number }[] = [];
                    for (const li of lineItems.data) {
                        const productType = resolveProductType(li.description || "", lineItemTypes);
                        if (productType === "flower-press-kit") {
                            mcfItems.push({ productId: "flower-press-kit", quantity: li.quantity || 1 });
                        }
                    }

                    if (mcfItems.length > 0) {
                        const internalSecret = Deno.env.get("INTERNAL_FUNCTION_SECRET");
                        if (!internalSecret) {
                            console.warn(JSON.stringify({ function: "stripe-webhook", event: "mcf_skipped", reason: "INTERNAL_FUNCTION_SECRET not set", ts: new Date().toISOString() }));
                        } else {
                            const mcfRes = await supabase.functions.invoke("amazon-mcf", {
                                body: {
                                    action: "create",
                                    orderId: session.id,
                                    customerName: session.customer_details?.name || "Customer",
                                    shippingAddress: session.shipping_details.address,
                                    items: mcfItems,
                                    shippingSpeed: "Standard",
                                },
                                headers: { "x-internal-secret": internalSecret },
                            });

                            if (mcfRes.error) {
                                console.error(JSON.stringify({ function: "stripe-webhook", event: "mcf_error", error: mcfRes.error, ts: new Date().toISOString() }));
                            } else {
                                console.log(JSON.stringify({ function: "stripe-webhook", event: "mcf_submitted", order_id: orderId, ts: new Date().toISOString() }));
                            }
                        }
                    }
                } catch (mcfErr) {
                    // MCF failure must not fail the webhook — order is already saved.
                    console.error(JSON.stringify({ function: "stripe-webhook", event: "mcf_exception", error: String(mcfErr), ts: new Date().toISOString() }));
                }
            }
        }

        console.log(JSON.stringify({
            function: "stripe-webhook",
            event: "completed",
            type: event.type,
            latency_ms: Date.now() - t0,
            ts: new Date().toISOString(),
        }));

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Webhook processing failed";
        console.error(JSON.stringify({
            function: "stripe-webhook",
            event: "error",
            error: message,
            latency_ms: Date.now() - t0,
            ts: new Date().toISOString(),
        }));
        return new Response(
            JSON.stringify({ error: message }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});

// ── Helper: insert entitlement (idempotent via UNIQUE order_id + product_type) ──
async function insertEntitlement(
    supabase: any,
    userId: string | null,
    orderId: string
): Promise<void> {
    const { error } = await supabase
        .from("entitlements")
        .upsert(
            {
                user_id: userId,
                order_id: orderId,
                product_type: "ai-designer",
                source: "direct",
                status: "active",
                expires_at: null, // one-time purchase = lifetime
            },
            { onConflict: "order_id,product_type", ignoreDuplicates: true }
        );

    if (error) {
        console.error(JSON.stringify({
            function: "stripe-webhook",
            event: "entitlement_insert_error",
            error: error.message,
            order_id: orderId,
            user_id: userId,
            ts: new Date().toISOString(),
        }));
    } else {
        console.log(JSON.stringify({
            function: "stripe-webhook",
            event: "entitlement_created",
            order_id: orderId,
            user_id: userId,
            product_type: "ai-designer",
            ts: new Date().toISOString(),
        }));
    }
}
