import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import blogImage from "@/assets/blog-botanical-art.jpg";

const categories = ["All", "Flower Pressing", "DIY", "Botanical Art", "Preservation Tips"];

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

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-2xl">
            <p className="caption mb-4">Journal</p>
            <h1 className="font-serif text-display-lg mb-4">Stories & Guides</h1>
            <p className="text-muted-foreground text-lg">
              Inspiration, techniques, and ideas for your botanical journey.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-divider bg-background sticky top-16 md:top-20 z-40">
        <div className="container">
          <div className="flex gap-6 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`text-sm whitespace-nowrap transition-colors ${
                  index === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-muted-foreground">
              Failed to load posts. Please try again later.
            </div>
          ) : posts?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No blog posts yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {posts?.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
                  <div className="aspect-[4/3] mb-5 overflow-hidden bg-secondary">
                    <img 
                      src={post.featured_image_url || blogImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    {post.seo_keywords?.[0] && (
                      <>
                        <span className="caption">{post.seo_keywords[0]}</span>
                        <span className="text-muted-foreground/40">·</span>
                      </>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {post.published_at 
                        ? format(new Date(post.published_at), "MMM d, yyyy")
                        : "Draft"}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl mb-2 group-hover:underline underline-offset-4">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
