import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Twitter, Facebook } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import blogImage from "@/assets/blog-botanical-art.jpg";

const BlogPost = () => {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-serif text-display mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="outline" asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Journal
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* SEO Meta Tags - would be better with react-helmet in production */}
      <title>{post.title} | Hwabelle</title>

      {/* Back Link */}
      <div className="container py-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          Back to Journal
        </Link>
      </div>

      {/* Hero Image */}
      <div className="aspect-[21/9] overflow-hidden">
        <img
          src={post.featured_image_url || blogImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <article className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-6">
              {post.seo_keywords?.[0] && (
                <>
                  <span className="caption">{post.seo_keywords[0]}</span>
                  <span className="text-muted-foreground/40">·</span>
                </>
              )}
              <span className="text-sm text-muted-foreground">
                {post.published_at && format(new Date(post.published_at), "MMMM yyyy")}
              </span>
              {post.author_name && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-sm text-muted-foreground">By {post.author_name}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="font-serif text-display md:text-display-lg mb-8">{post.title}</h1>

            {/* Share */}
            <div className="flex items-center gap-4 pb-8 border-b border-divider mb-10">
              <span className="text-sm text-muted-foreground">Share</span>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Share"
                onClick={() => {
                  const url = window.location.href;
                  if (navigator.share) {
                    navigator.share({ title: post.title, url });
                  } else {
                    navigator.clipboard.writeText(url);
                  }
                }}
              >
                <Share2 size={18} />
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Share on Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Share on Facebook"
              >
                <Facebook size={18} />
              </a>
            </div>

            {/* Body - Markdown */}
            <div className="prose prose-lg max-w-none
              prose-headings:font-serif prose-headings:text-foreground prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:leading-snug prose-h2:border-b prose-h2:border-divider/40 prose-h2:pb-3
              prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-10 prose-h3:mb-5 prose-h3:leading-snug
              prose-p:text-muted-foreground prose-p:text-base prose-p:md:text-lg prose-p:leading-[1.85] prose-p:mb-7
              prose-ul:text-muted-foreground prose-ul:leading-[1.85] prose-ul:my-6 prose-ul:pl-6
              prose-ol:text-muted-foreground prose-ol:leading-[1.85] prose-ol:my-6 prose-ol:pl-6
              prose-li:text-muted-foreground prose-li:text-base prose-li:md:text-lg prose-li:mb-3
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:underline prose-a:underline-offset-2
              prose-blockquote:border-l-emerald-500 prose-blockquote:bg-secondary/30 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              [&>*:first-child]:mt-0">
              <ReactMarkdown>{post.content || ""}</ReactMarkdown>
            </div>

            {/* Keywords */}
            {post.seo_keywords && post.seo_keywords.length > 0 && (
              <div className="mt-12 pt-8 border-t border-divider">
                <div className="flex flex-wrap gap-2">
                  {post.seo_keywords.map((keyword: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs bg-secondary text-muted-foreground rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-16 p-8 bg-secondary text-center">
              <h3 className="font-serif text-xl mb-3">Ready to preserve your memories?</h3>
              <p className="text-muted-foreground mb-6">
                Our Flower Press Kit makes it easy to create lasting botanical art.
              </p>
              <Button variant="hero" asChild>
                <Link to="/shop">
                  Shop the Kit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
