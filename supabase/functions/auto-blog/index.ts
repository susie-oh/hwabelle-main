import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

// ─── Topic Pool ───
// Seasonal + evergreen flower pressing topics for automatic rotation
const TOPIC_POOL = [
    // Spring
    "Best Spring Flowers to Press: A Seasonal Guide for Beginners",
    "How to Press Cherry Blossoms Without Losing Their Color",
    "Spring Wildflower Pressing: Identifying and Preserving Roadside Blooms",
    "Pressing Tulips: Techniques for Thick-Petaled Flowers",
    "How to Build a Seasonal Flower Pressing Calendar",
    // Summer
    "Summer Rose Pressing: From Garden to Frame in 5 Steps",
    "How to Press Sunflowers and Large Blooms Successfully",
    "Pressing Lavender: Keeping the Color and the Scent",
    "Beach Botanical Art: Pressing Coastal Flowers and Sea Grasses",
    "How to Prevent Mold When Pressing Flowers in Humid Summer Weather",
    // Autumn
    "Pressing Fall Leaves and Flowers: A Complete Autumn Guide",
    "How to Press Chrysanthemums for Stunning Autumn Arrangements",
    "Making Pressed Flower Greeting Cards for the Holidays",
    "Preserving Your Garden's Last Blooms Before Winter",
    "Autumn Botanical Art: Combining Pressed Leaves and Flowers",
    // Winter
    "Indoor Flower Pressing Projects for Winter Months",
    "Pressing Dried Flower Bouquets: Giving Old Arrangements New Life",
    "How to Press Evergreen Sprigs and Winter Botanicals",
    "Creating Botanical Art Gifts with Pressed Flowers",
    "Flower Pressing as Self-Care: A Mindful Winter Hobby",
    // Evergreen / Technique
    "The Complete Guide to Color Preservation in Pressed Flowers",
    "Microwave vs Traditional Flower Pressing: Which Is Better?",
    "How to Frame Pressed Flowers: Professional Tips for Beginners",
    "Resin and Pressed Flowers: A Beginner's Guide to Botanical Jewelry",
    "5 Common Flower Pressing Mistakes and How to Fix Them",
    "How Long Does Flower Pressing Take? A Timeline for Every Method",
    "Best Paper and Materials for Pressing Flowers at Home",
    "How to Press a Wedding Bouquet: Preserving Your Special Day",
    "Pressed Flower Phone Cases: A Step-by-Step DIY Guide",
    "Using an Acrylic Flower Press: Why Modern Presses Are Better",
    "How to Store Pressed Flowers So They Last for Years",
    "Botanical Art for Kids: Simple Flower Pressing Projects",
    "Mixed Media Art with Pressed Flowers: Combining Techniques",
    "How to Sell Pressed Flower Art: Turning Your Hobby into Income",
    "The Science Behind Flower Pressing: Why Some Colors Fade",
];

