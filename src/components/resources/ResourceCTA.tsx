import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Download, FileText } from "lucide-react";
import { trackBlogResourceClick } from "@/lib/resources/analytics";
import { getFlowerEdition } from "@/content/resources/flower-edition-registry";

interface ResourceCTAProps {
  type?: "inline" | "footer";
  articleSlug?: string;
}

const ResourceCTA: React.FC<ResourceCTAProps> = ({
  type = "inline",
  articleSlug = "",
}) => {
  const flowerEdition = getFlowerEdition(articleSlug);

  if (type === "inline") {
    if (flowerEdition) {
      return (
        <div className="my-8 p-6 rounded-2xl bg-secondary/50 border border-primary/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Free Printable PDF Field Guide
            </div>
            <h4 className="font-serif text-lg font-semibold text-foreground">
              Download the {flowerEdition.title} Field Manual
            </h4>
            <p className="text-xs text-muted-foreground">
              Official Hwabelle {flowerEdition.editionBadge} with full step-by-step layout schematics and archival preservation notes.
            </p>
          </div>

          <Link
            to={`/resources/${flowerEdition.slug}`}
            onClick={() =>
              trackBlogResourceClick({
                resource_id: flowerEdition.id,
                article_slug: articleSlug,
                link_type: "inline",
              })
            }
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Free PDF Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      );
    }

    return (
      <div className="my-8 p-6 rounded-2xl bg-secondary/50 border border-primary/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Free Botanical Guide
          </div>
          <h4 className="font-serif text-lg font-semibold text-foreground">
            Want the full flower pressing system?
          </h4>
          <p className="text-xs text-muted-foreground">
            Get Hwabelle&apos;s free Beginner&apos;s Guide to Flower Pressing with drying schedules and troubleshooting tips.
          </p>
        </div>

        <Link
          to="/free-flower-pressing-guide"
          onClick={() =>
            trackBlogResourceClick({
              resource_id: "flower-pressing-guide",
              article_slug: articleSlug,
              link_type: "inline",
            })
          }
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span>Get the Free Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Footer CTA
  if (flowerEdition) {
    return (
      <div className="my-12 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/60 to-background border border-primary/20 shadow-sm text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
          <Download className="w-3.5 h-3.5" />
          {flowerEdition.editionBadge}
        </div>

        <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
          {flowerEdition.title}: Printable Field Guide
        </h3>

        <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
          {flowerEdition.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/resources/${flowerEdition.slug}`}
            onClick={() =>
              trackBlogResourceClick({
                resource_id: flowerEdition.id,
                article_slug: articleSlug,
                link_type: "footer",
              })
            }
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Download Printable PDF Guide</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/resources"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors"
          >
            <span>All Botanical Guides</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/60 to-background border border-primary/20 shadow-sm text-center max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
        <Download className="w-3.5 h-3.5" />
        Free Botanical Masterclass Guide
      </div>

      <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
        The Beginner&apos;s Master Guide to Flower Pressing
      </h3>

      <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
        Learn which flowers press best, how to avoid browning, exact species drying times, and how to preserve sentimental wedding blooms for decades.
      </p>

      <Link
        to="/free-flower-pressing-guide"
        onClick={() =>
          trackBlogResourceClick({
            resource_id: "flower-pressing-guide",
            article_slug: articleSlug,
            link_type: "footer",
          })
        }
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
      >
        <span>Send Me the Free Guide</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default ResourceCTA;
