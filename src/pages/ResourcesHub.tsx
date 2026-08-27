import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ALL_RESOURCES } from "@/data/resourceRegistry";
import ResourceGrid from "@/components/resources/ResourceGrid";
import QuickStartSteps from "@/components/resources/QuickStartSteps";
import { quickStartGuideContent } from "@/content/resources/quick-start-guide";
import { FreeResourceOffer } from "@/components/resources/FreeResourceOffer";
import { Sparkles, BookOpen, ArrowRight, Layers, ShieldCheck, Heart } from "lucide-react";
import { trackResourceProductClick } from "@/lib/resources/analytics";

const ResourcesHub: React.FC = () => {
  const [modalResourceId, setModalResourceId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenOffer = (resourceId: string) => {
    setModalResourceId(resourceId);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Editorial Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-border/50">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Hwabelle Botanical Learning Studio
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl mx-auto mb-6 leading-tight">
          The Art & Science of Flower Pressing
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
          Free authoritative field guides, species drying matrices, and step-by-step techniques to help you preserve wedding bouquets and garden blooms for decades.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary" />
            100% Free Educational Library
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-primary" />
            Authoritative Botanical Field Science
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-primary" />
            Designed for Beginners & Artists
          </span>
        </div>
      </section>

      {/* Main Educational Guides Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Curated Masterclasses
            </span>
            <h2 className="font-serif text-3xl font-bold text-foreground mt-1">
              Core Botanical Guides
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Click &ldquo;Read Online&rdquo; for instant access, or &ldquo;Get Free Guide&rdquo; to receive downloadable PDF versions.
          </p>
        </div>

        <ResourceGrid
          resources={ALL_RESOURCES}
          onOpenOffer={handleOpenOffer}
        />
      </section>

      {/* 4-Step Picture-Book Quick Start Framework */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border/50">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Visual Framework
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-1 mb-3">
            Press Flowers in 4 Simple Steps
          </h2>
          <p className="text-sm text-muted-foreground">
            The fundamental four-stage workflow that guarantees vibrant, mold-free results every time.
          </p>
        </div>

        <QuickStartSteps steps={quickStartGuideContent.steps} />
      </section>

      {/* Product Cross-Sell Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-primary/15 via-secondary/70 to-card border border-primary/25 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Layers className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-3xl font-bold text-foreground mb-3">
            The Hwabelle Acrylic Flower Press Kit
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Engineered with 360-degree crystal-clear acrylic plates, corner brass bolts for uniform flat torque, and high-absorption blotting layers. Never guess what is happening inside your press again.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/product/flower-press-kit"
              onClick={() =>
                trackResourceProductClick({
                  resource_id: "resource_hub",
                  product_path: "/product/flower-press-kit",
                  source_page: "/resources",
                })
              }
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
            >
              <span>Shop the Flower Press Kit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              <span>Browse the Flower Pressing Blog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Programmatic Modal Offer */}
      <FreeResourceOffer
        forcedResourceId={modalResourceId}
        forceOpen={isModalOpen}
        onCloseForced={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ResourcesHub;
