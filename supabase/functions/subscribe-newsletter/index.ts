import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { sendSesEmail } from "../_shared/ses.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, first_name, discount_code } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const couponCode = (discount_code || "WELCOME10").trim().toUpperCase();
    const greeting = first_name ? `Hi ${first_name.trim()},` : "Hello,";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Save or update subscriber in the database
    // The customers table might have a unique constraint on email, so we do an upsert
    const { error: dbError } = await supabase
      .from('customers')
      .upsert(
        { email: email.trim().toLowerCase(), consent: true },
        { onConflict: 'email' }
      );

    if (dbError) {
      console.error("Error saving subscriber to DB:", dbError);
    }

    // 2. Send welcome email using Amazon SES (with fallback to Resend)
    const welcomeHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e8e4df; border-radius: 12px; overflow: hidden; color: #2c2c2c;">
        <div style="background-color: #3f1e3c; padding: 28px 24px; text-align: center;">
          <h1 style="font-family: Georgia, serif; color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 0.5px;">Hwabelle</h1>
          <p style="color: #e5d2e2; margin: 6px 0 0 0; font-size: 13px;">Fresh today. Fragile tomorrow. Framed forever.</p>
        </div>

        <div style="padding: 32px 24px;">
          <h2 style="font-family: Georgia, serif; color: #2c2c2c; margin: 0 0 14px 0; font-size: 20px;">${greeting} Welcome to Hwabelle! 🌸</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #555555; margin: 0 0 20px 0;">
            Thank you for joining our community of botanical lovers, floral artists, and keepsake preservers. As our welcome gift, here is your <strong>10% discount code</strong> for your first order:
          </p>

          <!-- Coupon Box -->
          <div style="background-color: #faf6f0; border: 2px dashed #d4af37; border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="font-size: 12px; font-weight: 700; color: #8c7322; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px 0;">Your 10% Discount Code</p>
            <div style="font-size: 26px; font-family: monospace; font-weight: 700; color: #3f1e3c; letter-spacing: 2px;">${couponCode}</div>
            <p style="font-size: 12px; color: #777777; margin: 8px 0 0 0;">Enter this code at checkout on <a href="https://hwabelle.shop" style="color: #3f1e3c; font-weight: 600;">hwabelle.shop</a> to save 10% on your Flower Press Kit.</p>
          </div>

          <!-- Free Guide Access -->
          <div style="background-color: #f8f9f8; border-left: 4px solid #3f1e3c; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: #2c2c2c;">📖 Complimentary Botanical Guide</p>
            <p style="margin: 0; font-size: 13px; color: #555555; line-height: 1.5;">
              Explore our comprehensive <em>Beginner's Master Guide to Flower Pressing</em> with step-by-step instructions, moisture extraction science, and bridal bouquet preservation tips.
            </p>
            <p style="margin: 10px 0 0 0;">
              <a href="https://hwabelle.shop/resources/flower-pressing-guide" style="font-size: 13px; color: #3f1e3c; font-weight: 600; text-decoration: underline;">Read Your Free Guide Online →</a>
            </p>
          </div>

          <!-- Botanical Tip -->
          <div style="background-color: #faf8f5; padding: 14px 16px; margin: 20px 0; border-radius: 6px;">
            <p style="margin: 0; font-size: 13px; color: #666666; line-height: 1.5;">
              <strong>Botanical Studio Tip:</strong> When pressing thicker blooms like garden roses or peonies, gently slice them down the center before pressing to maintain uniform flat drying and prevent mold!
            </p>
          </div>

          <div style="text-align: center; margin: 28px 0 10px 0;">
            <a href="https://hwabelle.shop/product/flower-press-kit" style="display: inline-block; background-color: #3f1e3c; color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 8px;">Shop the Flower Press Kit (10% Off) →</a>
          </div>

          <p style="font-size: 14px; color: #777777; margin: 28px 0 0 0;">Warmly,<br/><strong>The Hwabelle Team</strong></p>
        </div>

        <div style="background-color: #f6f6f6; border-top: 1px solid #eeeeee; padding: 16px; text-align: center; font-size: 11px; color: #999999;">
          <p style="margin: 0;">Hwabelle · <a href="https://hwabelle.shop" style="color: #999999;">hwabelle.shop</a></p>
        </div>
      </div>
    `;

    const fromEmail = Deno.env.get("AWS_SES_FROM_EMAIL") || Deno.env.get("RESEND_FROM_EMAIL") || "Hwabelle <hello@hwabelle.shop>";

    const sesRes = await sendSesEmail({
      from: fromEmail,
      to: email,
      subject: `Your 10% Discount Code & Welcome to Hwabelle! 🌸`,
      html: welcomeHtml,
    });

    if (sesRes.success) {
      console.log("Welcome email sent via SES:", sesRes.messageId);
    } else {
      console.warn("SES send failed, attempting Resend fallback:", sesRes.error);
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [email],
            subject: "Welcome to Hwabelle!",
            html: welcomeHtml,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Resend API error:", errorText);
        }
      }
    }

    return new Response(
      JSON.stringify({ message: "Subscribed and welcome email sent successfully" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error subscribing:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
