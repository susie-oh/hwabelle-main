import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CommunityCard, CommunityCardData } from "@/components/community/CommunityCard";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import { ArrowRight, Sparkles, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { COMMUNITY_SEED_CREATIONS } from "@/data/communitySeedCreations";

export const CommunityHomepageModule: React.FC = () => {
  const [creations, setCreations] = useState<CommunityCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomepageCreations = async () => {
      try {
        const { data, error } = await supabase
          .from("community_publications")
          .select(`
            id, slug, project_title, public_display_name, approved_social_handle,
            category, stage, flowers_used, edited_story, source_type,
            verified_hwabelle_customer, og_image_path, published_at,
            community_publication_media(id, public_storage_path, media_type, alt_text, is_primary, sort_order)
          `)
          .eq("publication_status", "published")
          .order("featured", { ascending: false })
          .order("published_at", { ascending: false })
          .limit(6);

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

        const dbSlugs = new Set(dbFormatted.map((d) => d.slug));
        const combined = [...dbFormatted, ...COMMUNITY_SEED_CREATIONS.filter((s) => !dbSlugs.has(s.slug))];

        setCreations(combined.slice(0, 6));
      } catch (err) {
        console.error("Error fetching homepage community creations:", err);
        setCreations(COMMUNITY_SEED_CREATIONS.slice(0, 6));
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomepageCreations();
  }, []);

  return (
    <div className="container">
      <ScrollReveal className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-foreground text-xs uppercase tracking-widest font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Hwabelle in Bloom
          </div>
          <h2 className="font-serif text-display md:text-display-lg text-foreground">
            Made by the Hwabelle Community
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-2 max-w-xl">
            Real flowers, meaningful stories, and beautiful things made at home.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link to="/community/submit">
              <Plus className="w-3.5 h-3.5 mr-1" /> Share Yours
            </Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/community">
              Explore Hwabelle in Bloom <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </ScrollReveal>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 bg-secondary/30 aspect-[4/5] animate-pulse"
            />
          ))}
        </div>
      ) : creations.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
          {creations.map((creation) => (
            <StaggerItem key={creation.id}>
              <CommunityCard creation={creation} placement="homepage_module" />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="text-center py-12 px-4 max-w-md mx-auto space-y-3 bg-secondary/30 rounded-3xl border border-border/60">
          <h3 className="font-serif text-lg text-foreground">Be the First to Bloom</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Have you pressed flowers with Hwabelle? Share your finished keepsakes and botanical art with our growing community.
          </p>
          <div className="pt-2">
            <Button size="sm" asChild>
              <Link to="/community/submit">Submit Your Creation</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
