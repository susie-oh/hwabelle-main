import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import blogImage from "@/assets/blog-botanical-art.jpg";
import { resourcePosts } from "@/content/resources";
import { defaultKeywords } from "@/lib/site";

const categories = ["All", "Wedding Preservation", "Beginner Guide", "Buying Guide", "Craft Ideas"];

const Blog = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
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
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
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

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <p className="caption mb-4">Resources</p>
            <h1 className="font-serif text-display-lg mb-4">Flower preservation guides and ideas</h1>
            <p className="text-muted-foreground text-lg">
              Practical help for preserving wedding bouquets, pressing flowers at home, and creating meaningful keepsakes.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-divider bg-background sticky top-16 md:top-20 z-40">
        <div className="container">
          <div className="flex gap-6 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <span
                key={index}
                className={`text-sm whitespace-nowrap ${
                  index === 0 ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error && mergedPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Failed to load resources. Please try again later.
            </div>
          ) : mergedPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No resources available yet. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {mergedPosts.map((post) => (
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
                        {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : "Resource"}
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
