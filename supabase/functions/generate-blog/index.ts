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
  const corsHeaders = getCorsHeaders(req);
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

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!GOOGLE_API_KEY && !OPENAI_API_KEY) {
      throw new Error("Neither GOOGLE_API_KEY nor OPENAI_API_KEY is configured");
    }

    const userPrompt = `Generate a comprehensive blog post about: "${topic}"
${additionalContext ? `Additional context: ${additionalContext}` : ""}

The blog post should be 800-1200 words and optimized for search engines and AI answer engines.

Return a JSON object with these fields:
- title: Compelling, SEO-friendly title (under 60 chars)
- metaDescription: SEO meta description (under 160 chars)
- excerpt: Brief preview text for listings (1-2 sentences)
- content: Full blog post content in Markdown format with question-style H2/H3 headings
- seoKeywords: Array of 5-8 relevant SEO keywords
- longTailQueries: Array of 3-5 long-tail search queries this post answers`;

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
                  { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] },
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
            console.warn(`Gemini API error in generate-blog (${modelName}):`, response.status, errorText);
          }
        } catch (geminiErr) {
          console.warn(`Gemini API exception in generate-blog (${modelName}):`, geminiErr);
        }
      }

      if (!textContent && !OPENAI_API_KEY) {
        throw new Error("Failed to generate blog post");
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
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });
      if (!oaRes.ok) {
        const oaErr = await oaRes.text();
        console.error("OpenAI backup error in generate-blog:", oaRes.status, oaErr);
        throw new Error("Failed to generate blog post");
      }
      const oaData = await oaRes.json();
      textContent = oaData?.choices?.[0]?.message?.content;
    }

    if (!textContent) {
      throw new Error("Invalid AI response format");
    }

    const blogData = JSON.parse(textContent);

    // Generate unique slug
    const baseSlug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const timestamp = Date.now().toString(36);
    const slug = `${baseSlug}-${timestamp}`;

    // Select or generate a non-repeating topic-matched cover image in Supabase Storage `blog-images`
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

    let featuredImageUrl = "";
    if (GOOGLE_API_KEY) {
      try {
        const imgPrompt = `Overhead sunlit Kinfolk-style botanical editorial flat-lay photograph illustrating "${blogData.title || topic}". Natural linen and warm oak craft table aesthetic, real pressed flowers and botanical tools, photorealistic, 4:3 aspect ratio, strictly NO text, NO words, NO logos, NO watermarks.`;
        const genRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${encodeURIComponent(GOOGLE_API_KEY)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: AbortSignal.timeout(15_000),
            body: JSON.stringify({
              contents: [{ parts: [{ text: imgPrompt }] }],
              generationConfig: { responseModalities: ["IMAGE"] },
            }),
          }
        );
        if (genRes.ok) {
          const genJson = await genRes.json();
          const imgPart = (genJson.candidates?.[0]?.content?.parts || []).find((p: { inlineData?: { data: string; mimeType?: string } }) => p.inlineData?.data);
          if (imgPart?.inlineData) {
            const mimeType = imgPart.inlineData.mimeType || "image/jpeg";
            const ext = mimeType.includes("png") ? "png" : "jpg";
            const binary = atob(imgPart.inlineData.data);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            const fileName = `ai-${slug}.${ext}`;
            const { error: upErr } = await adminSupabase.storage
              .from("blog-images")
              .upload(fileName, bytes, { contentType: mimeType, cacheControl: "31536000", upsert: true });
            if (!upErr) {
              featuredImageUrl = `${supabaseUrl}/storage/v1/object/public/blog-images/${fileName}`;
            }
          }
        }
      } catch {
        // Fall through to curated non-repeating library selection
      }
    }

    if (!featuredImageUrl) {
      const topicPools: Array<{ re: RegExp; files: string[] }> = [
        { re: /calla/i, files: ["calla-lilies-bridal.jpg", "bridal-keepsake-frame.jpg"] },
        { re: /wedding|bridal|special day/i, files: ["fresh-bridal-bouquet.jpg", "bridal-keepsake-frame.jpg", "oak-frame-rose-art.jpg"] },
        { re: /pansy|pansies|cosmos/i, files: ["pansies-and-cosmos.jpg", "wild-meadow-herbarium.jpg"] },
        { re: /daisy|daisies|clover|kid/i, files: ["daisies-and-clover.jpg", "mixed-media-journal.jpg"] },
        { re: /violet|fern|woodland/i, files: ["wild-violets-and-fern.jpg", "wild-meadow-herbarium.jpg"] },
        { re: /tulip/i, files: ["tulips-and-wildflowers.jpg", "cherry-blossoms-spring.jpg"] },
        { re: /lavender/i, files: ["lavender-and-babys-breath.jpg", "workbench-tweezers-action.jpg"] },
        { re: /cherry blossom|sakura/i, files: ["cherry-blossoms-spring.jpg", "tulips-and-wildflowers.jpg"] },
        { re: /sunflower|large bloom/i, files: ["sunflowers-large-blooms.jpg", "wild-meadow-herbarium.jpg"] },
        { re: /chrysanthemum|autumn|fall/i, files: ["autumn-chrysanthemums-leaves.jpg", "sunflowers-large-blooms.jpg"] },
        { re: /beach|coastal|sea grass/i, files: ["coastal-beach-botanicals.jpg", "lavender-and-babys-breath.jpg"] },
        { re: /evergreen|winter botanical/i, files: ["winter-evergreen-sprigs.jpg", "mindful-winter-pressing.jpg"] },
        { re: /self-care|mindful|winter|indoor/i, files: ["mindful-winter-pressing.jpg", "winter-evergreen-sprigs.jpg", "workbench-tweezers-action.jpg"] },
        { re: /card|holiday/i, files: ["holiday-greeting-cards.jpg", "botanical-art-gifts.jpg"] },
        { re: /phone case|resin|jewelry/i, files: ["resin-jewelry-phone-case.jpg", "botanical-art-gifts.jpg"] },
        { re: /mixed media|combining/i, files: ["mixed-media-journal.jpg", "wild-meadow-herbarium.jpg"] },
        { re: /sell|income|profit/i, files: ["artisan-botanical-studio.jpg", "oak-frame-rose-art.jpg"] },
        { re: /gift/i, files: ["botanical-art-gifts.jpg", "holiday-greeting-cards.jpg"] },
        { re: /frame/i, files: ["oak-frame-rose-art.jpg", "bridal-keepsake-frame.jpg"] },
        { re: /store|dried.*bouquet|old arrangement/i, files: ["archival-flower-storage.jpg", "roses-and-eucalyptus.jpg"] },
        { re: /color|fade|brown|mold|humid|science/i, files: ["color-science-drying.jpg", "pansies-and-cosmos.jpg"] },
        { re: /acrylic|microwave|paper|material|mistake|how long|timeline/i, files: ["acrylic-press-flatlay.jpg", "workbench-tweezers-action.jpg"] },
        { re: /rose/i, files: ["roses-and-eucalyptus.jpg", "oak-frame-rose-art.jpg"] },
        { re: /spring|wildflower|calendar|seasonal/i, files: ["tulips-and-wildflowers.jpg", "wild-meadow-herbarium.jpg", "cherry-blossoms-spring.jpg"] },
      ];
      const allFiles = [
        "acrylic-press-flatlay.jpg", "pansies-and-cosmos.jpg", "daisies-and-clover.jpg",
        "wild-violets-and-fern.jpg", "tulips-and-wildflowers.jpg", "lavender-and-babys-breath.jpg",
        "roses-and-eucalyptus.jpg", "cherry-blossoms-spring.jpg", "sunflowers-large-blooms.jpg",
        "autumn-chrysanthemums-leaves.jpg", "coastal-beach-botanicals.jpg", "winter-evergreen-sprigs.jpg",
        "holiday-greeting-cards.jpg", "resin-jewelry-phone-case.jpg", "mixed-media-journal.jpg",
        "color-science-drying.jpg", "artisan-botanical-studio.jpg", "mindful-winter-pressing.jpg",
        "archival-flower-storage.jpg", "botanical-art-gifts.jpg", "calla-lilies-bridal.jpg",
        "bridal-keepsake-frame.jpg", "fresh-bridal-bouquet.jpg", "wild-meadow-herbarium.jpg",
        "workbench-tweezers-action.jpg", "oak-frame-rose-art.jpg", "botanical-specimen-grid.jpg",
      ];

      const { data: recent } = await adminSupabase
        .from("blog_posts")
        .select("featured_image_url")
        .not("featured_image_url", "is", null)
        .order("published_at", { ascending: false })
        .limit(8);

      const recentSet = new Set(
        (recent || []).map((r: { featured_image_url?: string | null }) => (r.featured_image_url || "").split("/").pop()).filter(Boolean)
      );

      const haystack = `${blogData.title || ""} ${topic} ${(blogData.seoKeywords || []).join(" ")}`;
      let pool = allFiles;
      for (const rule of topicPools) {
        if (rule.re.test(haystack)) {
          pool = rule.files;
          break;
        }
      }
      const fresh = pool.filter((f) => !recentSet.has(f));
      const candidates = fresh.length > 0 ? fresh : allFiles.filter((f) => !recentSet.has(f));
      const finalPool = candidates.length > 0 ? candidates : pool;
      let hash = 0;
      for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
      featuredImageUrl = `${supabaseUrl}/storage/v1/object/public/blog-images/${finalPool[hash % finalPool.length]}`;
    }

    return new Response(
      JSON.stringify({
        ...blogData,
        slug,
        featuredImageUrl,
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
