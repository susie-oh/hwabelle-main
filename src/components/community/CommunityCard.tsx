import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, CheckCircle, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export interface CommunityCardData {
  id: string;
  slug: string;
  project_title: string;
  public_display_name: string;
  approved_social_handle?: string | null;
  category: string;
  stage: string;
  flowers_used?: string | null;
  edited_story: string;
  source_type?: string;
  verified_hwabelle_customer?: boolean;
  og_image_path?: string | null;
  published_at?: string | null;
  media?: Array<{
    id: string;
    public_storage_path: string;
    media_type: "image" | "video";
    alt_text?: string;
    is_primary?: boolean;
  }>;
}

interface CommunityCardProps {
  creation: CommunityCardData;
  placement?: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  weddings: "Weddings",
  garden_flowers: "Garden Flowers",
  gifts_memorials: "Gifts & Memorials",
  unboxing: "Unboxing",
  before_after: "Before & After",
  in_progress: "In Progress",
  finished_piece: "Finished Piece",
  other: "Craft Project",
};

export const CommunityCard: React.FC<CommunityCardProps> = ({
  creation,
  placement = "gallery",
}) => {
  // Resolve media public URL from Supabase Storage or fallback
  const primaryMedia =
    creation.media?.find((m) => m.is_primary) || creation.media?.[0];
  const storagePath = primaryMedia?.public_storage_path || creation.og_image_path;

  let imageUrl = "/assets/blog-botanical-art.jpg";
  if (storagePath) {
    if (
      storagePath.startsWith("http") ||
      storagePath.startsWith("/") ||
      storagePath.startsWith("data:") ||
      storagePath.startsWith("blob:") ||
      storagePath.startsWith("@") ||
      storagePath.includes("/assets/") ||
      storagePath.includes(".jpg") ||
      storagePath.includes(".png") ||
      storagePath.includes(".webp")
    ) {
      imageUrl = storagePath;
    } else {
      const { data } = supabase.storage
        .from("community-media")
        .getPublicUrl(storagePath);
      if (data?.publicUrl) imageUrl = data.publicUrl;
    }
  }

  const categoryLabel = CATEGORY_LABELS[creation.category] || creation.category;

  const handleClick = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "community_card_open", {
        creation_id: creation.id,
        category: creation.category,
        placement,
      });
    }
  };

  const isTeam = creation.source_type === "team_created" || creation.source_type === "inspiration";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col h-full bg-background border border-border/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)] transition-all"
    >
      <Link
        to={`/community/${creation.slug}`}
        onClick={handleClick}
        className="block relative aspect-[4/3] bg-secondary overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={primaryMedia?.alt_text || creation.project_title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-background/90 backdrop-blur-sm text-foreground text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full border border-border/60 shadow-xs">
            {categoryLabel}
          </span>
        </div>

        {/* Team Inspiration or Verified Badge */}
        {isTeam ? (
          <div className="absolute top-3 right-3">
            <span className="bg-emerald-950/80 backdrop-blur-sm text-emerald-100 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
              <Sparkles className="w-3 h-3" /> Team Inspiration
            </span>
          </div>
        ) : creation.verified_hwabelle_customer ? (
          <div className="absolute top-3 right-3">
            <span className="bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> Made with Hwabelle
            </span>
          </div>
        ) : null}
      </Link>

      <div className="flex-1 p-5 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>By {creation.public_display_name}</span>
            {creation.flowers_used && (
              <span className="truncate max-w-[130px] italic text-[11px]">
                {creation.flowers_used}
              </span>
            )}
          </div>

          <h3 className="font-serif text-lg font-normal tracking-tight text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            <Link to={`/community/${creation.slug}`} onClick={handleClick}>
              {creation.project_title}
            </Link>
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
            {creation.edited_story}
          </p>
        </div>

        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {creation.stage.replace("_", " ")}
          </span>
          <Link
            to={`/community/${creation.slug}`}
            onClick={handleClick}
            className="text-xs font-medium text-foreground inline-flex items-center gap-1 group-hover:underline underline-offset-4"
          >
            View Story <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
