import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Printer,
  Clock,
  Layers,
  Heart,
  AlertCircle,
  Download,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getAttribution } from "@/lib/resources/attribution";
import { setResourceClaimed } from "@/lib/resources/suppression";
import {
  trackResourceFormStart,
  trackResourceClaimed,
  trackResourceProductClick,
} from "@/lib/resources/analytics";
import { flowerPressingGuideContent } from "@/content/resources/flower-pressing-guide";

const FreeGuideLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasStartedForm, setHasStartedForm] = useState(false);

  const handleFormFocus = () => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      trackResourceFormStart({
        resource_id: "flower-pressing-guide",
        page_path: "/free-flower-pressing-guide",
        source_type: "landing_page",
        resource_position: "landing_page",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (honeypot.trim().length > 0) {
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const attribution = getAttribution();

    try {
      await supabase.functions.invoke("resource-lead-submit", {
        body: {
          email: email.trim().toLowerCase(),
          first_name: firstName.trim() || undefined,
          resource_id: "flower-pressing-guide",
          source_page: "/free-flower-pressing-guide",
          source_type: "landing_page",
          offer_trigger: "landing_page",
          resource_position: "landing_page",
          marketing_consent: marketingConsent,
          ...attribution,
        },
      });

      setResourceClaimed("flower-pressing-guide");
      setIsSuccess(true);

      trackResourceClaimed({
        resource_id: "flower-pressing-guide",
        page_path: "/free-flower-pressing-guide",
        source_type: "landing_page",
        offer_trigger: "landing_page",
        resource_position: "landing_page",
      });
    } catch (err) {
      console.warn("[Landing Page] Submission fallback:", err);
      setResourceClaimed("flower-pressing-guide");
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Editorial Header Hero */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & Proof */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Free Masterclass Guide
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
              The Beginner&apos;s Master Guide to Flower Pressing
            </h1>

            <p className="font-serif text-xl sm:text-2xl text-primary font-medium italic">
              How to Preserve Wedding Bouquets, Garden Blooms, and Sentimental Keepsakes in Crystal-Clear Acrylic
            </p>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Never lose another sentimental flower to mold or brown discoloration. Learn the exact botanical moisture science, 5-layer press assembly, species drying timelines, and framing techniques.
            </p>

            {/* Learning Outcomes Checklist */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">
                What You&apos;ll Learn Inside:
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Why Flowers Brown:</strong> The chemistry of enzymatic oxidation and how to prevent it.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>The 48-Hour Blotter Swap Rule:</strong> The essential technique for thick wedding roses and ranunculus.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Complete Species Drying Matrix:</strong> Exact timelines for 15+ popular flowers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>Archival Framing & Display:</strong> Double-pane UV glass mounting and resin encapsulation tips.</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border/50">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                8 Min Read
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                100% Free Botanical Guide
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-primary" />
                Print-Ready PDF
              </span>
            </div>
          </div>

          {/* Right Column: High-Converting Acquisition Card */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-primary/20 bg-card p-8 sm:p-10 shadow-xl relative overflow-hidden">
              {!isSuccess ? (
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                      Instant Access
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                      Get Your Free Guide Now 🌸
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Enter your email to unlock instant online reading and receive your downloadable PDF copy.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Honeypot field */}
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        name="hwabelle_hp"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="landing-email"
                        className="block text-xs font-medium text-foreground mb-1.5"
                      >
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        id="landing-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={handleFormFocus}
                        className="h-12 rounded-xl bg-background text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="landing-name"
                        className="block text-xs font-medium text-foreground mb-1.5"
                      >
                        First Name <span className="text-muted-foreground text-[10px]">(Optional)</span>
                      </label>
                      <Input
                        id="landing-name"
                        type="text"
                        placeholder="Your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onFocus={handleFormFocus}
                        maxLength={60}
                        className="h-12 rounded-xl bg-background text-sm"
                      />
                    </div>

                    <div className="flex items-start space-x-2.5 pt-1">
                      <Checkbox
                        id="landing-consent"
                        checked={marketingConsent}
                        onCheckedChange={(checked) => setMarketingConsent(checked === true)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor="landing-consent"
                        className="text-[11px] text-muted-foreground leading-tight cursor-pointer"
                      >
                        Send me weekly flower pressing tips, seasonal botanical foraging guides, and new botanical studio updates.
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-md mt-2"
                    >
                      {isSubmitting ? "Preparing Your Guide..." : "Send Me the Free Guide"}
                      {!isSubmitting && <ArrowRight className="w-4 h-4 ml-1.5" />}
                    </Button>

                    <p className="text-[10px] text-center text-muted-foreground">
                      We respect your privacy. No spam. Unsubscribe anytime.
                    </p>
                  </form>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-foreground">
                      Your Guide is Ready! 🌸
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      We&apos;ve unlocked your guide below and sent a confirmation link to{" "}
                      <span className="font-medium text-foreground">{email}</span>.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <a
                      href="/guides/hwabelle-flower-pressing-master-guide.pdf"
                      download="Hwabelle-Flower-Pressing-Master-Guide.pdf"
                      className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF Guide (Direct File)</span>
                    </a>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/resources/flower-pressing-guide")}
                      className="w-full h-11 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-secondary flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Online Now</span>
                    </Button>
                  </div>

                  <div className="pt-6 border-t border-border/60">
                    <p className="text-xs text-muted-foreground mb-2">
                      Ready to start your botanical preservation project?
                    </p>
                    <Link
                      to="/product/flower-press-kit"
                      onClick={() =>
                        trackResourceProductClick({
                          resource_id: "flower-pressing-guide",
                          product_path: "/product/flower-press-kit",
                          source_page: "/free-flower-pressing-guide",
                        })
                      }
                      className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore the Hwabelle Acrylic Flower Press Kit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Guide Preview & Drying Schedule Snippet */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-border/50">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Sneak Peek
          </span>
          <h2 className="font-serif text-3xl font-bold text-foreground mt-1 mb-3">
            Botanical Drying Timelines Preview
          </h2>
          <p className="text-sm text-muted-foreground">
            A small sample of the drying schedule matrix included in the full master guide.
          </p>
        </div>

        <div className="overflow-x-auto border border-border/60 rounded-2xl bg-card shadow-sm mb-12">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-secondary/60 border-b border-border/60 text-muted-foreground font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Flower Variety</th>
                <th className="px-4 py-3.5">Moisture Level</th>
                <th className="px-4 py-3.5">Pressing Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {flowerPressingGuideContent.dryingSchedule?.slice(0, 4).map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-secondary/20"}>
                  <td className="px-5 py-3 font-medium text-foreground">{item.variety}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.moistureLevel}</td>
                  <td className="px-4 py-3 text-primary font-medium">{item.pressingTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Product Callout Banner */}
        <div className="rounded-3xl bg-secondary/40 border border-primary/20 p-8 text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl font-bold text-foreground">
            The Hwabelle Acrylic Flower Press Kit
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Includes dual 10&quot;x10&quot; and 3&quot;x3&quot; clear acrylic plates, solid brass corner bolts, 250gsm blotting sheets, and compression sponge pads.
          </p>
          <div className="pt-2">
            <Link
              to="/product/flower-press-kit"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>View Product Details & Specifications →</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FreeGuideLandingPage;
