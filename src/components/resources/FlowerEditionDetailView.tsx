import React from "react";
import { Link } from "react-router-dom";
import { FlowerEditionContent } from "@/content/resources/flower-edition-types";
import {
  Sparkles,
  Palette,
  Lightbulb,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ShieldCheck,
  Flower2,
  FileText,
} from "lucide-react";

interface PaletteColorStyle {
  bg: string;
  border?: string;
  shadow?: string;
}

const BOTANICAL_COLORS: Record<string, PaletteColorStyle> = {
  // Daisies & Clover
  "White Daisy": { bg: "#FFFFFF", border: "#CBD5E1", shadow: "0 1px 3px rgba(0,0,0,0.12)" },
  "Green Clover": { bg: "#2E7D32", border: "#1B5E20", shadow: "0 1px 3px rgba(46,125,50,0.35)" },
  "Golden Centers": { bg: "#F59E0B", border: "#D97706", shadow: "0 1px 3px rgba(245,158,11,0.35)" },
  "Cream Paper": { bg: "#F7F2EA", border: "#E2D9CC", shadow: "0 1px 2px rgba(0,0,0,0.06)" },
  "Clear Acrylic": {
    bg: "linear-gradient(135deg, rgba(220, 240, 255, 0.95), rgba(185, 220, 245, 0.75))",
    border: "#90CDF4",
    shadow: "0 1px 3px rgba(66,153,225,0.3)",
  },
  "Brass Hardware": {
    bg: "linear-gradient(135deg, #F3DE8A, #B8860B)",
    border: "#996515",
    shadow: "0 1px 3px rgba(184,134,11,0.4)",
  },

  // Wild Violets and Fern
  "Deep Violet": { bg: "#5B21B6", border: "#4C1D95", shadow: "0 1px 3px rgba(91,33,182,0.4)" },
  "Fresh Fern Green": { bg: "#15803D", border: "#166534", shadow: "0 1px 3px rgba(21,128,61,0.35)" },
  "Soft Lilac": { bg: "#A78BFA", border: "#8B5CF6", shadow: "0 1px 3px rgba(167,139,250,0.35)" },
  "Cream Archival Paper": { bg: "#F5EFE6", border: "#DDD3C1", shadow: "0 1px 2px rgba(0,0,0,0.06)" },

  // Tulips and Small Wildflowers
  "Coral Tulip": { bg: "#EA580C", border: "#C2410C", shadow: "0 1px 3px rgba(234,88,12,0.4)" },
  "Golden Tulip": { bg: "#EAB308", border: "#CA8A04", shadow: "0 1px 3px rgba(234,179,8,0.4)" },
  "Blush Tulip": { bg: "#F472B6", border: "#DB2777", shadow: "0 1px 3px rgba(244,114,182,0.35)" },
  "Small Wildflowers": { bg: "#38BDF8", border: "#0284C7", shadow: "0 1px 3px rgba(56,189,248,0.35)" },

  // Pansies and Cosmos
  "Purple Pansy": { bg: "#4C1D95", border: "#3B0764", shadow: "0 1px 3px rgba(76,29,149,0.45)" },
  "Golden Pansy": { bg: "#FBBF24", border: "#D97706", shadow: "0 1px 3px rgba(251,191,36,0.4)" },
  "White Cosmos": { bg: "#FDFBF7", border: "#CBD5E1", shadow: "0 1px 2px rgba(0,0,0,0.1)" },
  "Feathery Green Foliage": { bg: "#16A34A", border: "#15803D", shadow: "0 1px 3px rgba(22,163,74,0.35)" },

  // Lavender and Baby's Breath
  "Lavender Purple": { bg: "#8B5CF6", border: "#7C3AED", shadow: "0 1px 3px rgba(139,92,246,0.4)" },
  "White Baby's Breath": { bg: "#FFFFFF", border: "#CBD5E1", shadow: "0 1px 3px rgba(0,0,0,0.12)" },
  "Sage Green": { bg: "#65A30D", border: "#4D7C0F", shadow: "0 1px 3px rgba(101,163,13,0.35)" },

  // Calla Lilies and Baby's Breath
  "Orange Calla Lily": { bg: "#F97316", border: "#EA580C", shadow: "0 1px 3px rgba(249,115,22,0.4)" },
  "Golden-Yellow Calla Lily": { bg: "#EAB308", border: "#CA8A04", shadow: "0 1px 3px rgba(234,179,8,0.4)" },
  "Ivory Calla Lily": { bg: "#FEF9C3", border: "#FACC15", shadow: "0 1px 2px rgba(0,0,0,0.08)" },
};

