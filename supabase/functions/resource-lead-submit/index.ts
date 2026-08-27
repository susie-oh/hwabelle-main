import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendSesEmail } from "../_shared/ses.ts";

const ALLOWED_RESOURCE_IDS = [
  "flower-pressing-guide",
  "flower-selection-guide",
  "quick-start-guide",
] as const;

type AllowedResourceId = typeof ALLOWED_RESOURCE_IDS[number];

interface ResourceLeadPayload {
  email?: string;
  first_name?: string;
  resource_id?: string;
  source_page?: string;
  source_type?: string;
  offer_trigger?: string;
  resource_position?: string;
  marketing_consent?: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  hwabelle_hp?: string; // Honeypot
}

const RESOURCE_DETAILS: Record<
  AllowedResourceId,
  {
    title: string;
    subtitle: string;
    description: string;
    path: string;
  }
> = {
  "flower-pressing-guide": {
    title: "The Beginner's Master Guide to Flower Pressing",
    subtitle: "How to Preserve Wedding Bouquets, Garden Blooms, and Sentimental Keepsakes",
    description: "The complete science of moisture extraction, pressure distribution, drying timeline matrices, and archival framing.",
    path: "/resources/flower-pressing-guide",
  },
  "flower-selection-guide": {
    title: "The Botanical Selection & Harvesting Field Guide",
    subtitle: "How to Forage, Pick, and Prepare Blooms for Flawless Pressed Flower Art",
    description: "The 4 golden rules of harvesting, 3 flower suitability tiers, 3D rose dissection techniques, and color retention science.",
    path: "/resources/flower-selection-guide",
  },
  "quick-start-guide": {
    title: "Press Flowers in 4 Simple Steps",
    subtitle: "The Official Hwabelle Quick-Start Visual Operating Guide",
    description: "The 4-step framework: CHOOSE → ARRANGE → PRESS → CREATE.",
    path: "/resources/quick-start-guide",
  },
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PAYLOAD_SIZE = 50 * 1024; // 50 KB

function getBaseUrl(): string {
  return Deno.env.get("SITE_URL") || "https://hwabelle.shop";
}

function buildGuideEmailHtml(
  resourceId: AllowedResourceId,
  firstName?: string
): { subject: string; html: string; text: string } {
  const meta = RESOURCE_DETAILS[resourceId];
  const baseUrl = getBaseUrl();
  const guideUrl = `${baseUrl}${meta.path}`;
  const printUrl = `${baseUrl}${meta.path}?print=true`;
  const productUrl = `${baseUrl}/product/flower-press-kit`;

  const greeting = firstName ? `Hi ${firstName},` : "Hello,";

  const subject = `Your Free Guide is Ready: ${meta.title} 🌸`;

  const text = `${greeting}

Your requested botanical guide from Hwabelle is ready to read and download.

${meta.title}
${meta.subtitle}

Read Online: ${guideUrl}
Print / Save as PDF: ${printUrl}

Inside this guide:
- ${meta.description}

Explore the Hwabelle Acrylic Flower Press Kit:
${productUrl}

Warmly,
The Hwabelle Botanical Design Studio
hwabelle.shop`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F9F8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E2822; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F9F8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E6ECE8; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <!-- Header -->
          <tr>
            <td style="background-color: #1E342B; padding: 36px 40px; text-align: center;">
              <span style="color: #A3C9B8; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; display: block; margin-bottom: 8px;">
                Hwabelle Botanical Studio
              </span>
              <h1 style="color: #FFFFFF; font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 600; margin: 0; line-height: 1.3;">
                Your Free Botanical Guide is Ready 🌸
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              <p style="font-size: 16px; margin: 0 0 20px 0; color: #2C3E35;">
                ${greeting}
              </p>
              <p style="font-size: 15px; margin: 0 0 24px 0; color: #4A5D53; line-height: 1.7;">
                Thank you for your passion for botanical preservation. Your requested master guide, <strong>${meta.title}</strong>, has been unlocked and is ready for you below.
              </p>

              <!-- Guide Card Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4F7F5; border-radius: 12px; border: 1px solid #DDE6E0; margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 24px;">
                    <span style="color: #1E342B; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 6px;">
                      Free Botanical Masterclass
                    </span>
                    <h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 700; color: #1E342B; margin: 0 0 8px 0; line-height: 1.3;">
                      ${meta.title}
                    </h2>
                    <p style="font-size: 13px; color: #5C7065; margin: 0 0 18px 0; line-height: 1.5;">
                      ${meta.description}
                    </p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color: #1E342B; border-radius: 8px; text-align: center;">
                          <a href="${guideUrl}" target="_blank" style="display: inline-block; padding: 12px 26px; color: #FFFFFF; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                            Read Online Now →
                          </a>
                        </td>
                        <td style="width: 12px;"></td>
                        <td style="border: 1px solid #1E342B; border-radius: 8px; text-align: center;">
                          <a href="${printUrl}" target="_blank" style="display: inline-block; padding: 11px 20px; color: #1E342B; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                            Save / Print PDF
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Product Discovery Section -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF6F0; border-radius: 12px; border: 1px solid #EFE6D8; margin: 0 0 24px 0;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 700; color: #3A2B1D; margin: 0 0 8px 0;">
                      The Hwabelle Acrylic Flower Press Kit
                    </h3>
                    <p style="font-size: 13px; color: #6E5B4B; margin: 0 0 16px 0; line-height: 1.5;">
                      Designed with crystal-clear plates for 360-degree transparency, uniform brass bolt torque, and high-absorption blotting layers.
                    </p>
                    <a href="${productUrl}" target="_blank" style="display: inline-block; padding: 10px 22px; background-color: #3A2B1D; color: #FFFFFF; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 8px;">
                      Shop the Flower Press Kit →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F8F9F8; padding: 24px 40px; text-align: center; border-top: 1px solid #E6ECE8;">
              <p style="font-size: 12px; color: #7A8E82; margin: 0 0 6px 0;">
                Hwabelle Botanicals · Fresh today. Fragile tomorrow. Framed forever.
              </p>
              <p style="font-size: 11px; color: #9AB0A4; margin: 0;">
                You received this email because you requested a free botanical guide on hwabelle.shop.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

async function sendGuideEmail(
  toEmail: string,
  resourceId: AllowedResourceId,
  firstName?: string
): Promise<{ success: boolean; provider?: string; error?: string }> {
  const { subject, html, text } = buildGuideEmailHtml(resourceId, firstName);

  // 1. Primary: AWS SES v2
  try {
    const sesResult = await sendSesEmail({
      to: toEmail,
      from: "Hwabelle Botanicals <hello@hwabelle.shop>",
      subject,
      html,
      text,
      replyTo: "support@hwabelle.shop",
    });

    if (sesResult.success) {
      console.log(`[SES] Guide email dispatched to ${toEmail} for ${resourceId}`);
      return { success: true, provider: "aws-ses" };
    } else {
      console.warn(`[SES] Failed to send email: ${sesResult.error}`);
    }
  } catch (sesErr) {
    console.warn(`[SES] Unexpected exception:`, sesErr);
  }

  // 2. Secondary Fallback: Resend API
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Hwabelle <onboarding@resend.dev>",
          to: [toEmail],
          subject,
          html,
          text,
        }),
      });

      if (res.ok) {
        console.log(`[Resend] Guide email dispatched to ${toEmail} for ${resourceId}`);
        return { success: true, provider: "resend" };
      } else {
        const errText = await res.text();
        console.warn(`[Resend] API Error: ${errText}`);
      }
    } catch (resendErr) {
      console.warn(`[Resend] Unexpected exception:`, resendErr);
    }
  }

  return { success: false, error: "Both SES and Resend delivery attempts failed or unconfigured." };
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Enforce POST only
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Only POST is accepted." }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Content-Type validation
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return new Response(
      JSON.stringify({ error: "Invalid Content-Type. Expected application/json." }),
      { status: 415, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Payload size check
  const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
  if (contentLength > MAX_PAYLOAD_SIZE) {
    return new Response(
      JSON.stringify({ error: "Payload too large." }),
      { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const rawBody = await req.json();
    const payload: ResourceLeadPayload = rawBody || {};

    // 1. Honeypot check
    if (payload.hwabelle_hp && payload.hwabelle_hp.trim().length > 0) {
      return new Response(
        JSON.stringify({ success: true, message: "Request received." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Validate & normalize email
    const rawEmail = (payload.email || "").trim().toLowerCase();
    if (!rawEmail || !EMAIL_REGEX.test(rawEmail) || rawEmail.length > 255) {
      return new Response(
        JSON.stringify({ error: "A valid email address is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Validate resource_id against strict allowlist
    const rawResourceId = (payload.resource_id || "flower-pressing-guide").trim();
    if (!ALLOWED_RESOURCE_IDS.includes(rawResourceId as AllowedResourceId)) {
      return new Response(
        JSON.stringify({
          error: `Invalid resource_id. Must be one of: ${ALLOWED_RESOURCE_IDS.join(", ")}`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const resourceId = rawResourceId as AllowedResourceId;

    // 4. Sanitize and length-limit metadata fields
    const firstName = payload.first_name ? payload.first_name.trim().slice(0, 60) : null;
    const sourcePage = payload.source_page ? payload.source_page.trim().slice(0, 200) : "/";
    const sourceType = payload.source_type ? payload.source_type.trim().slice(0, 50) : "popup";
    const offerTrigger = payload.offer_trigger ? payload.offer_trigger.trim().slice(0, 50) : "direct";
    const resourcePosition = payload.resource_position ? payload.resource_position.trim().slice(0, 50) : "popup";
    const marketingConsent = Boolean(payload.marketing_consent);
    const utmSource = payload.utm_source ? payload.utm_source.trim().slice(0, 100) : null;
    const utmMedium = payload.utm_medium ? payload.utm_medium.trim().slice(0, 100) : null;
    const utmCampaign = payload.utm_campaign ? payload.utm_campaign.trim().slice(0, 100) : null;
    const utmContent = payload.utm_content ? payload.utm_content.trim().slice(0, 100) : null;
    const utmTerm = payload.utm_term ? payload.utm_term.trim().slice(0, 100) : null;
    const referrer = payload.referrer ? payload.referrer.trim().slice(0, 500) : null;

    // 5. Initialize Supabase Admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[Resource Lead Submit] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      // Still return success access so visitor is never locked out
      const guideDetails = RESOURCE_DETAILS[resourceId];
      return new Response(
        JSON.stringify({
          success: true,
          resource_id: resourceId,
          title: guideDetails.title,
          guide_url: `${getBaseUrl()}${guideDetails.path}`,
          read_online_url: guideDetails.path,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 6. Duplicate Submission Throttling (10-minute cooldown window)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: existingLead, error: queryError } = await supabase
      .from("resource_leads")
      .select("id, created_at")
      .eq("email", rawEmail)
      .eq("resource_id", resourceId)
      .gte("created_at", tenMinutesAgo)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const guideDetails = RESOURCE_DETAILS[resourceId];

    if (!queryError && existingLead) {
      console.log(`[Throttled] Duplicate claim for ${rawEmail} (${resourceId}) within 10m. Returning existing claim.`);
      return new Response(
        JSON.stringify({
          success: true,
          resource_id: resourceId,
          title: guideDetails.title,
          guide_url: `${getBaseUrl()}${guideDetails.path}`,
          read_online_url: guideDetails.path,
          throttled: true,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 7. Insert Lead Record
    const { data: insertedLead, error: insertError } = await supabase
      .from("resource_leads")
      .insert({
        email: rawEmail,
        first_name: firstName,
        resource_id: resourceId,
        source_page: sourcePage,
        source_type: sourceType,
        offer_trigger: offerTrigger,
        resource_position: resourcePosition,
        marketing_consent: marketingConsent,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm,
        referrer: referrer,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("[Resource Lead Submit] DB Insert Error:", insertError);
    } else {
      console.log(`[Resource Lead Submit] Created lead ${insertedLead?.id} for ${rawEmail} (${resourceId})`);
    }

    // 8. Attempt Guide Delivery Email in Background (Non-blocking for user access)
    // Send email asynchronously and log outcome
    sendGuideEmail(rawEmail, resourceId, firstName || undefined)
      .then((res) => {
        if (!res.success) {
          console.warn(`[Email Warning] Guide delivery email not delivered: ${res.error}`);
        }
      })
      .catch((err) => {
        console.error(`[Email Error] Exception while sending guide email:`, err);
      });

    // 9. Return instant guide unlock
    return new Response(
      JSON.stringify({
        success: true,
        resource_id: resourceId,
        title: guideDetails.title,
        guide_url: `${getBaseUrl()}${guideDetails.path}`,
        read_online_url: guideDetails.path,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("[Resource Lead Submit] Uncaught error:", err);
    return new Response(
      JSON.stringify({ error: errorMsg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