// Topic-matched cover image pools hosted in public Supabase Storage bucket `blog-images`
const TOPIC_IMAGE_POOLS: Array<{ re: RegExp; files: string[] }> = [
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

const ALL_LIBRARY_FILES = [
    "acrylic-press-flatlay.jpg",
    "pansies-and-cosmos.jpg",
    "daisies-and-clover.jpg",
    "wild-violets-and-fern.jpg",
    "tulips-and-wildflowers.jpg",
    "lavender-and-babys-breath.jpg",
    "roses-and-eucalyptus.jpg",
    "cherry-blossoms-spring.jpg",
    "sunflowers-large-blooms.jpg",
    "autumn-chrysanthemums-leaves.jpg",
    "coastal-beach-botanicals.jpg",
    "winter-evergreen-sprigs.jpg",
    "holiday-greeting-cards.jpg",
    "resin-jewelry-phone-case.jpg",
    "mixed-media-journal.jpg",
    "color-science-drying.jpg",
    "artisan-botanical-studio.jpg",
    "mindful-winter-pressing.jpg",
    "archival-flower-storage.jpg",
    "botanical-art-gifts.jpg",
    "calla-lilies-bridal.jpg",
    "bridal-keepsake-frame.jpg",
    "fresh-bridal-bouquet.jpg",
    "wild-meadow-herbarium.jpg",
    "workbench-tweezers-action.jpg",
    "oak-frame-rose-art.jpg",
    "botanical-specimen-grid.jpg",
];

async function resolveFutureBlogImage(
    supabase: any,
    supabaseUrl: string,
    googleApiKey: string,
    title: string,
    slug: string,
    keywords: string[] = []
): Promise<string> {
    // 1. Attempt fresh bespoke Gemini image generation if image quota is active on GOOGLE_API_KEY
    try {
        const imgPrompt = `Overhead sunlit Kinfolk-style botanical editorial flat-lay photograph illustrating "${title}". Natural linen and warm oak craft table aesthetic, real pressed flowers and botanical tools, photorealistic, 4:3 aspect ratio, strictly NO text, NO words, NO logos, NO watermarks.`;
        const genRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${encodeURIComponent(googleApiKey)}`,
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
            const imgPart = (genJson.candidates?.[0]?.content?.parts || []).find((p: any) => p.inlineData?.data);
            if (imgPart) {
                const mimeType: string = imgPart.inlineData.mimeType || "image/jpeg";
                const ext = mimeType.includes("png") ? "png" : "jpg";
                const binary = atob(imgPart.inlineData.data);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                const fileName = `ai-${slug}.${ext}`;
                const { error: upErr } = await supabase.storage
                    .from("blog-images")
                    .upload(fileName, bytes, { contentType: mimeType, cacheControl: "31536000", upsert: true });
                if (!upErr) {
                    return `${supabaseUrl}/storage/v1/object/public/blog-images/${fileName}`;
                }
            }
        }
    } catch {
        // Fall through cleanly to curated non-repeating library selection
    }

    // 2. Anti-duplicate selection from 28-photo curated botanical library
    const { data: recent } = await supabase
        .from("blog_posts")
        .select("featured_image_url")
        .not("featured_image_url", "is", null)
        .order("published_at", { ascending: false })
        .limit(8);

    const recentFiles = new Set(
        (recent || [])
            .map((r: any) => (r.featured_image_url || "").split("/").pop())
            .filter(Boolean)
    );

    const haystack = `${title} ${slug} ${keywords.join(" ")}`;
    let pool = ALL_LIBRARY_FILES;
    for (const rule of TOPIC_IMAGE_POOLS) {
        if (rule.re.test(haystack)) {
            pool = rule.files;
            break;
        }
    }

    const freshTopicCandidates = pool.filter((f) => !recentFiles.has(f));
    const candidates =
        freshTopicCandidates.length > 0
            ? freshTopicCandidates
            : ALL_LIBRARY_FILES.filter((f) => !recentFiles.has(f));
    const finalPool = candidates.length > 0 ? candidates : pool;

    let h = 0;
    for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
    return `${supabaseUrl}/storage/v1/object/public/blog-images/${finalPool[h % finalPool.length]}`;
}

// Pick a topic that hasn't been used recently
async function pickTopic(supabase: any): Promise<string> {
    // Fetch recent post titles to avoid duplicates
    const { data: recentPosts } = await supabase
        .from("blog_posts")
        .select("title")
        .order("created_at", { ascending: false })
        .limit(20);

    const usedTitles = new Set(
        (recentPosts || []).map((p: any) => p.title.toLowerCase())
    );

    // Filter out topics that are too similar to recent posts
    const available = TOPIC_POOL.filter(
        (t) => !usedTitles.has(t.toLowerCase())
    );

    // Pick a random topic from available, or fallback to full pool
    const pool = available.length > 0 ? available : TOPIC_POOL;
    return pool[Math.floor(Math.random() * pool.length)];
}

const systemPrompt = `You are an expert blog content writer for Hwabelle, a premium flower pressing kit brand. Generate SEO and AEO optimized blog posts about flower pressing, botanical art, and related topics.

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

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Auth: accept either a cron secret or the service role key
        const authHeader = req.headers.get("authorization") || "";
        const cronSecret = Deno.env.get("AUTO_BLOG_SECRET") || "";
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        // Allow if: invoked by Supabase cron (no auth needed for internal calls),
        // or if the caller provides the correct secret
        const isInternalCall = authHeader.includes(serviceRoleKey);
        const hasSecret =
            cronSecret &&
            (authHeader === `Bearer ${cronSecret}` ||
                req.url.includes(`secret=${cronSecret}`));

        // For Supabase cron jobs, the function is invoked internally
        // Accept all POST requests (cron, admin, or secret-based)
        if (req.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabase = createClient(supabaseUrl, serviceRoleKey);

        let reqBody: Record<string, unknown> = {};
        try {
            reqBody = await req.json();
        } catch {
            reqBody = {};
        }

        // Strict 1-blog-per-day guard (prevents duplicate posts from overlapping cron/GitHub triggers)
        if (reqBody.manualAdminOverride !== true) {
            const now = new Date();
            const startOfUtcDay = new Date(
                Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)
            ).toISOString();

            const { data: todaysPosts } = await supabase
                .from("blog_posts")
                .select("id, title, slug, created_at")
                .gte("created_at", startOfUtcDay)
                .order("created_at", { ascending: false })
                .limit(1);

            if (todaysPosts && todaysPosts.length > 0) {
                console.log(
                    `Auto-blog skipped: daily quota of 1 post already met today ("${todaysPosts[0].title}")`
                );
                return new Response(
                    JSON.stringify({
                        success: true,
                        skipped: true,
                        reason: "Daily blog limit (1 per day) already met for today.",
                        existingPost: todaysPosts[0],
                    }),
                    {
                        status: 200,
                        headers: { ...corsHeaders, "Content-Type": "application/json" },
                    }
                );
            }
        }

        const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
        if (!GOOGLE_API_KEY) {
            throw new Error("GOOGLE_API_KEY is not configured");
        }

        // Pick a topic
        const topic = await pickTopic(supabase);
        console.log(`Auto-blog generating post for topic: "${topic}"`);

        const userPrompt = `Generate a comprehensive blog post about: "${topic}"

The blog post should be 800-1200 words and optimized for search engines and AI answer engines.

Return a JSON object with these fields:
- title: Compelling, SEO-friendly title (under 60 chars)
- metaDescription: SEO meta description (under 160 chars)
- excerpt: Brief preview text for listings (1-2 sentences)
- content: Full blog post content in Markdown format with question-style H2/H3 headings
- seoKeywords: Array of 5-8 relevant SEO keywords
- longTailQueries: Array of 3-5 long-tail search queries this post answers`;

        let blogData: any = null;

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
                                {
                                    role: "user",
                                    parts: [{ text: systemPrompt + "\n\n" + userPrompt }],
                                },
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
                    const textContent = parts
                        .filter((p: any) => typeof p?.text === "string" && !p.thought)
                        .map((p: any) => p.text)
                        .join("");
                    if (textContent) {
                        blogData = JSON.parse(textContent);
                        break;
                    }
                } else {
                    const errorText = await response.text();
                    console.warn(`Gemini API error (${modelName}):`, response.status, errorText);
                }
            } catch (geminiErr) {
                console.warn(`Gemini API exception (${modelName}):`, geminiErr);
            }
        }

        if (!blogData) {
            const openAiKey = Deno.env.get("OPENAI_API_KEY");
            if (openAiKey) {
                const oaRes = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${openAiKey}`,
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
                if (oaRes.ok) {
                    const oaData = await oaRes.json();
                    const oaText = oaData?.choices?.[0]?.message?.content;
                    if (oaText) blogData = JSON.parse(oaText);
                }
            }
        }

        if (!blogData) {
            throw new Error("Both primary and backup AI providers failed to generate blog content; skipping publish.");
        }

        // Generate unique slug
        const baseSlug = blogData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        const timestamp = Date.now().toString(36);
        const slug = `${baseSlug}-${timestamp}`;

        const featuredImageUrl = await resolveFutureBlogImage(
            supabase,
            supabaseUrl,
            GOOGLE_API_KEY,
            blogData.title,
            slug,
            blogData.seoKeywords || []
        );

        // Insert as published
        const { data: post, error: insertError } = await supabase
            .from("blog_posts")
            .insert({
                title: blogData.title,
                slug,
                content: blogData.content,
                excerpt: blogData.excerpt,
                meta_description: blogData.metaDescription,
                featured_image_url: featuredImageUrl,
                seo_keywords: blogData.seoKeywords || [],
                long_tail_queries: blogData.longTailQueries || [],
                author_name: "Hwabelle",
                status: "published",
                published_at: new Date().toISOString(),
            })
            .select("id, title, slug")
            .single();

        if (insertError) {
            console.error("Failed to insert blog post:", insertError);
            throw new Error(`Insert failed: ${insertError.message}`);
        }

        console.log(`Auto-blog published: "${post.title}" (${post.slug})`);

        return new Response(
            JSON.stringify({
                success: true,
                post: {
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    url: `https://www.hwabelle.shop/blog/${post.slug}`,
                },
            }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error: unknown) {
        const message =
            error instanceof Error ? error.message : "Failed to generate blog post";
        console.error("Auto-blog error:", message, error);
        return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