function getBotanicalColor(name: string): PaletteColorStyle {
  if (BOTANICAL_COLORS[name]) {
    return BOTANICAL_COLORS[name];
  }
  const lower = name.toLowerCase();
  if (lower.includes("white")) return { bg: "#FFFFFF", border: "#CBD5E1" };
  if (lower.includes("violet") || lower.includes("purple")) return { bg: "#5B21B6", border: "#4C1D95" };
  if (lower.includes("lilac") || lower.includes("lavender")) return { bg: "#8B5CF6", border: "#7C3AED" };
  if (lower.includes("green") || lower.includes("clover") || lower.includes("fern") || lower.includes("foliage")) return { bg: "#2E7D32", border: "#1B5E20" };
  if (lower.includes("gold") || lower.includes("yellow")) return { bg: "#F59E0B", border: "#D97706" };
  if (lower.includes("coral") || lower.includes("orange")) return { bg: "#EA580C", border: "#C2410C" };
  if (lower.includes("blush") || lower.includes("pink")) return { bg: "#F472B6", border: "#DB2777" };
  if (lower.includes("blue") || lower.includes("wildflower")) return { bg: "#38BDF8", border: "#0284C7" };
  if (lower.includes("cream") || lower.includes("paper") || lower.includes("ivory")) return { bg: "#F7F2EA", border: "#E2D9CC" };
  if (lower.includes("acrylic") || lower.includes("clear")) {
    return {
      bg: "linear-gradient(135deg, rgba(220, 240, 255, 0.95), rgba(185, 220, 245, 0.75))",
      border: "#90CDF4",
    };
  }
  if (lower.includes("brass")) {
    return {
      bg: "linear-gradient(135deg, #F3DE8A, #B8860B)",
      border: "#996515",
    };
  }
  return { bg: "#4A5D4E", border: "#2E3B31" };
}

interface FlowerEditionDetailViewProps {
  edition: FlowerEditionContent;
}

export const FlowerEditionDetailView: React.FC<FlowerEditionDetailViewProps> = ({
  edition,
}) => {
  return (
    <div className="space-y-12">
      {/* The Botanical Palette Bar */}
      <section className="p-6 rounded-3xl bg-secondary/40 border border-primary/20 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <Palette className="w-4 h-4" />
          <span>The Botanical Palette</span>
        </div>
        <div className="flex flex-wrap gap-2.5 pt-1">
          {edition.palette.map((item, idx) => {
            const swatch = getBotanicalColor(item);
            return (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-border/80 text-xs font-medium text-foreground shadow-sm hover:border-primary/40 transition-colors"
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0"
                  style={{
                    background: swatch.bg,
                    border: swatch.border ? `1px solid ${swatch.border}` : "1px solid rgba(0,0,0,0.15)",
                    boxShadow: swatch.shadow || "0 1px 2px rgba(0,0,0,0.08)",
                  }}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </span>
            );
          })}
        </div>
      </section>

      {/* Before You Begin Box */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
            i
          </span>
          <h2 className="font-serif text-2xl font-bold text-foreground">
            {edition.beforeYouBegin.title}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          A calm setup makes the pressing process easier to control. Gather everything before your flowers touch the blotting paper.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {edition.beforeYouBegin.points.map((pt, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-border bg-card space-y-1.5 shadow-sm"
            >
              <span className="text-[11px] font-bold text-primary tracking-wider uppercase">
                {pt.label}
              </span>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {pt.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Step-by-Step Flow */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Field-to-Keepsake Method
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1">
            Step-by-Step Botanical Pressing
          </h2>
        </div>

        <div className="space-y-6">
          {edition.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl border border-border bg-card hover:border-primary/40 transition-all duration-300 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                    {step.stepNumber}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {step.label}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  How To:
                </span>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                  {step.howTo}
                </p>
              </div>

              {step.craftNote && (
                <div className="p-3.5 rounded-xl bg-secondary/60 border border-primary/20 flex items-start gap-2.5 text-xs text-muted-foreground">
                  <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground">Hwabelle Craft Note: </strong>
                    <span>{step.craftNote}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Finish and Protect */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Archival Longevity
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1">
            Finish and Protect Your Pressed Flowers
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Pressed flowers are thin and delicate. Give them a stable home once they leave the press.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {edition.finishAndProtect.rules.map((rule, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-border bg-card space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <h4 className="font-serif text-sm font-semibold text-foreground">
                  {rule.title}
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                {rule.text}
              </p>
            </div>
          ))}
        </div>

        {/* Craft Project Suggestions */}
        <div className="p-6 rounded-2xl bg-secondary/40 border border-border mt-4">
          <h4 className="font-serif text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Recommended Craft Projects:
          </h4>
          <div className="flex flex-wrap gap-2">
            {edition.finishAndProtect.craftSuggestions.map((craft, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs text-foreground font-medium"
              >
                ✨ {craft}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Deep-Dive Article SEO Link Box */}
      <section className="p-6 sm:p-8 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <BookOpen className="w-3.5 h-3.5" />
            In-Depth Botanical Guide
          </span>
          <h3 className="font-serif text-xl font-bold text-foreground">
            Want Detailed Moisture Science & FAQ?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore our comprehensive botanical article with color preservation chemistry, troubleshooting, and framing tutorials.
          </p>
        </div>

        <Link
          to={`/blog/${edition.blogSlug}`}
          className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
        >
          <FileText className="w-4 h-4" />
          <span>Read Full Article</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};
