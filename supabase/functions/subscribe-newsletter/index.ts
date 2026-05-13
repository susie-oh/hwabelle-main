import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
      // We don't throw here so we can still try to send the email if DB insertion fails (e.g. if the table is different)
    }

    // 2. Send welcome email using Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is not set. Skipping welcome email.");
      return new Response(
        JSON.stringify({ message: "Subscribed successfully (email skipped - missing config)" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Hwabelle <hello@hwabelle.com>",
        to: [email],
        subject: "Welcome to Hwabelle!",
        html: `
          <div style="font-family: sans-serif; max-w-xl; margin: 0 auto;">
            <h2>Welcome to the Hwabelle community!</h2>
            <p>Thank you for subscribing. You'll be the first to receive our pressing tips, seasonal botanical inspiration, and early access to new products.</p>
            <p>As a welcome gift, here is a quick tip: When pressing thicker flowers like roses, gently slice them in half down the middle to help them press flat and dry properly!</p>
            <br/>
            <p>Warmly,</p>
            <p>The Hwabelle Team</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API error:", errorText);
      throw new Error("Failed to send welcome email");
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
