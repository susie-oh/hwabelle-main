import React, { useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CommunityShareBarProps {
  slug: string;
  projectTitle: string;
  ogImageUrl?: string;
  creationId?: string;
}

export const CommunityShareBar: React.FC<CommunityShareBarProps> = ({
  slug,
  projectTitle,
  ogImageUrl,
  creationId,
}) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = (network: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://hwabelle.shop";
    const base = `${origin}/community/${slug}`;
    const params = new URLSearchParams({
      utm_source: network,
      utm_medium: "social_share",
      utm_campaign: "hwabelle_in_bloom",
    });
    return `${base}?${params.toString()}`;
  };

  const trackShare = (network: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "community_share", {
        network,
        creation_id: creationId || slug,
      });
    }
  };

  const handleCopyLink = async () => {
    const url = getShareUrl("copy_link");
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      trackShare("copy_link");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handlePinterest = () => {
    trackShare("pinterest");
    const shareUrl = getShareUrl("pinterest");
    const imgUrl = ogImageUrl || `${window.location.origin}/favicon.png`;
    const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(imgUrl)}&description=${encodeURIComponent(projectTitle)}`;
    window.open(pinUrl, "_blank", "noopener,noreferrer,width=750,height=600");
  };

  const handleFacebook = () => {
    trackShare("facebook");
    const shareUrl = getShareUrl("facebook");
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium mr-1">
        Share:
      </span>

      {/* Copy Link */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="text-xs h-8 gap-1.5 rounded-full"
        aria-label="Copy creation link to clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </Button>

      {/* Pinterest */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePinterest}
        className="text-xs h-8 rounded-full hover:text-[#bd081c] hover:border-[#bd081c]/40"
        aria-label="Share on Pinterest"
      >
        Pinterest
      </Button>

      {/* Facebook */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleFacebook}
        className="text-xs h-8 rounded-full hover:text-[#1877f2] hover:border-[#1877f2]/40"
        aria-label="Share on Facebook"
      >
        Facebook
      </Button>
    </div>
  );
};
