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

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API error:", response.status, errorText);
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const aiResponse = await response.json();
        const textContent =
            aiResponse.candidates?.[0]?.content?.parts?.[0]?.text;

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

        // Insert as published
        const { data: post, error: insertError } = await supabase
            .from("blog_posts")
            .insert({
                title: blogData.title,
                slug,
                content: blogData.content,
                excerpt: blogData.excerpt,
                meta_description: blogData.metaDescription,
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
