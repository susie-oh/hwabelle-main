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
    const { email } = await req.json();

    if (!email) {
      throw new Error("Email is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Save or update subscriber in the database
    // The customers table might have a unique constraint on email, so we do an upsert
    const { error: dbError } = await supabase
      .from('customers')
      .upsert(
        { email, consent: true },
        { onConflict: 'email' }
      );

    if (dbError) {
      console.error("Error saving subscriber to DB:", dbError);
    }

    // 2. Send welcome email using Amazon SES (with fallback to Resend)
    const welcomeHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2c2c2c; padding: 20px;">
        <h2 style="font-family: Georgia, serif; color: #2c2c2c;">Welcome to the Hwabelle community!</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #555;">Thank you for subscribing. You'll be the first to receive our pressing tips, seasonal botanical inspiration, and early access to new products.</p>
        <div style="background-color: #faf8f5; border-left: 4px solid #3f1e3c; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #444;"><strong>Botanical Tip:</strong> When pressing thicker flowers like roses or peonies, gently slice them in half down the middle to help them press flat and dry evenly!</p>
        </div>
        <p style="font-size: 14px; color: #777;">Warmly,<br/><strong>The Hwabelle Team</strong></p>
        <p style="font-size: 12px; color: #999; margin-top: 30px;"><a href="https://hwabelle.shop" style="color: #999;">hwabelle.shop</a></p>
      </div>
    `;

    const fromEmail = Deno.env.get("AWS_SES_FROM_EMAIL") || Deno.env.get("RESEND_FROM_EMAIL") || "Hwabelle <hello@hwabelle.shop>";

    const sesRes = await sendSesEmail({
      from: fromEmail,
      to: email,
      subject: "Welcome to Hwabelle!",
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
