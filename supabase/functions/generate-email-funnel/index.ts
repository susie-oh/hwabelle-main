import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://hwabelle.com",
  "https://www.hwabelle.com",
  "https://hwabelle.shop",
  "https://www.hwabelle.shop",
  "http://localhost:8080",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  };
}

const SYSTEM_PROMPT = `You are an expert email marketing strategist for Hwabelle, a premium flower pressing kit brand. Create compelling, beautifully formatted HTML email sequences that drive engagement and conversions. Emails should feel personal, inspire creativity, and subtly promote Hwabelle products. Use clean, mobile-friendly HTML formatting.`;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth check — require a valid admin user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { purpose, ageGroup, embedLink, feedback } = await req.json();
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!GOOGLE_API_KEY && !OPENAI_API_KEY) {
      throw new Error("Neither GOOGLE_API_KEY nor OPENAI_API_KEY is configured");
    }

    const linkInstruction = embedLink ? `Include this CTA link in the emails: ${embedLink}` : "No specific CTA link provided.";
    const feedbackInstruction = feedback ? `Previous feedback to incorporate: ${feedback}` : "";

    const userPrompt = `Create a 5-email marketing sequence for:
Purpose: ${purpose}
Target Age Group: ${ageGroup}
${linkInstruction}
${feedbackInstruction}

Return ONLY valid JSON with this exact structure:
{
  "emails": [
    { "sequence_order": 1, "subject": "Subject line here", "content": "Full HTML-formatted email body" },
    { "sequence_order": 2, "subject": "Subject line here", "content": "Full HTML-formatted email body" },
    { "sequence_order": 3, "subject": "Subject line here", "content": "Full HTML-formatted email body" },
    { "sequence_order": 4, "subject": "Subject line here", "content": "Full HTML-formatted email body" },
    { "sequence_order": 5, "subject": "Subject line here", "content": "Full HTML-formatted email body" }
  ]
}`;

    let textContent: string | undefined;

    if (GOOGLE_API_KEY) {
      for (const modelName of ["gemini-3.6-flash", "gemini-3.5-flash"]) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(GOOGLE_API_KEY)}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(45_000),
              body: JSON.stringify({
                contents: [
                  { role: "user", parts: [{ text: SYSTEM_PROMPT + "\n\n" + userPrompt }] },
                ],
                generationConfig: {
                  responseMimeType: "application/json",
                },
              }),
            }
          );

          if (response.ok) {
            const aiResponse = await response.json();
            const parts = aiResponse.candidates?.[0]?.content?.parts || [];
            textContent = parts
              .filter((p: { text?: string; thought?: boolean }) => typeof p?.text === "string" && !p.thought)
              .map((p: { text: string }) => p.text)
              .join("");
            if (textContent) break;
          } else {
            const errorText = await response.text();
            console.warn(`Gemini API error in generate-email-funnel (${modelName}):`, response.status, errorText);
          }
        } catch (geminiErr) {
          console.warn(`Gemini API exception in generate-email-funnel (${modelName}):`, geminiErr);
        }
      }

      if (!textContent && !OPENAI_API_KEY) {
        throw new Error("Failed to generate email sequence");
      }
    }

    if (!textContent && OPENAI_API_KEY) {
      const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
        }),
      });
      if (!oaRes.ok) {
        const oaErr = await oaRes.text();
        console.error("OpenAI backup error in generate-email-funnel:", oaRes.status, oaErr);
        throw new Error("Failed to generate email sequence");
      }
      const oaData = await oaRes.json();
      textContent = oaData?.choices?.[0]?.message?.content;
    }

    if (!textContent) {
      throw new Error("Invalid AI response format");
    }

    const parsed = JSON.parse(textContent);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-email-funnel error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
