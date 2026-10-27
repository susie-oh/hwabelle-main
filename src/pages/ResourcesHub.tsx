import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { ALL_RESOURCES } from "@/data/resourceRegistry";
import ResourceGrid from "@/components/resources/ResourceGrid";
import QuickStartSteps from "@/components/resources/QuickStartSteps";
import { quickStartGuideContent } from "@/content/resources/quick-start-guide";
import { FreeResourceOffer } from "@/components/resources/FreeResourceOffer";
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
  ShieldCheck,
  Heart,
  Flower2,
  FileCheck2,
} from "lucide-react";
import { trackResourceProductClick } from "@/lib/resources/analytics";
import { defaultKeywords } from "@/lib/site";

type CategoryFilter = "all" | "species" | "masterclasses";

const ResourcesHub: React.FC = () => {
  const [modalResourceId, setModalResourceId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const handleOpenOffer = (resourceId: string) => {
    setModalResourceId(resourceId);
    setIsModalOpen(true);
  };

  const filteredResources = ALL_RESOURCES.filter((res) => {
    if (activeCategory === "species") return res.category === "Species Guide";
    if (activeCategory === "masterclasses") return res.category === "Masterclass";
    return true;
  });

  const speciesCount = ALL_RESOURCES.filter((r) => r.category === "Species Guide").length;
  const masterclassCount = ALL_RESOURCES.filter((r) => r.category === "Masterclass").length;

  return (
    <Layout>
      <Seo
        title="Botanical Resource Hub | Free Flower Pressing Guides & PDFs | Hwabelle"
        description="Free downloadable flower pressing field guides and masterclasses from Hwabelle. Species guides for roses, eucalyptus, daisies, violets, ferns, tulips, pansies, cosmos, lavender, and calla lilies."
        path="/resources"
        keywords={[
          ...defaultKeywords,
          "free flower pressing guide pdf",
          "how to press roses and eucalyptus",
          "how to press daisies",
          "how to press calla lilies",
          "how to press lavender",
          "flower drying schedule pdf",
        ]}
      />

      <div className="min-h-screen bg-background text-foreground">
        {/* Editorial Hero Section */}
        <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-border/50">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Hwabelle
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl mx-auto mb-6 leading-tight">
            The Art & Science of Flower Pressing
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Authoritative species field guides, printable PDF manuals, drying matrices, and step-by-step techniques to preserve garden blooms and wedding bouquets for decades.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-primary" />
              100% Free Educational Library
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-primary" />
              Printable Botanical Field Guides (PDFs)
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-primary" />
              Designed for Beginners & Artists
            </span>
          </div>
        </section>

        {/* Main Educational Guides Grid with Filter Tabs */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Curated Educational Library
              </span>
              <h2 className="font-serif text-3xl font-bold text-foreground mt-1">
                Botanical Guides & Field Manuals
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-secondary/50 p-1 rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeCategory === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Guides ({ALL_RESOURCES.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory("species")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeCategory === "species"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Species Editions ({speciesCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveCategory("masterclasses")}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeCategory === "masterclasses"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Core Masterclasses ({masterclassCount})
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mb-6">
            Click &ldquo;Read Online&rdquo; for immediate step-by-step guidance, or &ldquo;Get Free Guide&rdquo; to download the official printable PDF edition.
          </p>

          <ResourceGrid
            resources={filteredResources}
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
    </Layout>
  );
};

export default ResourcesHub;
