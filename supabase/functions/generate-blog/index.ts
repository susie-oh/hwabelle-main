import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `You are an expert blog content writer for Hwabelle, a premium flower pressing kit brand. Your task is to generate SEO and AEO (Answer Engine Optimization) optimized blog posts about flower pressing, botanical art, and related topics.

Writing Style Rules:
- Direct, no-fluff, conversational tone
- Front-load answers in each section (answer first, then elaborate)
- Paragraphs must be under 80 words for easy scanning
- Use active voice and second person ("you")

AEO Optimization Rules:
- Use question-style H2 and H3 headings (e.g., "How Long Does Flower Pressing Take?")
- Structure content to directly answer common search queries
- Include practical, actionable steps
- Add specific details (numbers, timeframes, materials)

Content Structure:
1. Hook: Start with an engaging opening that addresses the reader's intent
2. Body: Break into atomic sections with clear question headings
3. Practical Tips: Include numbered steps or bulleted lists where appropriate
4. CTA: End with a subtle call-to-action related to Hwabelle products

Output must be clean, professional content suitable for a lifestyle/craft brand.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claims.claims.sub;
    
    // Check admin role
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError || !roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { topic, additionalContext } = await req.json();

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = `Generate a comprehensive blog post about: "${topic}"
${additionalContext ? `Additional context: ${additionalContext}` : ""}

The blog post should be 800-1200 words and optimized for search engines and AI answer engines.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_blog_post",
              description: "Generate a structured blog post with all required fields",
              parameters: {
                type: "object",
                properties: {
                  title: { 
                    type: "string", 
                    description: "Compelling, SEO-friendly title (under 60 chars)" 
                  },
                  metaDescription: { 
                    type: "string", 
                    description: "SEO meta description (under 160 chars)" 
                  },
                  excerpt: { 
                    type: "string", 
                    description: "Brief preview text for listings (1-2 sentences)" 
                  },
                  content: { 
                    type: "string", 
                    description: "Full blog post content in Markdown format with question-style H2/H3 headings" 
                  },
                  seoKeywords: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "5-8 relevant SEO keywords" 
                  },
                  longTailQueries: { 
                    type: "array", 
                    items: { type: "string" },
                    description: "3-5 long-tail search queries this post answers" 
                  },
                },
                required: ["title", "metaDescription", "excerpt", "content", "seoKeywords", "longTailQueries"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_blog_post" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate blog post");
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      throw new Error("Invalid AI response format");
    }

    const blogData = JSON.parse(toolCall.function.arguments);
    
    // Generate unique slug
    const baseSlug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const timestamp = Date.now().toString(36);
    const slug = `${baseSlug}-${timestamp}`;

    return new Response(
      JSON.stringify({
        ...blogData,
        slug,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating blog:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
