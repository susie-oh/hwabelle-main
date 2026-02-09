import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { purpose, ageGroup, embedLink, feedback } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const linkInstruction = embedLink ? `Include this CTA link in the emails: ${embedLink}` : "No specific CTA link provided.";
    const feedbackInstruction = feedback ? `Previous feedback to incorporate: ${feedback}` : "";

    const prompt = `Create a 5-email marketing sequence for:
Purpose: ${purpose}
Target Age Group: ${ageGroup}
${linkInstruction}
${feedbackInstruction}

CRITICAL FORMATTING REQUIREMENTS:
Each email MUST use extensive HTML formatting to create visual impact:
1. **Bold key phrases** using <strong> or <b> tags for value propositions, urgency words, benefits, and CTAs.
2. **Emphasize important words** using <em> or <i> tags for emotional triggers and unique selling points.
3. **Structure content** with <p> tags, <ul><li> for benefits, and <br> for breathing room.
4. **Create visual hierarchy** with <h2> or <h3> for section headers, <strong> for stats/numbers.
5. **Make CTAs stand out** by wrapping call-to-action text in <strong> tags.

Each email should:
- Have a compelling, curiosity-inducing subject line
- Be appropriate for the target age group
- Progress logically through the marketing funnel (awareness → interest → desire → action → urgency)

Return ONLY valid JSON with no markdown wrapping:
{
  "emails": [
    { "sequence_order": 1, "subject": "Subject line here", "content": "Full HTML-formatted email body" },
    { "sequence_order": 2, "subject": "Subject line here", "content": "Full HTML-formatted email body" },
    { "sequence_order": 3, "subject": "Subject line here", "content": "Full HTML-formatted email body" },
    { "sequence_order": 4, "subject": "Subject line here", "content": "Full HTML-formatted email body" },
    { "sequence_order": 5, "subject": "Subject line here", "content": "Full HTML-formatted email body" }
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert email marketing copywriter. Always return valid JSON only, no markdown code blocks." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const aiData = await response.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    
    // Clean markdown code blocks if present
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    
    const parsed = JSON.parse(content);

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
