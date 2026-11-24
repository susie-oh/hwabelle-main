import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Twitter, Facebook } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { resourcePostBySlug } from "@/content/resources";
import ResourceCTA from "@/components/resources/ResourceCTA";
import { resolveBlogCoverImage, resolveBlogInlineImage } from "@/lib/blogImages";

function splitMarkdownAfterSecondSection(md: string): [string, string | null] {
  if (!md || md.includes("![")) return [md, null];
  const headingMatches = [...md.matchAll(/^##\s+/gm)];
  // Split right before the 3rd H2 (i.e., after the 2nd H2 section), or before the 2nd H2 if short
  const splitMatch = headingMatches[2] || headingMatches[1];
  if (!splitMatch || splitMatch.index === undefined) return [md, null];
  // Trim trailing horizontal rule before the split so spacing looks clean
  const before = md.slice(0, splitMatch.index).replace(/\n---\s*$/, "").trimEnd();
  const after = md.slice(splitMatch.index).trimStart();
  return [before, after];
}

const PROSE_CLASSES = `prose prose-lg max-w-none
  prose-headings:font-serif prose-headings:text-foreground prose-headings:tracking-tight
  prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:leading-snug prose-h2:border-b prose-h2:border-divider/40 prose-h2:pb-3
  prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-10 prose-h3:mb-5 prose-h3:leading-snug
  prose-p:text-muted-foreground prose-p:text-base prose-p:md:text-lg prose-p:leading-[1.85] prose-p:mb-7
  prose-ul:text-muted-foreground prose-ul:leading-[1.85] prose-ul:my-6 prose-ul:pl-6
  prose-ol:text-muted-foreground prose-ol:leading-[1.85] prose-ol:my-6 prose-ol:pl-6
  prose-li:text-muted-foreground prose-li:text-base prose-li:md:text-lg prose-li:mb-3
  prose-strong:text-foreground prose-strong:font-semibold
  prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:underline prose-a:underline-offset-2
  prose-img:rounded-2xl prose-img:shadow-sm prose-img:my-10
  prose-blockquote:border-l-emerald-500 prose-blockquote:bg-secondary/30 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
  [&>*:first-child]:mt-0`;

const BlogPost = () => {
  const { slug } = useParams();

  const staticPost = slug ? resourcePostBySlug[slug] : undefined;

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
    enabled: !!slug && !staticPost,
  });

  const resolvedPost = staticPost
    ? {
        title: staticPost.title,
        featured_image_url: staticPost.featuredImage,
        seo_keywords: staticPost.seoKeywords,
        published_at: staticPost.publishedAt,
        author_name: staticPost.authorName,
        content: staticPost.content,
        excerpt: staticPost.excerpt,
        meta_description: staticPost.metaDescription,
      }
    : post;

  const heroImageUrl = resolvedPost
    ? resolveBlogCoverImage({
        slug,
        title: resolvedPost.title,
        featuredImageUrl: resolvedPost.featured_image_url,
        keywords: resolvedPost.seo_keywords,
      })
    : "/blog-images/acrylic-press-flatlay.jpg";

  const inlineVisual = resolvedPost
    ? resolveBlogInlineImage({
        slug,
        title: resolvedPost.title,
        coverUrl: heroImageUrl,
        keywords: resolvedPost.seo_keywords,
      })
    : null;

  const [contentPartA, contentPartB] = splitMarkdownAfterSecondSection(resolvedPost?.content || "");

  const derivedFaqs =
    resolvedPost?.content
      ?.split("## FAQ")[1]
      ?.split("### ")
      .slice(1)
      .map((item) => {
        const [question, ...rest] = item.split("\n\n");
        return question && rest.length
          ? { question: question.trim(), answer: rest.join("\n\n").trim() }
          : null;
      })
      .filter(Boolean) as Array<{ question: string; answer: string }> | undefined;

  if (isLoading && !staticPost) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if ((error || !resolvedPost) && !staticPost) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="font-serif text-display mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The resource you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button variant="outline" asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title={`${resolvedPost.title} | Hwabelle`}
        description={resolvedPost.meta_description || resolvedPost.excerpt || resolvedPost.title}
        path={`/blog/${slug}`}
        image={new URL(heroImageUrl, window.location.origin).toString()}
        type="article"
        keywords={resolvedPost.seo_keywords || []}
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/blog" },
            { name: resolvedPost.title, path: `/blog/${slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: resolvedPost.title,
            description: resolvedPost.meta_description || resolvedPost.excerpt,
            author: resolvedPost.author_name
              ? {
                  "@type": "Organization",
                  name: resolvedPost.author_name,
                }
              : undefined,
            datePublished: resolvedPost.published_at,
            image: new URL(heroImageUrl, window.location.origin).toString(),
          },
          ...(derivedFaqs?.length ? [faqSchema(derivedFaqs)] : []),
        ]}
      />

      <div className="container py-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          Back to Resources
        </Link>
      </div>

      <div className="container">
        <div className="max-w-4xl mx-auto aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden bg-secondary shadow-sm border border-border/40">
          <img
            src={heroImageUrl}
            alt={resolvedPost.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
      </div>

      <article className="py-12 md:py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {resolvedPost.seo_keywords?.[0] && (
                <>
                  <span className="caption">{resolvedPost.seo_keywords[0]}</span>
                  <span className="text-muted-foreground/40">·</span>
                </>
              )}
              <span className="text-sm text-muted-foreground">
                {resolvedPost.published_at && format(new Date(resolvedPost.published_at), "MMMM d, yyyy")}
              </span>
              {resolvedPost.author_name && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-sm text-muted-foreground">By {resolvedPost.author_name}</span>
                </>
              )}
            </div>

            <h1 className="font-serif text-display md:text-display-lg mb-8">{resolvedPost.title}</h1>

            <div className="flex items-center gap-4 pb-8 border-b border-divider mb-10">
              <span className="text-sm text-muted-foreground">Share</span>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Share"
                onClick={() => {
                  const url = window.location.href;
                  if (navigator.share) {
                    navigator.share({ title: resolvedPost.title, url });
                  } else {
                    navigator.clipboard.writeText(url);
                  }
                }}
              >
                <Share2 size={18} />
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(resolvedPost.title)}&url=${encodeURIComponent(window.location.href)}`}
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

            <div className={PROSE_CLASSES}>
              <ReactMarkdown>{contentPartA}</ReactMarkdown>
            </div>

            {contentPartB && inlineVisual && (
              <>
                <figure className="my-12 rounded-2xl overflow-hidden bg-secondary/40 border border-border/50 shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden bg-secondary">
                    <img
                      src={inlineVisual.src}
                      alt={inlineVisual.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="px-5 py-3.5 text-xs sm:text-sm text-muted-foreground font-serif italic text-center">
                    {inlineVisual.caption}
                  </figcaption>
                </figure>

                <div className={PROSE_CLASSES}>
                  <ReactMarkdown>{contentPartB}</ReactMarkdown>
                </div>
              </>
            )}

            {/* Lead Magnet CTA for Guide Acquisition */}
            <div className="mt-10">
              <ResourceCTA type="footer" articleSlug={slug || ""} />
            </div>

            {resolvedPost.seo_keywords && resolvedPost.seo_keywords.length > 0 && (
              <div className="mt-8 pt-6 border-t border-divider">
                <div className="flex flex-wrap gap-2">
                  {resolvedPost.seo_keywords.map((keyword: string, index: number) => (
                    <span key={index} className="px-3 py-1 text-xs bg-secondary text-muted-foreground rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 p-8 bg-secondary/60 rounded-2xl border border-border text-center">
              <h2 className="font-serif text-xl mb-3">Ready to preserve your flowers at home?</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Explore the acrylic flower press kit or use the Hwabelle AI Designer for next-step guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" asChild>
                  <Link to="/product/flower-press-kit">Shop the acrylic flower press kit</Link>
                </Button>
                <Button variant="hero-outline" asChild>
                  <Link to="/designer">Explore AI Designer</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
