import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function pollRunUntilComplete(threadId: string, runId: string, apiKey: string, maxWaitMs = 60000): Promise<any> {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const res = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
      headers: { Authorization: `Bearer ${apiKey}`, "OpenAI-Beta": "assistants=v2" },
    });
    const run = await res.json();
    if (run.status === "completed") return run;
    if (["failed", "cancelled", "expired"].includes(run.status)) {
      throw new Error(`Run ${run.status}: ${run.last_error?.message || "unknown"}`);
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error("Assistant run timed out");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { purpose, ageGroup, embedLink, feedback } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const ASSISTANT_ID = Deno.env.get("OPENAI_ASSISTANT_ID");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");
    if (!ASSISTANT_ID) throw new Error("OPENAI_ASSISTANT_ID is not configured");

    const linkInstruction = embedLink ? `Include this CTA link in the emails: ${embedLink}` : "No specific CTA link provided.";
    const feedbackInstruction = feedback ? `Previous feedback to incorporate: ${feedback}` : "";

    const userMessage = `Create a 5-email marketing sequence for:
Purpose: ${purpose}
Target Age Group: ${ageGroup}
${linkInstruction}
${feedbackInstruction}

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

    const headers = {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "assistants=v2",
    };

    // 1. Create thread
    const threadRes = await fetch("https://api.openai.com/v1/threads", {
      method: "POST", headers,
    });
    if (!threadRes.ok) throw new Error(`Failed to create thread: ${await threadRes.text()}`);
    const thread = await threadRes.json();

    // 2. Add message
    const msgRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: "POST", headers,
      body: JSON.stringify({ role: "user", content: userMessage }),
    });
    if (!msgRes.ok) throw new Error(`Failed to add message: ${await msgRes.text()}`);

    // 3. Create run
    const runRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: "POST", headers,
      body: JSON.stringify({ assistant_id: ASSISTANT_ID }),
    });
    if (!runRes.ok) throw new Error(`Failed to create run: ${await runRes.text()}`);
    const run = await runRes.json();

    // 4. Poll until complete
    await pollRunUntilComplete(thread.id, run.id, OPENAI_API_KEY);

    // 5. Get messages
    const msgsRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages?order=desc&limit=1`, {
      headers,
    });
    if (!msgsRes.ok) throw new Error(`Failed to get messages: ${await msgsRes.text()}`);
    const msgs = await msgsRes.json();

    let content = msgs.data?.[0]?.content?.[0]?.text?.value || "";
    
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
