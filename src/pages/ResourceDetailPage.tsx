import React, { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getResourceById } from "@/data/resourceRegistry";
import { flowerPressingGuideContent } from "@/content/resources/flower-pressing-guide";
import { flowerSelectionGuideContent } from "@/content/resources/flower-selection-guide";
import { quickStartGuideContent } from "@/content/resources/quick-start-guide";
import DryingSchedule from "@/components/resources/DryingSchedule";
import FlowerSuitabilityMatrix from "@/components/resources/FlowerSuitabilityMatrix";
import QuickStartSteps from "@/components/resources/QuickStartSteps";
import ResourceCTA from "@/components/resources/ResourceCTA";
import { FreeResourceOffer } from "@/components/resources/FreeResourceOffer";
import {
  Printer,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Mail,
  Download,
} from "lucide-react";
import { trackResourceDownload, trackResourceProductClick } from "@/lib/resources/analytics";

const ResourceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resourceMeta = slug ? getResourceById(slug) : undefined;

  // Auto-trigger print if ?print=true is present
  useEffect(() => {
    if (searchParams.get("print") === "true") {
      setTimeout(() => {
        window.print();
      }, 600);
    }
  }, [searchParams]);

  if (!resourceMeta) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-3">
          Guide Not Found
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          The requested educational resource does not exist or has been moved.
        </p>
        <Link
          to="/resources"
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
        >
          Back to Resource Library
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    trackResourceDownload({
      resource_id: resourceMeta.id,
      page_path: window.location.pathname,
    });
    window.print();
  };

  return (
    <article className="min-h-screen bg-background text-foreground pb-20">
      {/* Print Button Header Bar (Screen only) */}
      <div className="no-print border-b border-border/50 bg-secondary/30 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between text-xs">
          <Link
            to="/resources"
            className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-1"
          >
            ← Resource Hub
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={resourceMeta.pdfUrl}
              download={resourceMeta.pdfFileName}
              onClick={() =>
                trackResourceDownload({
                  resource_id: resourceMeta.id,
                  page_path: window.location.pathname,
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </a>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground font-medium hover:bg-secondary transition-colors text-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email to Me</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-foreground font-medium hover:bg-secondary transition-colors text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guide Header Banner */}
      <header className="pt-12 pb-10 px-4 sm:px-6 max-w-4xl mx-auto border-b border-border/50">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {resourceMeta.badge}
          </span>
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {resourceMeta.readTime}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
            {resourceMeta.skillLevel}
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
          {resourceMeta.title}
        </h1>

        <p className="font-serif text-lg sm:text-xl text-primary font-medium italic mb-6">
          {resourceMeta.subtitle}
        </p>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          {resourceMeta.description}
        </p>

        {/* Key Takeaways Box */}
        <div className="p-6 rounded-2xl bg-secondary/40 border border-border/70 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Core Botanical Principles
          </h3>
          <ul className="text-xs sm:text-sm text-muted-foreground space-y-1.5">
            {resourceMeta.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Guide Body Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Render Guide Specific Sections */}
        {resourceMeta.id === "flower-pressing-guide" && (
          <div className="space-y-10">
            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                1. The Science of Botanical Preservation: Why Flowers Brown
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                To press flowers successfully, you must understand what happens inside plant tissue when it is flattened:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h4 className="font-serif text-base font-semibold text-foreground mb-1">
                    The Enemy is Moisture
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Fresh flowers are composed of 80% to 95% water. Crushed tissue without fast evacuation triggers enzymatic oxidation (the apple-browning reaction).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card">
                  <h4 className="font-serif text-base font-semibold text-foreground mb-1">
                    Even Flat Pressure
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Uneven pressure causes curling. Corner brass bolts provide symmetrical 360-degree flat torque across every petal.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card">
                  <h4 className="font-serif text-base font-semibold text-foreground mb-1">
                    Light & Heat Factors
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Direct sunlight bleaches delicate anthocyanin pigments. Always cure your press in a cool, dark, dry closet.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                2. The 5-Layer &ldquo;Drying Sandwich&rdquo; Assembly
              </h2>
              <p className="text-sm text-muted-foreground">
                The secret to mold-free botanicals is the 5-layer absorption stack:
              </p>

              <div className="p-5 rounded-2xl bg-secondary/60 border border-primary/20 font-mono text-xs text-foreground space-y-1 overflow-x-auto">
                <div className="font-bold text-primary">[ Top Acrylic Press Plate (Crystal Clear) ]</div>
                <div className="pl-4">├── [ Cardstock Dry Board (Rigid Support) ]</div>
                <div className="pl-4">├── [ Sponge Paper Layer (Cushions Petal Curves) ]</div>
                <div className="pl-4">├── [ Blotting Paper Sheet (High-Absorption Moisture Wick) ]</div>
                <div className="pl-8 text-primary font-bold">🌸 [ YOUR ARRANGE FLOWER SPECIMENS (0.5&quot; Spacing) ] 🌸</div>
                <div className="pl-4">├── [ Blotting Paper Sheet ]</div>
                <div className="pl-4">├── [ Sponge Paper Layer ]</div>
                <div className="pl-4">├── [ Cardstock Dry Board ]</div>
                <div className="font-bold text-primary">[ Bottom Acrylic Press Plate ]</div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                3. Drying Schedule & Timeline Matrix
              </h2>
              <p className="text-sm text-muted-foreground">
                Reference this botanical matrix to plan pressing durations and blotter paper swaps based on species moisture density:
              </p>

              {flowerPressingGuideContent.dryingSchedule && (
                <DryingSchedule schedule={flowerPressingGuideContent.dryingSchedule} />
              )}

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs leading-relaxed">
                <strong>The 48-Hour Blotter Swap Rule:</strong> For thick blooms (roses, ranunculus, lilies), open your press after 48 hours and replace damp blotting sheets with fresh dry paper. This single step locks in vivid colors.
              </div>
            </section>

            <ResourceCTA type="inline" articleSlug="flower-pressing-guide" />

            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                4. Troubleshooting Common Pressing Issues
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flowerPressingGuideContent.troubleshooting?.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-border bg-card space-y-2">
                    <h4 className="font-serif text-base font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      {item.issue}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      <strong>Root Cause:</strong> {item.rootCause}
                    </p>
                    <p className="text-xs text-foreground bg-secondary/50 p-2.5 rounded-lg">
                      <strong>Solution:</strong> {item.solution}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {resourceMeta.id === "flower-selection-guide" && (
          <div className="space-y-10">
            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                1. The 4 Golden Rules of Harvesting
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card">
                  <span className="text-xs font-bold text-primary uppercase">Rule 1</span>
                  <h4 className="font-serif text-base font-semibold text-foreground mt-1 mb-1">
                    Morning Sun Window (10:00 – 11:30 AM)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Harvest after morning dew evaporates, but before midday heat causes petal wilting.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card">
                  <span className="text-xs font-bold text-primary uppercase">Rule 2</span>
                  <h4 className="font-serif text-base font-semibold text-foreground mt-1 mb-1">
                    Peak Bloom Only (80%–100%)
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Avoid flowers with browning edges, insect damage, or heavy pollen shed.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card">
                  <span className="text-xs font-bold text-primary uppercase">Rule 3</span>
                  <h4 className="font-serif text-base font-semibold text-foreground mt-1 mb-1">
                    Immediate Pressing
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Cell walls lose turgor within 30 minutes of cutting. Keep stems in cool water until pressing.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card">
                  <span className="text-xs font-bold text-primary uppercase">Rule 4</span>
                  <h4 className="font-serif text-base font-semibold text-foreground mt-1 mb-1">
                    Clean 45-Degree Cuts
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Use sterile floral snips to cut stems without crushing vascular tissue.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                2. Flower Suitability Tiers
              </h2>
              <p className="text-sm text-muted-foreground">
                Categorize your garden and bouquet florals by moisture and petal density:
              </p>

              <FlowerSuitabilityMatrix tiers={flowerSelectionGuideContent.suitabilityTiers} />
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                3. The 3D Flower Dissection Technique
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-primary/20 bg-secondary/30 space-y-3">
                  <h4 className="font-serif text-lg font-semibold text-foreground">
                    Method A: Petal Deconstruction
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Pluck petals from outer guard petals inward. Group by size, press individually with 0.5&quot; spacing, and reconstruct the spiral flat on cardstock after 14 days of curing.
                  </p>
                </div>

                <div className="p-6 rounded-2xl border border-primary/20 bg-secondary/30 space-y-3">
                  <h4 className="font-serif text-lg font-semibold text-foreground">
                    Method B: Calyx Halving (Profile Slice)
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Slice vertically straight through the stem, calyx, and petal core with a scalpel. Scoop out the seed chamber with tweezers, and press both halves flat cut-side down.
                  </p>
                </div>
              </div>
            </section>

            <ResourceCTA type="inline" articleSlug="flower-selection-guide" />
          </div>
        )}

        {resourceMeta.id === "quick-start-guide" && (
          <div className="space-y-10">
            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                The 4-Step Picture-Book Workflow
              </h2>
              <p className="text-sm text-muted-foreground">
                Follow these four sequential phases to press flowers with professional results:
              </p>

              <QuickStartSteps steps={quickStartGuideContent.steps} />
            </section>

            <section className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Hwabelle Press Kit Anatomy & Specifications
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickStartGuideContent.kitAnatomy.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-border bg-card space-y-2">
                    <span className="text-[11px] font-bold text-primary uppercase">
                      {item.spec}
                    </span>
                    <h4 className="font-serif text-base font-semibold text-foreground">
                      {item.name}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.function}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Product Conversion CTA at bottom of every guide */}
        <section className="pt-8 border-t border-border/60">
          <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/70 to-card border border-primary/20 p-8 sm:p-10 text-center space-y-4">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {resourceMeta.productCTA.title}
            </h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              {resourceMeta.productCTA.description}
            </p>
            <div className="pt-2">
              <Link
                to={resourceMeta.productCTA.path}
                onClick={() =>
                  trackResourceProductClick({
                    resource_id: resourceMeta.id,
                    product_path: resourceMeta.productCTA.path,
                    source_page: `/resources/${resourceMeta.slug}`,
                  })
                }
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
              >
                <span>{resourceMeta.productCTA.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Modal Offer */}
      <FreeResourceOffer
        forcedResourceId={resourceMeta.id}
        forceOpen={isModalOpen}
        onCloseForced={() => setIsModalOpen(false)}
      />
    </article>
  );
};

export default ResourceDetailPage;
