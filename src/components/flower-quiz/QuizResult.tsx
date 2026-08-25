import { useCallback } from "react";
import { Link } from "react-router-dom";
import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { FlowerProfile } from "@/data/flowerQuizProfiles";
import FlowerTraits from "./FlowerTraits";
import PressingGuide from "./PressingGuide";
import QuizCTA from "./QuizCTA";
import { SITE_URL } from "@/lib/site";
import {
  trackAIDesignerClicked,
  trackShopClicked,
} from "@/lib/flower-quiz/analytics";
import type { QuizAttribution } from "@/lib/flower-quiz/attribution";

interface QuizResultProps {
  profile: FlowerProfile;
  attribution: QuizAttribution;
}

const QuizResult = ({ profile, attribution }: QuizResultProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${SITE_URL}/flower-quiz/result/${profile.slug}`;
  const shareTitle = `I'm a ${profile.name}! Take the Hwabelle Flower Personality Quiz`;

  const analyticsProps = {
    flower_result: profile.slug,
    source: attribution.source,
    utm_source: attribution.utmSource,
    utm_medium: attribution.utmMedium,
    utm_campaign: attribution.utmCampaign,
  };

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `My flower personality is ${profile.name} — ${profile.tagline}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share — no action needed
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [profile, shareUrl, shareTitle]);

  return (
    <div className="max-w-2xl mx-auto py-12 md:py-16 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="caption mb-4">Your Flower</p>
        <h1 className="font-serif text-display-lg md:text-display-xl mb-4">
          You're a {profile.name}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground italic">
          {profile.tagline}
        </p>
      </div>

      {/* Personality Summary */}
      <section className="mb-12">
        <h2 className="font-serif text-heading mb-4">Your Flower Personality</h2>
        <p className="text-muted-foreground leading-relaxed">
          {profile.personalitySummary}
        </p>
      </section>

      {/* Traits */}
      <section className="mb-12">
        <h2 className="font-serif text-heading mb-4">Your Core Traits</h2>
        <FlowerTraits traits={profile.traits} />
      </section>

      {/* Symbolism */}
      <section className="mb-12">
        <h2 className="font-serif text-heading mb-4">
          What {profile.name} Represents
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {profile.symbolism}
        </p>
      </section>

      {/* Pressing Guide */}
      <section className="mb-12">
        <h2 className="font-serif text-heading mb-4">
          How {profile.name} Presses
        </h2>
        <PressingGuide profile={profile} />
      </section>

      {/* Project Idea */}
      <section className="mb-12 rounded-xl border border-border p-6 md:p-8 bg-secondary/30">
        <h2 className="font-serif text-heading mb-2">Your Hwabelle Project</h2>
        <h3 className="font-serif text-xl mb-3 text-foreground">
          {profile.projectIdea.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {profile.projectIdea.description}
        </p>
      </section>

      {/* CTAs */}
      <section className="mb-12">
        <QuizCTA
          flowerSlug={profile.slug}
          flowerName={profile.name}
          onAIDesignerClick={() => trackAIDesignerClicked(analyticsProps)}
          onShopClick={() => trackShopClicked(analyticsProps)}
        />
      </section>

      {/* Share */}
      <section className="text-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-3 mt-6">
          Share your result
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check size={14} />
              Link Copied
            </>
          ) : navigator.share ? (
            <>
              <Share2 size={14} />
              Share
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy Result Link
            </>
          )}
        </Button>
      </section>

      {/* Retake */}
      <div className="text-center mt-8">
        <Link
          to="/flower-quiz"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
        >
          Retake the quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizResult;
