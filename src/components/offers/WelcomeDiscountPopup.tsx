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
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Download,
  BookOpen,
  Tag,
  Gift,
  AlertCircle,
  X,
  Flower2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { getAttribution } from "@/lib/resources/attribution";

const POPUP_DISMISS_KEY = "hwabelle_welcome_offer_dismissed_until";
const POPUP_CLAIMED_KEY = "hwabelle_welcome_offer_claimed";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const DISCOUNT_CODE = "WELCOME10";

export const WelcomeDiscountPopup: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { applyDiscountCode } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const [isClaimed, setIsClaimed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(POPUP_CLAIMED_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [honeypot, setHoneypot] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Check if current route should suppress popup
  const isExcludedRoute = useCallback((path: string) => {
    const excludedPrefixes = [
      "/admin",
      "/designer-chat",
      "/account",
      "/order-confirmation",
      "/unlock",
    ];
    return excludedPrefixes.some((prefix) => path.startsWith(prefix));
  }, []);

  // Check if dismissed within cooldown window
  const isDismissed = useCallback(() => {
    try {
      const rawUntil = localStorage.getItem(POPUP_DISMISS_KEY);
      if (!rawUntil) return false;
      const dismissedUntil = parseInt(rawUntil, 10);
      if (isNaN(dismissedUntil)) return false;
      return Date.now() < dismissedUntil;
    } catch {
      return false;
    }
  }, []);

  // Automated entrance timer, query param override (?offer=1 / ?popup=1), & exit intent
  useEffect(() => {
    const currentPath = location.pathname;
    if (isExcludedRoute(currentPath)) return;

    // Direct test override via URL query param: ?offer=1 or ?popup=1
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("offer") === "1" || searchParams.get("popup") === "1") {
      setIsOpen(true);
      return;
    }

    if (isClaimed) return;
    if (isDismissed()) return;

    let timerFired = false;

    // Trigger after 2.5 seconds on fresh visit
    const timerId = setTimeout(() => {
      if (!timerFired && !isDismissed() && !isOpen) {
        timerFired = true;
        setIsOpen(true);
      }
    }, 2500);

    // Desktop Exit Intent trigger (mouse leaving viewport at top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !timerFired && !isDismissed() && !isOpen) {
        timerFired = true;
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [location.pathname, location.search, isClaimed, isDismissed, isOpen, isExcludedRoute]);

  const handleDismiss = () => {
    try {
      const expireAt = Date.now() + SEVEN_DAYS_MS;
      localStorage.setItem(POPUP_DISMISS_KEY, expireAt.toString());
    } catch {
      // LocalStorage unavailable
    }
    setIsOpen(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(DISCOUNT_CODE);
    setCopied(true);
    applyDiscountCode(DISCOUNT_CODE);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Bot trap
    if (honeypot.trim().length > 0) {
      setIsSuccess(true);
      setIsClaimed(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // 1. Immediately apply discount and persist claimed state
    try {
      localStorage.setItem(POPUP_CLAIMED_KEY, "true");
    } catch {
      // LocalStorage unavailable
    }
    setIsClaimed(true);
    applyDiscountCode(DISCOUNT_CODE);

    const attribution = getAttribution();

    // 2. Dispatch backend subscriptions concurrently with a safe 1.5s timeout cap
    try {
      const subscribePromise = supabase.functions.invoke("subscribe-newsletter", {
        body: {
          email: cleanEmail,
          first_name: firstName.trim() || undefined,
          discount_code: DISCOUNT_CODE,
          source: "welcome_popup_10off",
          marketing_consent: marketingConsent,
          ...attribution,
        },
      }).catch((err) => console.warn("[Welcome Offer Submit] Edge function note:", err));

      const leadPromise = supabase.functions.invoke("resource-lead-submit", {
        body: {
          email: cleanEmail,
          first_name: firstName.trim() || undefined,
          resource_id: "flower-pressing-guide",
          source_page: location.pathname,
          source_type: "welcome_discount_popup",
          marketing_consent: marketingConsent,
          ...attribution,
        },
      }).catch((err) => console.warn("[Resource Lead Submit] Note:", err));

      // Wait max 1.5s for backend handshakes so the visitor is never kept waiting
      await Promise.race([
        Promise.allSettled([subscribePromise, leadPromise]),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);
    } catch (err) {
      console.warn("[Welcome Offer Submit] Fallback:", err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleShopNow = () => {
    applyDiscountCode(DISCOUNT_CODE);
    setIsOpen(false);
    navigate("/product/flower-press-kit");
  };

  return (
    <>
      {/* Floating Re-open Button (Visible on non-excluded routes) */}
      {!isExcludedRoute(location.pathname) && (
        <button
          onClick={() => {
            setIsOpen(true);
            setErrorMessage(null);
          }}
          className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-40 group flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-primary/20 backdrop-blur touch-manipulation"
          aria-label="Claim 10% Off Offer"
        >
          <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse text-amber-300 shrink-0" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide">
            {isClaimed ? "Your 10% Off Code" : "Get 10% Off"}
          </span>
        </button>
      )}

      {/* Main Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleDismiss()}>
        <DialogContent className="max-w-md w-[94vw] sm:w-[92vw] p-0 rounded-2xl sm:rounded-3xl border border-primary/20 bg-card shadow-2xl overflow-hidden max-h-[88dvh] sm:max-h-[90vh] flex flex-col">
          {/* Top Decorative Floral Accent */}
          <div className="relative h-2 sm:h-2.5 bg-gradient-to-r from-amber-200 via-primary to-amber-300 shrink-0" />

          {!isSuccess ? (
            <div className="p-4 sm:p-7 overflow-y-auto overscroll-contain flex-1">
              <DialogHeader className="text-center space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mx-auto">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Exclusive Welcome Value Offer
                </div>
                <DialogTitle className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">
                  Get 10% Off Your First Order 🌸
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-0.5 sm:pt-1">
                  Join the Hwabelle botanical circle. Unlock an instant 10% discount on your flower press kit + receive our free Masterclass Pressing Guide.
                </DialogDescription>
              </DialogHeader>

              {/* Value Bullet Points */}
              <div className="my-3 sm:my-4 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-secondary/60 border border-border/60 space-y-1.5 sm:space-y-2 text-left">
                <div className="flex items-start gap-2 text-xs text-foreground">
                  <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5" />
                  <span><strong>10% Off</strong> coupon code applied instantly to your cart</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-foreground">
                  <Flower2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Free Masterclass Guide:</strong> Secrets to vibrant, mold-free pressed blooms</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-foreground">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Early VIP access to limited botanical frame releases & tips</span>
                </div>
              </div>

              {errorMessage && (
                <div className="mb-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
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
                    htmlFor="popup-email"
                    className="block text-xs font-medium text-foreground mb-1"
                  >
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    id="popup-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl bg-background text-base sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="popup-first-name"
                    className="block text-xs font-medium text-foreground mb-1"
                  >
                    First Name <span className="text-muted-foreground text-[10px]">(Optional)</span>
                  </label>
                  <Input
                    id="popup-first-name"
                    type="text"
                    placeholder="Your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    maxLength={60}
                    className="h-11 rounded-xl bg-background text-base sm:text-sm"
                  />
                </div>

                <div className="flex items-start space-x-2 pt-0.5">
                  <Checkbox
                    id="popup-consent"
                    checked={marketingConsent}
                    onCheckedChange={(checked) => setMarketingConsent(checked === true)}
                    className="mt-0.5 h-4 w-4 shrink-0"
                  />
                  <label
                    htmlFor="popup-consent"
                    className="text-[11px] text-muted-foreground leading-tight cursor-pointer select-none"
                  >
                    Send me my 10% discount code and botanical flower pressing updates.
                  </label>
                </div>

                <div className="pt-2 space-y-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 active:scale-[0.99] transition-all shadow-md flex items-center justify-center gap-1.5 touch-manipulation"
                  >
                    {isSubmitting ? "Unlocking Your 10% Off..." : "Claim 10% Off + Free Guide"}
                    {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                  </Button>

                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="w-full text-center text-xs text-muted-foreground hover:text-foreground py-1.5 transition-colors touch-manipulation"
                  >
                    No thanks, I&apos;ll pay full price
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Success State */
            <div className="p-4 sm:p-7 text-center space-y-3.5 sm:space-y-4 overflow-y-auto overscroll-contain flex-1">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>

              <div className="space-y-1">
                <DialogTitle className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                  You&apos;ve Unlocked 10% Off! 🌸
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-muted-foreground px-2">
                  Your discount code has been applied to your cart session and emailed to{" "}
                  <span className="font-medium text-foreground break-all">{email || "your inbox"}</span>.
                </DialogDescription>
              </div>

              {/* Coupon Code Presentation Box */}
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-amber-950/30 border-2 border-dashed border-amber-300 dark:border-amber-700 text-center space-y-1.5 sm:space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
                  Your 10% Discount Code
                </span>
                <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                  <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-foreground">
                    {DISCOUNT_CODE}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="h-8 px-2.5 text-xs rounded-lg gap-1 border-amber-300 bg-background hover:bg-amber-100 dark:hover:bg-amber-900 active:scale-95 touch-manipulation"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  Valid for 10% off your entire flower press kit order.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Button
                  type="button"
                  variant="hero"
                  size="xl"
                  onClick={handleShopNow}
                  className="w-full text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 h-11 sm:h-12 active:scale-[0.99] touch-manipulation"
                >
                  <span>Shop Flower Press Kit (10% Applied)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="/guides/hwabelle-flower-pressing-master-guide.pdf"
                    download="Hwabelle-Flower-Pressing-Master-Guide.pdf"
                    className="h-10 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-secondary active:bg-secondary/80 flex items-center justify-center gap-1.5 transition-colors touch-manipulation"
                  >
                    <Download className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Download PDF</span>
                  </a>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/resources/flower-pressing-guide");
                    }}
                    className="h-10 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-secondary active:bg-secondary/80 flex items-center justify-center gap-1.5 touch-manipulation"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>Read Online</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WelcomeDiscountPopup;
