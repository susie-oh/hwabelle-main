import { useState } from "react";
import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import blogImage from "@/assets/blog-botanical-art.jpg";
import { resourcePosts } from "@/content/resources";
import { defaultKeywords } from "@/lib/site";

const categories = ["All", "Wedding Preservation", "Beginner Guide", "Buying Guide", "Craft Ideas"];

const formatPublishedDate = (dateStr?: string | null) => {
  if (!dateStr) return "Resource";
  const parsed = new Date(dateStr);
  return Number.isNaN(parsed.getTime()) ? "Resource" : format(parsed, "MMM d, yyyy");
};

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: posts } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("slug, title, excerpt, featured_image_url, seo_keywords, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const supabasePosts =
    posts?.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      featuredImageUrl: post.featured_image_url,
      category: post.seo_keywords?.[0] || "Resource",
      publishedAt: post.published_at,
    })) ?? [];

  const staticPosts = resourcePosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    featuredImageUrl: blogImage,
    category: post.category,
    publishedAt: post.publishedAt,
  }));

  const mergedPosts = [...staticPosts, ...supabasePosts]
    .filter((post, index, array) => array.findIndex((item) => item.slug === post.slug) === index)
    .sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() || 0 : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() || 0 : 0;
      return dateB - dateA;
    });

  const filteredPosts =
    selectedCategory === "All"
      ? mergedPosts
      : mergedPosts.filter((post) => {
          const cat = (post.category || "").toLowerCase();
          const title = (post.title || "").toLowerCase();
          const target = selectedCategory.toLowerCase();
          if (target === "wedding preservation") return cat.includes("wedding") || cat.includes("bouquet") || title.includes("wedding") || title.includes("bouquet");
          if (target === "beginner guide") return cat.includes("beginner") || cat.includes("selection") || title.includes("beginner") || title.includes("how to press");
          if (target === "buying guide") return cat.includes("buying") || title.includes("kit") || title.includes("acrylic") || title.includes("vs");
          if (target === "craft ideas") return cat.includes("craft") || title.includes("frame") || title.includes("art") || title.includes("card") || title.includes("gift");
          return cat === target;
        });

  return (
    <Layout>
      <Seo
        title="Flower Pressing Resources | Hwabelle Guides"
        description="Explore flower pressing guides from Hwabelle, including bouquet preservation, beginner tutorials, flower selection tips, and pressed flower craft ideas."
        path="/blog"
        image={new URL(blogImage, window.location.origin).toString()}
        keywords={[...defaultKeywords, "how to press flowers", "what to do with pressed flowers"]}
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/blog" },
          ]),
        ]}
      />

      <section className="py-16 md:py-20 bg-secondary/70 border-b border-border/50">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <p className="caption mb-3">Hwabelle</p>
              <h1 className="font-serif text-display-lg mb-3">Flower Preservation Guides & Insights</h1>
              <p className="text-muted-foreground text-base sm:text-lg">
                Practical botanical science for preserving wedding bouquets, avoiding browning, and pressing flowers at home.
              </p>
            </div>

            <div className="shrink-0 p-6 rounded-2xl bg-card border border-primary/20 shadow-sm max-w-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Free Masterclasses
              </span>
              <h3 className="font-serif text-lg font-semibold text-foreground mt-1 mb-2">
                Download Free Botanical Field Guides
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Access our complete species drying schedule matrix, 4-step quick start, and flower suitability tiers.
              </p>
              <Link
                to="/resources"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm"
              >
                <span>Visit the Resource Hub →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-divider bg-background sticky top-16 md:top-20 z-40">
        <div className="container">
          <div className="flex gap-6 overflow-x-auto pb-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`text-sm whitespace-nowrap transition-colors pb-1 border-b-2 ${
                    isActive
                      ? "text-foreground font-medium border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No resources found in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <article key={post.slug}>
                  <Link to={`/blog/${post.slug}`} className="group block">
                    <div className="aspect-[4/3] mb-5 overflow-hidden bg-secondary">
                      <img
                        src={post.featuredImageUrl || blogImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="caption">{post.category}</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="text-xs text-muted-foreground">
                        {formatPublishedDate(post.publishedAt)}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl mb-2 group-hover:underline underline-offset-4">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
