import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { CommunityCard, CommunityCardData } from "@/components/community/CommunityCard";
import { Sparkles, Plus, BookOpen, ShoppingBag, ArrowRight, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCT_PATH } from "@/lib/site";
import { COMMUNITY_SEED_CREATIONS } from "@/data/communitySeedCreations";

const FILTERS = [
  { id: "all", label: "All Creations" },
  { id: "finished_piece", label: "Finished Pieces" },
  { id: "before_after", label: "Before & After" },
  { id: "in_progress", label: "In Progress" },
  { id: "unboxing", label: "Unboxing" },
  { id: "weddings", label: "Weddings" },
  { id: "garden_flowers", label: "Garden Flowers" },
  { id: "gifts_memorials", label: "Gifts & Memorials" },
];

export default function CommunityHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = searchParams.get("type") || "all";

  const [creations, setCreations] = useState<CommunityCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const PAGE_SIZE = 12;

  // Track initial page view
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "community_view");
    }
  }, []);

  // Fetch creations whenever filter or page changes
  useEffect(() => {
    let isCancelled = false;

    const fetchCreations = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from("community_publications")
          .select(`
            id, slug, project_title, public_display_name, approved_social_handle,
            category, stage, flowers_used, edited_story, source_type,
            verified_hwabelle_customer, og_image_path, published_at,
            community_publication_media(id, public_storage_path, media_type, alt_text, is_primary, sort_order)
          `, { count: "exact" })
          .eq("publication_status", "published");

        if (activeFilter !== "all") {
          if (["finished_piece", "before_after", "in_progress", "unboxing"].includes(activeFilter)) {
            query = query.or(`category.eq.${activeFilter},stage.eq.${activeFilter}`);
          } else {
            query = query.eq("category", activeFilter as any);
          }
        }

        query = query
          .order("featured", { ascending: false })
          .order("published_at", { ascending: false })
          .range(0, page * PAGE_SIZE - 1);

        const { data, count, error } = await query;

        if (!isCancelled) {
          const dbFormatted: CommunityCardData[] = (data || []).map((item: any) => ({
            id: item.id,
            slug: item.slug,
            project_title: item.project_title,
            public_display_name: item.public_display_name,
            approved_social_handle: item.approved_social_handle,
            category: item.category,
            stage: item.stage,
            flowers_used: item.flowers_used,
            edited_story: item.edited_story,
            source_type: item.source_type,
            verified_hwabelle_customer: item.verified_hwabelle_customer,
            og_image_path: item.og_image_path,
            published_at: item.published_at,
            media: (item.community_publication_media || []).sort(
              (a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)
            ),
          }));

          // Filter seed items matching active filter
          const seedFiltered = COMMUNITY_SEED_CREATIONS.filter((seed) => {
            if (activeFilter === "all") return true;
            if (["finished_piece", "before_after", "in_progress", "unboxing"].includes(activeFilter)) {
              return seed.category === activeFilter || seed.stage === activeFilter;
            }
            return seed.category === activeFilter;
          });

          // Combine DB items + unique seed items
          const dbSlugs = new Set(dbFormatted.map((d) => d.slug));
          const combined = [...dbFormatted, ...seedFiltered.filter((s) => !dbSlugs.has(s.slug))];

          const total = (count || 0) + seedFiltered.filter((s) => !dbSlugs.has(s.slug)).length;

          setCreations(combined);
          setTotalCount(total);
          setHasMore(total > combined.length);
        }
      } catch (err) {
        console.error("Error fetching community creations:", err);
        // Fallback to seed creations if DB offline or empty
        if (!isCancelled) {
          const seedFiltered = COMMUNITY_SEED_CREATIONS.filter((seed) => {
            if (activeFilter === "all") return true;
            if (["finished_piece", "before_after", "in_progress", "unboxing"].includes(activeFilter)) {
              return seed.category === activeFilter || seed.stage === activeFilter;
            }
            return seed.category === activeFilter;
          });
          setCreations(seedFiltered);
          setTotalCount(seedFiltered.length);
          setHasMore(false);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchCreations();

    return () => {
      isCancelled = true;
    };
  }, [activeFilter, page]);

  const handleFilterChange = (filterId: string) => {
    if (filterId === activeFilter) return;

    if (filterId === "all") {
      searchParams.delete("type");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ type: filterId });
    }

    setPage(1);

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "community_filter", {
        filter: filterId,
      });
    }
  };

  const handleScrollToGallery = () => {
    const galleryEl = document.getElementById("community-gallery");
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout>
      <Seo
        title="Hwabelle in Bloom | Community Pressed Flower Creations & Stories"
        description="Wedding bouquets, garden finds, meaningful gifts, and works in progress — see what the Hwabelle community is creating, then share your own."
        path="/community"
        schema={[
          collectionPageSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Community Gallery", path: "/community" },
          ]),
        ]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border/50">
        <div className="container max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-foreground text-xs uppercase tracking-widest font-medium">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Made with Hwabelle
          </div>

          <h1 className="font-serif text-display md:text-display-lg text-foreground tracking-tight">
            Every Flower Has a Story
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Wedding bouquets, garden finds, meaningful gifts, and works in progress — see what the Hwabelle community is creating, then share your own.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button size="lg" asChild className="w-full sm:w-auto min-w-[180px]">
              <Link to="/community/submit">
                <Plus className="w-4 h-4 mr-2" /> Share My Creation
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleScrollToGallery}
              className="w-full sm:w-auto min-w-[180px]"
            >
              Explore the Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section id="community-gallery" className="py-12 md:py-16 bg-background">
        <div className="container">
          {/* Accessible Filter Bar */}
          <div className="flex items-center justify-between gap-4 mb-8 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2 shrink-0" role="tablist" aria-label="Creation categories">
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleFilterChange(f.id)}
                    className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                      isActive
                        ? "bg-foreground text-background shadow-xs"
                        : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border/40"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground shrink-0">
              <span>{totalCount} {totalCount === 1 ? "Creation" : "Creations"}</span>
            </div>
          </div>

          {/* Gallery Grid */}
          {isLoading && creations.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/60 bg-secondary/30 aspect-[4/5] animate-pulse"
                />
              ))}
            </div>
          ) : creations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {creations.map((creation) => (
                  <CommunityCard key={creation.id} creation={creation} placement="hub_gallery" />
                ))}
              </div>

              {/* Load More Pagination */}
              {hasMore && (
                <div className="text-center pt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    disabled={isLoading}
                    onClick={() => setPage((p) => p + 1)}
                    className="min-w-[180px] rounded-full"
                  >
                    {isLoading ? "Loading..." : "Load More Creations"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 max-w-md mx-auto space-y-4 bg-secondary/30 rounded-3xl border border-border/60">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                <Filter className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-xl text-foreground">No creations in this view yet</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Be the first to share your floral project in this category!
              </p>
              <div className="pt-2">
                <Button asChild size="sm">
                  <Link to="/community/submit">Submit Your Creation</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Educational Guide & Product Loop CTA */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/40 border border-border/70 rounded-3xl p-8 md:p-10">
            <div className="space-y-3">
              <span className="caption">Learn & Create</span>
              <h2 className="font-serif text-2xl text-foreground">
                Want to press your own flowers?
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Explore our beginner-friendly guides on bloom harvesting, moisture levels, and the step-by-step 4-step pressing framework.
              </p>
              <div className="pt-2">
                <Button variant="outline" size="sm" asChild className="gap-1.5">
                  <Link to="/resources/flower-pressing-guide">
                    <BookOpen className="w-4 h-4" /> Read Beginner Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-3 md:border-l md:border-border/60 md:pl-8">
              <span className="caption">The Equipment</span>
              <h2 className="font-serif text-2xl text-foreground">
                Hwabelle Acrylic Flower Press Kit
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                Thick scalloped acrylic plates, absorbent cotton blotting sheets, and stainless steel hardware engineered for even pressure and flat flowers.
              </p>
              <div className="pt-2">
                <Button variant="default" size="sm" asChild className="gap-1.5">
                  <Link to={PRODUCT_PATH}>
                    <ShoppingBag className="w-4 h-4" /> Shop the Press Kit <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
