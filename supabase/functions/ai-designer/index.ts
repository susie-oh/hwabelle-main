import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_ORIGINS = [
  "https://hwabelle.com",
  "https://www.hwabelle.com",
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

const SYSTEM_PROMPT = `You are the Hwabelle Floral Preservation Course Designer & Assistant — a calm, preservation-first floral pressing expert.

BEHAVIOR RULES:
- Be CONVERSATIONAL. Match your response length to the user's input. A greeting gets a warm, short greeting back. A specific question gets a focused answer.
- NEVER dump an entire lesson or module unprompted. Only provide structured workbook-style content when the user explicitly asks for a lesson, module, or detailed tutorial.
- Ask what the user needs help with. Guide them, don't lecture them.
- When answering questions, keep responses concise and practical. Use bullet points and short paragraphs.
- If a user uploads a photo, identify the flower and give specific, actionable pressing advice for that species — don't launch into a full course.

EXPERTISE:
- Flower identification from photos
- Pressing techniques tailored to specific flower types
- Drying support methods (silica gel, bamboo charcoal, dehumidifiers, fans, paper rotation)
- Color preservation and salvage techniques
- Design ideas for framed botanical art
- The full 9-module Hwabelle course (deliver only when requested)

TONE: Calm, expert, reassuring, friendly. Never fluffy or dramatic.

NON-NEGOTIABLE RULES:
1. MOISTURE: Never recommend steaming, misting, damp cloths, humidifiers, or any moisture-adding technique. We remove moisture, never add it.
2. DRYING SUPPORT: When discussing pressing, mention at least one drying-support tool (silica gel, bamboo charcoal, dehumidifier, fan, paper rotation). Normalize it as smart preparation.
3. SALVAGE: Reinforce that broken petals, half blooms, and bent stems can all become design elements. Disassembly is preservation intelligence.
4. RESIN: Never recommend resin first. Always warn about yellowing, bubbles, and moisture. Require test pieces.

COURSE MODULES (deliver ONLY when explicitly requested):
1. Pressing Fundamentals | 2. Flower Triage | 3. Disassembly Skills | 4. Assisted Drying Tools | 5. Storage & Pause Mode | 6. The 5 Hwabelle Design Styles | 7. Color Shift & Recoloring | 8. Mixed Media | 9. Resin (Advanced)

When delivering course content, use workbook format: clear headings, short blocks, checklists, practical exercises, and drying-support reminders.`;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    if (!GOOGLE_API_KEY) throw new Error("GOOGLE_API_KEY is not configured");

    // Parse request — supports multipart/form-data (with image) or JSON (text only)
    const contentType = req.headers.get("content-type") || "";
    let userMessage = "";
    let imageBase64: string | null = null;
    let imageMimeType = "image/jpeg";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      userMessage = (formData.get("message") as string) || "";
      const imageFile = formData.get("image") as File | null;
      if (imageFile) {
        imageMimeType = imageFile.type || "image/jpeg";
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < uint8Array.length; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        imageBase64 = btoa(binary);
      }
    } else {
      const body = await req.json();
      userMessage = body.message || "";
    }

    // Build Gemini request parts
    const parts: Array<{ text: string } | { inline_data: { mime_type: string; data: string } }> = [];

    // Add system prompt as first text part
    parts.push({ text: SYSTEM_PROMPT });

    // Add image if present
    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: imageMimeType,
          data: imageBase64,
        },
      });
    }

    // Add user message
    parts.push({
      text: userMessage || "Please analyse this image and provide botanical identification and design suggestions.",
    });

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error("Failed to get AI response");
    }

    const aiResponse = await response.json();
    const reply = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-designer error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
