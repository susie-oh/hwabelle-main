import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, CheckCircle2, ArrowRight, Printer, BookOpen, AlertCircle, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getAttribution } from "@/lib/resources/attribution";
import {
  isPathExcludedFromOffer,
  isOfferDismissed,
  setOfferDismissed,
  isResourceClaimed,
  setResourceClaimed,
} from "@/lib/resources/suppression";
import {
  trackResourcePopupView,
  trackResourcePopupDismiss,
  trackResourceFormStart,
  trackResourceClaimed,
  OfferTrigger,
} from "@/lib/resources/analytics";
import { getResourceById } from "@/data/resourceRegistry";

interface FreeResourceOfferProps {
  forcedResourceId?: string;
  forceOpen?: boolean;
  onCloseForced?: () => void;
}

export const FreeResourceOffer: React.FC<FreeResourceOfferProps> = ({
  forcedResourceId,
  forceOpen = false,
  onCloseForced,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeResourceId, setActiveResourceId] = useState<string>("flower-pressing-guide");
  const [triggerType, setTriggerType] = useState<OfferTrigger>("timer");

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasStartedForm, setHasStartedForm] = useState(false);

  const resourceMeta = getResourceById(activeResourceId) || getResourceById("flower-pressing-guide");

  // Open modal handler
  const openModal = useCallback((resId: string, trigger: OfferTrigger) => {
    setActiveResourceId(resId);
    setTriggerType(trigger);
    setIsSuccess(false);
    setErrorMessage(null);
    setIsOpen(true);

    trackResourcePopupView({
      resource_id: resId,
      page_path: window.location.pathname,
      source_type: "popup",
      offer_trigger: trigger,
    });
  }, []);

  // Handle programmatic trigger (e.g. clicking "Get Free Guide" on a card)
  useEffect(() => {
    if (forceOpen && forcedResourceId) {
      openModal(forcedResourceId, "inline_cta");
    }
  }, [forceOpen, forcedResourceId, openModal]);

  // Automated Scroll & Timer Triggers
  useEffect(() => {
    if (forceOpen) return;

    const currentPath = location.pathname;
    if (isPathExcludedFromOffer(currentPath)) return;
    if (isOfferDismissed()) return;
    if (isResourceClaimed("flower-pressing-guide")) return;
    if (currentPath.includes("flower-pressing-guide")) return;

    let timerFired = false;
    let scrollFired = false;

    // Timer trigger: 30 seconds
    const timerId = setTimeout(() => {
      if (!timerFired && !scrollFired && !isOfferDismissed() && !isOpen) {
        timerFired = true;
        openModal("flower-pressing-guide", "timer");
      }
    }, 30000);

    // Scroll trigger: 45% depth
    const handleScroll = () => {
      if (timerFired || scrollFired || isOfferDismissed() || isOpen) return;

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const scrollPercent = (scrollTop / docHeight) * 100;
      if (scrollPercent >= 45) {
        scrollFired = true;
        openModal("flower-pressing-guide", "scroll");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timerId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname, isOpen, forceOpen, openModal]);

  const handleDismiss = () => {
    setOfferDismissed();
    setIsOpen(false);
    if (onCloseForced) onCloseForced();

    trackResourcePopupDismiss({
      resource_id: activeResourceId,
      page_path: location.pathname,
      offer_trigger: triggerType,
    });
  };

  const handleFormFocus = () => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      trackResourceFormStart({
        resource_id: activeResourceId,
        page_path: location.pathname,
        source_type: "popup",
        resource_position: "popup",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Honeypot bot protection
    if (honeypot.trim().length > 0) {
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const attribution = getAttribution();

    try {
      const { data, error } = await supabase.functions.invoke("resource-lead-submit", {
        body: {
          email: email.trim().toLowerCase(),
          first_name: firstName.trim() || undefined,
          resource_id: activeResourceId,
          source_page: location.pathname,
          source_type: "popup",
          offer_trigger: triggerType,
          resource_position: "popup",
          marketing_consent: marketingConsent,
          ...attribution,
        },
      });

      if (error) {
        console.warn("[Resource Lead Submit] Edge function notice:", error);
        // Even if Edge Function returns an error, we do not lock the user out of the guide if local validation succeeded
      }

      setResourceClaimed(activeResourceId);
      setIsSuccess(true);

      trackResourceClaimed({
        resource_id: activeResourceId,
        page_path: location.pathname,
        source_type: "popup",
        offer_trigger: triggerType,
        resource_position: "popup",
      });
    } catch (err) {
      console.warn("[Resource Lead Submit] Submission error:", err);
      // Graceful degradation: unlock guide immediately
      setResourceClaimed(activeResourceId);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="max-w-md w-[92vw] p-0 overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-2xl">
        {!isSuccess ? (
          <div className="p-6 sm:p-8">
            <DialogHeader className="text-center sm:text-left space-y-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider w-fit mx-auto sm:mx-0">
                <Sparkles className="w-3.5 h-3.5" />
                Free Botanical Guide
              </div>
              <DialogTitle className="font-serif text-2xl font-semibold text-foreground tracking-tight">
                Your Free Flower Pressing Guide Is Ready 🌸
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Learn which flowers press best, how to prevent browning, drying times, and how to turn your flowers into lasting botanical art.
              </DialogDescription>
            </DialogHeader>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field for bot mitigation */}
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
                  htmlFor="offer-email"
                  className="block text-xs font-medium text-foreground mb-1.5"
                >
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="offer-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleFormFocus}
                  className="h-11 rounded-xl bg-background text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="offer-first-name"
                  className="block text-xs font-medium text-foreground mb-1.5"
                >
                  First Name <span className="text-muted-foreground text-[10px]">(Optional)</span>
                </label>
                <Input
                  id="offer-first-name"
                  type="text"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={handleFormFocus}
                  maxLength={60}
                  className="h-11 rounded-xl bg-background text-sm"
                />
              </div>

              <div className="flex items-start space-x-2.5 pt-1">
                <Checkbox
                  id="offer-consent"
                  checked={marketingConsent}
                  onCheckedChange={(checked) => setMarketingConsent(checked === true)}
                  className="mt-0.5"
                />
                <label
                  htmlFor="offer-consent"
                  className="text-[11px] text-muted-foreground leading-tight cursor-pointer"
                >
                  Keep me updated with botanical pressing tips and exclusive studio releases.
                </label>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-md"
                >
                  {isSubmitting ? "Preparing Your Guide..." : "Send Me the Free Guide"}
                  {!isSubmitting && <ArrowRight className="w-4 h-4 ml-1.5" />}
                </Button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1 transition-colors"
                >
                  No thanks, I&apos;ll keep exploring
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <DialogTitle className="font-serif text-2xl font-semibold text-foreground">
                Your Guide Is Ready! 🌸
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                We&apos;ve unlocked your guide below and sent a copy to{" "}
                <span className="font-medium text-foreground">{email}</span>.
              </DialogDescription>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-left space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Unlocked Masterclass
              </span>
              <h4 className="font-serif text-base font-semibold text-foreground">
                {resourceMeta?.title || "The Beginner's Master Guide to Flower Pressing"}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {resourceMeta?.description}
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <a
                href={resourceMeta?.pdfUrl || "/guides/hwabelle-flower-pressing-master-guide.pdf"}
                download={resourceMeta?.pdfFileName || "Hwabelle-Flower-Pressing-Master-Guide.pdf"}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Guide (Direct File)</span>
              </a>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/resources/${resourceMeta?.slug || "flower-pressing-guide"}`);
                }}
                className="w-full h-10 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-secondary flex items-center justify-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Online Now</span>
              </Button>
            </div>

            <div className="pt-4 border-t border-border/60">
              <p className="text-xs text-muted-foreground mb-2">
                Ready to elevate your botanical preservation?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/product/flower-press-kit");
                }}
                className="text-xs text-primary font-semibold hover:underline p-0 h-auto"
              >
                Explore the Hwabelle Acrylic Flower Press Kit →
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FreeResourceOffer;
