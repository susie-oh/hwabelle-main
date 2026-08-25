import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendSesEmail } from "../_shared/ses.ts";

interface FlowerData {
  name: string;
  tagline: string;
  shortDescription: string;
  personalitySummary: string;
  traits: string[];
  symbolism: string;
  pressingSuitability: string;
  pressingTips: string[];
  projectTitle: string;
  projectDescription: string;
}

const FLOWER_DATA: Record<string, FlowerData> = {
  rose: {
    name: "Rose",
    tagline: "Classic beauty with quiet depth.",
    shortDescription: "You carry yourself with a timeless warmth that draws people in.",
    personalitySummary: "You value deep connections and meaningful gestures. People often come to you for advice because you listen with genuine care and respond with thoughtfulness. You find beauty in the details others overlook and bring an effortless elegance to everything you touch.",
    traits: ["Romantic", "Loyal", "Elegant", "Nurturing", "Resilient"],
    symbolism: "Roses symbolize love, devotion, gratitude, and the quiet courage it takes to be vulnerable.",
    pressingSuitability: "Moderate",
    pressingTips: [
      "Individual petals press more evenly than whole blooms",
      "Remove thick sepals and stems before pressing",
      "Press roses when they are just beginning to open for the best shape",
      "Layer petals between extra absorbent sheets to manage moisture",
    ],
    projectTitle: "Rose Petal Love Letter",
    projectDescription: "A shadow-box display combining pressed rose petals arranged in a cascading pattern alongside a handwritten letter, wedding vow excerpt, or meaningful quote.",
  },
  lavender: {
    name: "Lavender",
    tagline: "Calm presence, creative spirit.",
    shortDescription: "You bring a grounding calm to every room you enter.",
    personalitySummary: "You're the person people seek out when they need to feel settled. Your creative energy flows best in unhurried environments where you can think deeply and work at your own pace. You find restoration in nature and simple rituals.",
    traits: ["Calm", "Thoughtful", "Grounded", "Creative", "Intuitive"],
    symbolism: "Lavender represents serenity, devotion, and the power of gentleness — lasting impact through quiet presence.",
    pressingSuitability: "Easy",
    pressingTips: [
      "Lavender stems press beautifully when laid flat",
      "Harvest when buds are just beginning to open",
      "Press whole sprigs for the most natural appearance",
      "Lavender retains its soothing scent well after pressing",
    ],
    projectTitle: "Lavender Memory Frame",
    projectDescription: "A minimalist double-glass botanical frame combining pressed lavender stems with handwritten vows, a meaningful date, or a short personal message.",
  },
  sunflower: {
    name: "Sunflower",
    tagline: "Bold warmth that lifts everyone around you.",
    shortDescription: "You radiate positivity and show up fully wherever you go.",
    personalitySummary: "Your energy is contagious in the best way. You approach challenges with optimism rather than anxiety, and your enthusiasm is genuine. Creativity for you is expansive, colorful, and unapologetically bold.",
    traits: ["Optimistic", "Generous", "Confident", "Warm", "Adventurous"],
    symbolism: "Sunflowers symbolize adoration, loyalty, and vitality — turning to follow the light and sustaining community.",
    pressingSuitability: "Advanced",
    pressingTips: [
      "Press individual petals rather than the thick center disk",
      "Sunflower petals press flat and retain vivid golden color",
      "Use smaller varieties for easier whole-flower pressing",
      "Remove seeds and trim the center before pressing petals",
    ],
    projectTitle: "Sunflower Burst Wall Art",
    projectDescription: "Arranged pressed sunflower petals in a radial burst pattern on an art board, paired with pressed greenery and a hand-lettered favorite motto.",
  },
  daisy: {
    name: "Daisy",
    tagline: "Effortless joy, honest heart.",
    shortDescription: "You move through life with a lightness that feels genuine and refreshing.",
    personalitySummary: "You don't need grand gestures to make an impression — your authenticity does the work for you. You value honesty, simplicity, and meaningful experiences. For you, the best things in life are usually the simplest.",
    traits: ["Cheerful", "Sincere", "Playful", "Independent", "Grounded"],
    symbolism: "Daisies represent innocence, new beginnings, purity of intention, and loyal love.",
    pressingSuitability: "Easy",
    pressingTips: [
      "Daisies press beautifully as whole flowers",
      "Press when fully open for the best flat result",
      "White petals may yellow slightly — use fresh, crisp blooms",
      "Small daisies are ideal for decorative borders and details",
    ],
    projectTitle: "Daisy Chain Bookmark Collection",
    projectDescription: "A collection of delicate laminated bookmarks using pressed daisies in a chain pattern, finished with silk ribbon tassels.",
  },
  cosmos: {
    name: "Cosmos",
    tagline: "Free-spirited and endlessly curious.",
    shortDescription: "You see the world as one big creative experiment.",
    personalitySummary: "You're drawn to the unconventional and find inspiration in unexpected places. You have a natural talent for making things look beautiful without overthinking them. Your energy is magnetic because you stay true to yourself.",
    traits: ["Creative", "Spontaneous", "Curious", "Artistic", "Free-spirited"],
    symbolism: "Cosmos flowers represent harmony, peace, and the effortless beauty that emerges from natural wildness.",
    pressingSuitability: "Easy",
    pressingTips: [
      "Cosmos press easily and retain their delicate shape",
      "Press when flowers are fully open and completely dry",
      "Their thin petals dry quickly between pressing sheets",
      "Colors hold remarkably well — especially pinks and whites",
    ],
    projectTitle: "Cosmos Constellation Art",
    projectDescription: "A dark-background botanical piece where pressed cosmos blooms in varying sizes mimic a starfield constellation, labeled with meaningful moments.",
  },
  violet: {
    name: "Violet",
    tagline: "Quiet strength, deep feeling.",
    shortDescription: "You notice what others miss and feel things profoundly.",
    personalitySummary: "You're an observer and a thinker who processes the world deeply. Your empathy runs deep, and you're drawn to poetry, meaningful art, and beauty that requires patience to appreciate.",
    traits: ["Empathetic", "Perceptive", "Poetic", "Contemplative", "Loyal"],
    symbolism: "Violets symbolize faithfulness, modesty, and the rich depth found in quiet humility.",
    pressingSuitability: "Easy",
    pressingTips: [
      "Violets press perfectly flat with minimal preparation",
      "Their small size makes them ideal for detailed designs",
      "Press with leaves attached for a natural, organic look",
      "Colors deepen slightly when dried into rich violet tones",
    ],
    projectTitle: "Violet Poetry Journal",
    projectDescription: "A handmade journal cover arranged with pressed violets and leaves surrounding a favorite poem or literary quote under a protective transparent seal.",
  },
  hydrangea: {
    name: "Hydrangea",
    tagline: "Abundant heart, gathered strength.",
    shortDescription: "You believe that more is more — in love, generosity, and effort.",
    personalitySummary: "You're a natural gatherer of people, ideas, and experiences. You value community, collaboration, and shared moments over individual achievement, creating abundance wherever you go.",
    traits: ["Generous", "Community-minded", "Abundant", "Organized", "Graceful"],
    symbolism: "Hydrangeas symbolize gratitude, grace, unity, and the beauty that comes from many small parts working together.",
    pressingSuitability: "Easy",
    pressingTips: [
      "Press individual florets rather than whole bloom clusters",
      "Hydrangea florets dry flat and retain a papery texture beautifully",
      "Pick when colors are vibrant but blooms feel slightly dry",
      "Mix colors from the same bush for natural gradient effects",
    ],
    projectTitle: "Hydrangea Gradient Wall Piece",
    projectDescription: "A gallery piece on watercolor paper arranging hydrangea florets across a smooth color gradient from pale sage to deep periwinkle and blush.",
  },
  peony: {
    name: "Peony",
    tagline: "Luxurious spirit, magnetic presence.",
    shortDescription: "You bring richness and beauty to everything you do.",
    personalitySummary: "You have an innate eye for aesthetics and atmosphere. You appreciate quality over quantity, invest deeply in what you love, and elevate the ordinary into unforgettable moments.",
    traits: ["Luxurious", "Magnetic", "Passionate", "Tasteful", "Ambitious"],
    symbolism: "Peonies symbolize prosperity, good fortune, romance, and breathtaking celebratory beauty.",
    pressingSuitability: "Advanced",
    pressingTips: [
      "Peonies are thick — press individual petals for best results",
      "Remove dense center and press outer petals separately",
      "Layer extra absorbent sheets and change them after 24 hours",
      "Press petals from different bloom stages for rich variety",
    ],
    projectTitle: "Peony Petal Luxe Frame",
    projectDescription: "A statement petal mosaic inside a large brass frame, layering overlapping pressed peony petals with sprigs of eucalyptus.",
  },
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 320) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function generateEmailHtml(flower: FlowerData, slug: string, firstName?: string): string {
  const greeting = firstName ? `Hi ${firstName},` : "Hello,";
  const designerUrl = `https://hwabelle.shop/designer?flower=${slug}&source=quiz-email`;
  const shopUrl = `https://hwabelle.shop/shop?source=quiz-email&flower=${slug}`;
  const quizUrl = `https://hwabelle.shop/flower-quiz/result/${slug}`;

  const traitsHtml = flower.traits
    .map(
      (t) =>
        `<span style="display:inline-block; background-color:#f4efe8; color:#2c2c2c; font-size:13px; font-weight:500; padding:5px 12px; margin:3px; border-radius:20px;">${t}</span>`
    )
    .join(" ");

  const tipsHtml = flower.pressingTips
    .map(
      (tip) =>
        `<li style="margin-bottom:8px; line-height:1.5; color:#555;"><span style="color:#2c2c2c; font-weight:600;">·</span> ${tip}</li>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Flower Personality: You're a ${flower.name}</title>
</head>
<body style="margin:0; padding:0; background-color:#faf8f5; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#2c2c2c;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#faf8f5; padding:30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #ede7df; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
          
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 20px; text-align:center; border-bottom:1px solid #f2ede6;">
              <h1 style="margin:0; font-family:Georgia, serif; font-size:24px; font-weight:normal; letter-spacing:2px; color:#1a1a1a; text-transform:uppercase;">HWABELLE</h1>
              <p style="margin:6px 0 0; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#888;">Find Your Flower Personality</p>
            </td>
          </tr>

          <!-- Hero Result -->
          <tr>
            <td style="padding:36px 32px 20px; text-align:center; background-color:#faf7f2;">
              <p style="margin:0 0 8px; font-size:14px; color:#666;">${greeting}</p>
              <h2 style="margin:0 0 10px; font-family:Georgia, serif; font-size:32px; font-weight:normal; color:#1a1a1a;">
                You're a ${flower.name}
              </h2>
              <p style="margin:0 0 20px; font-size:16px; font-style:italic; color:#666;">
                "${flower.tagline}"
              </p>
              <div style="margin-top:16px;">
                ${traitsHtml}
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding:32px 32px 24px;">
              
              <!-- Personality -->
              <h3 style="font-family:Georgia, serif; font-size:20px; font-weight:normal; margin:0 0 12px; color:#1a1a1a;">Your Flower Personality</h3>
              <p style="font-size:15px; line-height:1.65; color:#444; margin:0 0 24px;">
                ${flower.personalitySummary}
              </p>

              <!-- Symbolism -->
              <h3 style="font-family:Georgia, serif; font-size:20px; font-weight:normal; margin:0 0 12px; color:#1a1a1a;">What ${flower.name} Represents</h3>
              <p style="font-size:15px; line-height:1.65; color:#444; margin:0 0 24px;">
                ${flower.symbolism}
              </p>

              <!-- Pressing Guidance -->
              <div style="background-color:#f9f8f6; border-radius:8px; padding:20px; margin-bottom:24px; border:1px solid #ede7df;">
                <h4 style="font-family:Georgia, serif; font-size:17px; font-weight:normal; margin:0 0 8px; color:#1a1a1a;">
                  Pressing Difficulty: <span style="font-weight:600; color:#2e6f40;">${flower.pressingSuitability}</span>
                </h4>
                <ul style="margin:0; padding-left:16px; list-style-type:none; font-size:14px;">
                  ${tipsHtml}
                </ul>
              </div>

              <!-- Project Recommendation -->
              <div style="background-color:#faf5f0; border-left:3px solid #1a1a1a; padding:20px; margin-bottom:30px; border-radius:0 8px 8px 0;">
                <p style="margin:0 0 4px; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#888;">Personalized Project Idea</p>
                <h4 style="font-family:Georgia, serif; font-size:18px; font-weight:normal; margin:0 0 8px; color:#1a1a1a;">
                  ${flower.projectTitle}
                </h4>
                <p style="margin:0; font-size:14px; line-height:1.6; color:#555;">
                  ${flower.projectDescription}
                </p>
              </div>

              <!-- Action Buttons -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:20px;">
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <a href="${designerUrl}" target="_blank" style="display:inline-block; background-color:#1a1a1a; color:#ffffff; font-size:15px; font-weight:500; text-decoration:none; padding:14px 28px; border-radius:4px; letter-spacing:0.5px; width:80%; text-align:center;">
                      Design My ${flower.name} Project in AI Designer
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="${shopUrl}" target="_blank" style="display:inline-block; background-color:#ffffff; border:1px solid #1a1a1a; color:#1a1a1a; font-size:14px; font-weight:500; text-decoration:none; padding:12px 24px; border-radius:4px; letter-spacing:0.5px; width:80%; text-align:center;">
                      Start Pressing My Flowers →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px; background-color:#faf7f2; text-align:center; border-top:1px solid #ede7df; font-size:13px; color:#888;">
              <p style="margin:0 0 8px;">
                <a href="${quizUrl}" style="color:#555; text-decoration:underline;">View your result online</a> · 
                <a href="https://hwabelle.shop" style="color:#555; text-decoration:underline;">hwabelle.shop</a>
              </p>
              <p style="margin:0; font-size:12px; color:#aaa;">
                Hwabelle Botanical Art & Flower Preservation
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

async function sendEmailWithFallback(
  toEmail: string,
  subject: string,
  html: string
): Promise<{ success: boolean; provider?: string; error?: string }> {
  const fromEmail =
    Deno.env.get("AWS_SES_FROM_EMAIL") ||
    Deno.env.get("RESEND_FROM_EMAIL") ||
    "Hwabelle <orders@hwabelle.shop>";

  // 1. Try AWS SES
  const sesRes = await sendSesEmail({
    from: fromEmail,
    to: toEmail,
    subject,
    html,
  });

  if (sesRes.success) {
    console.log(`[Email] Successfully sent via AWS SES (MessageId: ${sesRes.messageId})`);
    return { success: true, provider: "SES" };
  }

  console.warn("[Email] SES unavailable or failed:", sesRes.error);

  // 2. Fallback to Resend
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.warn("[Email] No RESEND_API_KEY configured.");
    return { success: false, error: sesRes.error || "No email provider available" };
  }

  // Attempt Resend with primary fromEmail
  let res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject,
      html,
    }),
  });

  // If failed (e.g., domain not verified on Resend), retry with onboarding@resend.dev for test deliveries
  if (!res.ok) {
    const primaryErr = await res.text();
    console.warn(`[Email] Resend attempt with ${fromEmail} failed: ${res.status} - ${primaryErr}`);

    const fallbackFrom = "Hwabelle <onboarding@resend.dev>";
    console.log(`[Email] Retrying Resend with ${fallbackFrom}...`);

    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fallbackFrom,
        to: [toEmail],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const fallbackErr = await res.text();
      console.error(`[Email] Resend fallback failed: ${res.status} - ${fallbackErr}`);
      return { success: false, provider: "Resend", error: fallbackErr };
    }
  }

  const data = await res.json();
  console.log(`[Email] Successfully sent via Resend (ID: ${data.id})`);
  return { success: true, provider: "Resend" };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Enforce reasonable payload size (50KB max)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 50000) {
      return new Response(
        JSON.stringify({ error: "Payload too large" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    const {
      firstName,
      email,
      marketingConsent = false,
      flowerResult,
      answers,
      source,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      referrer,
    } = body;

    // Validate required fields
    const validSlugs = Object.keys(FLOWER_DATA);
    if (!flowerResult || !validSlugs.includes(flowerResult)) {
      return new Response(
        JSON.stringify({ error: "Invalid flower result" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!answers || typeof answers !== "object") {
      return new Response(
        JSON.stringify({ error: "Invalid answers" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedEmail = email ? email.trim().toLowerCase() : null;

    // Validate email if provided
    if (normalizedEmail && !isValidEmail(normalizedEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate firstName length
    if (firstName && typeof firstName === "string" && firstName.length > 100) {
      return new Response(
        JSON.stringify({ error: "First name too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create server-side Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Store submission in flower_quiz_submissions table
    const { data, error } = await supabaseAdmin
      .from("flower_quiz_submissions")
      .insert({
        first_name: firstName?.trim() || null,
        email: normalizedEmail,
        marketing_consent: marketingConsent === true,
        flower_result: flowerResult,
        answers,
        source: source || null,
        utm_source: utmSource || null,
        utm_medium: utmMedium || null,
        utm_campaign: utmCampaign || null,
        utm_content: utmContent || null,
        utm_term: utmTerm || null,
        referrer: referrer || null,
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save submission" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. If marketing consent is granted, sync to customers / newsletter table
    if (normalizedEmail && marketingConsent) {
      try {
        await supabaseAdmin
          .from("customers")
          .upsert(
            {
              email: normalizedEmail,
              first_name: firstName?.trim() || null,
              consent: true,
            },
            { onConflict: "email" }
          );
      } catch (custErr) {
        console.warn("Could not sync customer newsletter consent:", custErr);
      }
    }

    // 3. Send automated Result Email
    if (normalizedEmail) {
      const flower = FLOWER_DATA[flowerResult];
      const subject = `Your Flower Personality: You're a ${flower.name}! 🌸`;
      const emailHtml = generateEmailHtml(flower, flowerResult, firstName?.trim());

      try {
        await sendEmailWithFallback(normalizedEmail, subject, emailHtml);
      } catch (mailErr) {
        console.error("Failed to send quiz result email:", mailErr);
      }
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
