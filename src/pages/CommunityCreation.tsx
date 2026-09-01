import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, creativeWorkSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { CommunityShareBar } from "@/components/community/CommunityShareBar";
import { CommunityBeforeAfter } from "@/components/community/CommunityBeforeAfter";
import {
  Sparkles,
  CheckCircle,
  BookOpen,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Layers,
  Flower2,
  FileText,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCT_PATH } from "@/lib/site";
import { CATEGORY_LABELS } from "@/components/community/CommunityCard";
import { COMMUNITY_SEED_CREATIONS } from "@/data/communitySeedCreations";

export default function CommunityCreation() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [creation, setCreation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchCreation = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("community_publications")
          .select(`
            *,
            community_publication_media(*)
          `)
          .eq("slug", slug)
          .maybeSingle();

        if (data) {
          if (data.publication_status !== "published") {
            setIsArchived(true);
            setIsLoading(false);
            return;
          }

          const sortedMedia = (data.community_publication_media || []).sort(
            (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
          );

          setCreation({ ...data, media: sortedMedia });
          return;
        }

        // Check seed creations
        const seed = COMMUNITY_SEED_CREATIONS.find((s) => s.slug === slug);
        if (seed) {
          setCreation(seed);
          return;
        }
      } catch (err) {
        console.error("Error fetching community creation:", err);
        const seed = COMMUNITY_SEED_CREATIONS.find((s) => s.slug === slug);
        if (seed) {
          setCreation(seed);
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCreation();
  }, [slug]);

  const handleProductClick = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "community_product_click", {
        placement: "creation_detail",
        creation_id: creation?.id,
      });
    }
  };

  const getMediaUrl = (path: string) => {
    if (!path) return "/assets/blog-botanical-art.jpg";
    if (
      path.startsWith("http") ||
      path.startsWith("/") ||
      path.startsWith("data:") ||
      path.startsWith("blob:") ||
      path.startsWith("@") ||
      path.includes("/assets/") ||
      path.includes(".jpg") ||
      path.includes(".png") ||
      path.includes(".webp")
    ) {
      return path;
    }
    const { data } = supabase.storage.from("community-media").getPublicUrl(path);
    return data?.publicUrl || path;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl py-20 text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground mt-4">Loading creation...</p>
        </div>
      </Layout>
    );
  }

  if (isArchived) {
    return (
      <Layout>
        <div className="container max-w-lg py-24 text-center space-y-4">
          <h1 className="font-serif text-2xl text-foreground">Creation Archived</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This creation is no longer publicly visible. Explore other inspiring botanical stories in our community gallery.
          </p>
          <div className="pt-4">
            <Button asChild>
              <Link to="/community">Explore Community Gallery</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!creation) {
    return (
      <Layout>
        <div className="container max-w-lg py-24 text-center space-y-4">
          <h1 className="font-serif text-2xl text-foreground">Creation Not Found</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We couldn't find the requested community creation.
          </p>
          <div className="pt-4">
            <Button asChild>
              <Link to="/community">← Return to Community Gallery</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const categoryLabel = CATEGORY_LABELS[creation.category] || creation.category;
  const isTeam = creation.source_type === "team_created" || creation.source_type === "inspiration";
  const primaryMedia = creation.media?.find((m: any) => m.is_primary) || creation.media?.[0];
  const ogImageUrl = primaryMedia ? getMediaUrl(primaryMedia.public_storage_path) : undefined;

  const isBeforeAfter =
    creation.stage === "before_after" ||
    creation.category === "before_after" ||
    (creation.media?.length === 2 && creation.media.every((m: any) => m.media_type === "image"));

  const hasVideo = creation.has_video && creation.media?.some((m: any) => m.media_type === "video");
  const videoMedia = creation.media?.find((m: any) => m.media_type === "video");

  return (
    <Layout>
      <Seo
        title={creation.seo_title || `${creation.project_title} | Hwabelle in Bloom`}
        description={
          creation.seo_description ||
          `${creation.project_title} created by ${creation.public_display_name}. Pressed with Hwabelle.`
        }
        path={`/community/${creation.slug}`}
        image={ogImageUrl}
        schema={[
          creativeWorkSchema({
            title: creation.project_title,
            description: creation.edited_story,
            authorName: creation.public_display_name,
            datePublished: creation.published_at,
            image: ogImageUrl,
            url: `https://hwabelle.shop/community/${creation.slug}`,
            genre: categoryLabel,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Community", path: "/community" },
            { name: creation.project_title, path: `/community/${creation.slug}` },
          ]),
        ]}
      />

      <article className="container max-w-4xl py-10 md:py-16 space-y-10">
        {/* Back Link */}
        <div>
          <Link
            to="/community"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Hwabelle in Bloom
          </Link>
        </div>

        {/* Header Block */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-secondary text-foreground text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full border border-border/60">
              {categoryLabel}
            </span>

            {isTeam ? (
              <span className="bg-emerald-950/80 text-emerald-100 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Created by the Hwabelle Team
              </span>
            ) : creation.verified_hwabelle_customer ? (
              <span className="bg-foreground text-background text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Made with Hwabelle
              </span>
            ) : null}

            {creation.stage && (
              <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> {creation.stage.replace("_", " ")}
              </span>
            )}
          </div>

          <h1 className="font-serif text-display md:text-display-lg text-foreground tracking-tight">
            {creation.project_title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/60 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>
                By <strong className="text-foreground">{creation.public_display_name}</strong>
                {creation.approved_social_handle && (
                  <span className="ml-1 text-primary">({creation.approved_social_handle})</span>
                )}
              </span>
              {creation.published_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(creation.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>

            <CommunityShareBar
              slug={creation.slug}
              projectTitle={creation.project_title}
              ogImageUrl={ogImageUrl}
              creationId={creation.id}
            />
          </div>
        </header>

        {/* Media Presentation */}
        <section className="space-y-6">
          {hasVideo && videoMedia ? (
            /* Video Player */
            <div className="rounded-3xl overflow-hidden bg-black border border-border shadow-sm">
              <video
                src={getMediaUrl(videoMedia.public_storage_path)}
                poster={videoMedia.poster_path ? getMediaUrl(videoMedia.poster_path) : undefined}
                controls
                playsInline
                preload="metadata"
                className="w-full aspect-video object-contain"
                aria-label={`Video of ${creation.project_title}`}
              />
              {videoMedia.transcript && (
                <div className="p-4 bg-secondary/80 border-t border-border/60 text-xs space-y-1">
                  <p className="font-semibold text-foreground flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Transcript
                  </p>
                  <p className="text-muted-foreground whitespace-pre-wrap">{videoMedia.transcript}</p>
                </div>
              )}
            </div>
          ) : isBeforeAfter && creation.media?.length >= 2 ? (
            /* Before and After Accessible Viewer */
            <div className="space-y-3">
              <CommunityBeforeAfter
                beforeImage={getMediaUrl(creation.media[0].public_storage_path)}
                afterImage={getMediaUrl(creation.media[1].public_storage_path)}
                beforeLabel={creation.media[0].caption || "Fresh Flowers"}
                afterLabel={creation.media[1].caption || "Pressed Keepsake"}
                altBefore={creation.media[0].alt_text || "Before pressing"}
                altAfter={creation.media[1].alt_text || "After pressing"}
              />
              <p className="text-center text-xs text-muted-foreground">
                Drag or use Arrow keys to compare the fresh blooms to the framed pressed result.
              </p>
            </div>
          ) : (
            /* Image Gallery (Single or Grid) */
            <div className="space-y-4">
              {creation.media?.map((m: any, idx: number) => (
                <figure key={m.id || idx} className="rounded-3xl overflow-hidden border border-border/80 bg-secondary">
                  <img
                    src={getMediaUrl(m.public_storage_path)}
                    alt={m.alt_text || creation.project_title}
                    className="w-full max-h-[600px] object-cover"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                  {m.caption && (
                    <figcaption className="p-3 text-xs text-center text-muted-foreground bg-background border-t border-border/60">
                      {m.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </section>

        {/* Story & Botanical Details */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-serif text-2xl text-foreground">The Story</h2>
            <div className="text-foreground text-sm md:text-base leading-relaxed whitespace-pre-line space-y-4 font-normal">
              {creation.edited_story}
            </div>
          </div>

          <aside className="space-y-6 bg-secondary/40 p-6 rounded-3xl border border-border/60 h-fit">
            {creation.flowers_used && (
              <div className="space-y-1.5">
                <span className="caption flex items-center gap-1">
                  <Flower2 className="w-3.5 h-3.5" /> Botanicals Used
                </span>
                <p className="text-xs text-foreground font-medium">{creation.flowers_used}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="caption">Occasion</span>
              <p className="text-xs text-foreground font-medium">{categoryLabel}</p>
            </div>

            <div className="pt-4 border-t border-border/60 space-y-3">
              <span className="caption">Recreate This Look</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Preserve your own wedding blooms or garden favorites with our beginner-friendly press kit.
              </p>
              <Button size="sm" asChild className="w-full" onClick={handleProductClick}>
                <Link to={PRODUCT_PATH}>
                  <ShoppingBag className="w-3.5 h-3.5 mr-1.5" /> Get the Flower Press Kit
                </Link>
              </Button>
            </div>

            {creation.related_resource_slug && (
              <div className="pt-4 border-t border-border/60">
                <Link
                  to={`/resources/${creation.related_resource_slug}`}
                  className="text-xs text-foreground font-medium flex items-center gap-1.5 hover:underline"
                >
                  <BookOpen className="w-3.5 h-3.5 text-muted-foreground" /> Related Pressing Guide <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </aside>
        </section>

        {/* Bottom Navigation */}
        <footer className="pt-10 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button variant="outline" asChild>
            <Link to="/community">← Explore More Creations</Link>
          </Button>

          <Button asChild>
            <Link to="/community/submit">Share Your Own Creation</Link>
          </Button>
        </footer>
      </article>
    </Layout>
  );
}
