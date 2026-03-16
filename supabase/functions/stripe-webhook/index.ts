import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno&no-check";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

async function sendConfirmationEmail(
    customerEmail: string,
    session: any
) {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
        console.warn("RESEND_API_KEY not set — skipping confirmation email");
        return;
    }

    const totalFormatted = session.amount_total
        ? `$${(session.amount_total / 100).toFixed(2)}`
        : "N/A";

    const customerName =
        session.customer_details?.name || customerEmail.split("@")[0];

    // Fetch line items from Stripe for email details
    let itemsHtml = "";
    try {
        const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")!;
        const stripe = new Stripe(stripeKey, {
            apiVersion: "2023-10-16",
            httpClient: Stripe.createFetchHttpClient(),
        });
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        itemsHtml = lineItems.data
            .map(
                (item: any) =>
                    `<tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0ece8; font-family: Georgia, serif; font-size: 15px; color: #2c2c2c;">${item.description || item.price?.product?.name || "Item"}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0ece8; text-align: center; color: #6b6b6b; font-size: 14px;">${item.quantity}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f0ece8; text-align: right; font-family: Georgia, serif; font-size: 15px; color: #2c2c2c;">$${((item.amount_total || 0) / 100).toFixed(2)}</td>
          </tr>`
            )
            .join("");
    } catch (e) {
        console.error("Failed to fetch line items:", e);
        itemsHtml = `<tr><td colspan="3" style="padding: 12px 0; color: #6b6b6b;">Order items — see your Stripe receipt for details.</td></tr>`;
    }

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf8f5; padding: 40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px;">

        <!-- Header -->
        <tr><td style="padding: 40px 40px 24px; text-align: center; border-bottom: 1px solid #f0ece8;">
          <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: normal; color: #2c2c2c; margin: 0 0 8px;">Hwabelle</h1>
          <p style="font-size: 13px; color: #9b9b9b; margin: 0; letter-spacing: 2px; text-transform: uppercase;">Flower Preservation</p>
        </td></tr>

        <!-- Thank You -->
        <tr><td style="padding: 40px 40px 16px; text-align: center;">
          <h2 style="font-family: Georgia, serif; font-size: 24px; font-weight: normal; color: #2c2c2c; margin: 0 0 12px;">Thank you, ${customerName}!</h2>
          <p style="font-size: 15px; color: #6b6b6b; line-height: 1.6; margin: 0;">Your order has been confirmed and is being prepared. We'll send you an update when it ships.</p>
        </td></tr>

        <!-- Order Details -->
        <tr><td style="padding: 24px 40px 8px;">
          <p style="font-size: 11px; color: #9b9b9b; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 16px;">Order Summary</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th style="text-align: left; padding-bottom: 8px; font-size: 11px; color: #9b9b9b; text-transform: uppercase; letter-spacing: 1px; font-weight: normal;">Item</th>
                <th style="text-align: center; padding-bottom: 8px; font-size: 11px; color: #9b9b9b; text-transform: uppercase; letter-spacing: 1px; font-weight: normal;">Qty</th>
                <th style="text-align: right; padding-bottom: 8px; font-size: 11px; color: #9b9b9b; text-transform: uppercase; letter-spacing: 1px; font-weight: normal;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </td></tr>

        <!-- Total -->
        <tr><td style="padding: 16px 40px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-family: Georgia, serif; font-size: 16px; color: #2c2c2c; padding-top: 8px;">Total</td>
              <td style="font-family: Georgia, serif; font-size: 18px; color: #2c2c2c; text-align: right; font-weight: bold; padding-top: 8px;">${totalFormatted}</td>
            </tr>
          </table>
        </td></tr>

        <!-- What's Next -->
        <tr><td style="padding: 32px 40px; background-color: #faf8f5;">
          <h3 style="font-family: Georgia, serif; font-size: 16px; font-weight: normal; color: #2c2c2c; margin: 0 0 16px;">What's Next</h3>
          <ul style="margin: 0; padding: 0 0 0 20px; color: #6b6b6b; font-size: 14px; line-height: 2;">
            <li>You'll receive a shipping confirmation when your order is on its way.</li>
            <li>If you purchased AI Designer Access, you can start using it right away at <a href="https://hwabelle.com/designer-test" style="color: #2c2c2c;">hwabelle.com/designer</a>.</li>
            <li>Questions? Reply to this email or visit our <a href="https://hwabelle.com/faq" style="color: #2c2c2c;">FAQ</a>.</li>
          </ul>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding: 32px 40px; text-align: center; border-top: 1px solid #f0ece8;">
          <p style="font-size: 13px; color: #9b9b9b; margin: 0 0 8px;">Hwabelle — Preserve nature's beauty, one bloom at a time.</p>
          <p style="font-size: 12px; color: #c0c0c0; margin: 0;">
            <a href="https://hwabelle.com" style="color: #9b9b9b; text-decoration: none;">hwabelle.com</a>
          </p>
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
            console.error("Resend API error:", res.status, errText);
        } else {
            console.log(`Confirmation email sent to ${customerEmail}`);
        }
    } catch (e) {
        console.error("Failed to send confirmation email:", e);
    }
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
        const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

        if (!stripeKey) {
            throw new Error("STRIPE_SECRET_KEY is not configured");
        }

        const stripe = new Stripe(stripeKey, {
            apiVersion: "2023-10-16",
            httpClient: Stripe.createFetchHttpClient(),
        });

        const body = await req.text();
        let event: any;

        // Verify webhook signature if secret is available
        // Must use constructEventAsync + SubtleCryptoProvider for Deno
        if (webhookSecret) {
            const signature = req.headers.get("stripe-signature");
            if (!signature) {
                return new Response(
                    JSON.stringify({ error: "Missing stripe-signature header" }),
                    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }
            const cryptoProvider = Stripe.createSubtleCryptoProvider();
            event = await stripe.webhooks.constructEventAsync(
                body,
                signature,
                webhookSecret,
                undefined,
                cryptoProvider
            );
        } else {
            console.warn("STRIPE_WEBHOOK_SECRET not set — skipping signature verification");
            event = JSON.parse(body);
        }

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;

            // Initialize Supabase admin client
            const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
            const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
            const supabase = createClient(supabaseUrl, supabaseServiceKey);

            const customerEmail =
                session.customer_details?.email || session.customer_email;

            // Check idempotency — only insert if order doesn't exist yet
            const { data: existingOrder } = await supabase
                .from("orders")
                .select("id")
                .eq("stripe_session_id", session.id)
                .maybeSingle();

            if (existingOrder) {
                console.log(`Order already exists for session ${session.id}, skipping insert`);
            } else {
                // Insert order record
                const { error: insertError } = await supabase.from("orders").insert({
                    stripe_session_id: session.id,
                    customer_email: customerEmail,
                    items: session.metadata || {},
                    total_amount: session.amount_total || 0,
                    currency: session.currency || "usd",
                    status: "paid",
                    shipping_address: session.shipping_details?.address || null,
                });

                if (insertError) {
                    console.error("Failed to insert order:", insertError);
                } else {
                    console.log(`Order created for session ${session.id}`);
                }
            }

            // Always send confirmation email (even if order was pre-created by fallback)
            if (customerEmail) {
                await sendConfirmationEmail(customerEmail, session);
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Webhook processing failed";
        console.error("Webhook error:", message, error);
        return new Response(
            JSON.stringify({ error: message }),
            {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
