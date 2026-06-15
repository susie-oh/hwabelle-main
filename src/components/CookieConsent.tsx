import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("hwabelle-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500); // Slight delay for a premium entry
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("hwabelle-cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("hwabelle-cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 bg-background/95 border border-border/80 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md rounded-2xl flex flex-col gap-4"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-serif text-lg text-foreground font-medium">Cookie Preferences</h4>
            <button
              onClick={() => setIsVisible(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use cookies to improve your shopping experience, analyze site traffic, and personalize content. By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies in accordance with our{" "}
            <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </Link>.
          </p>
          <div className="flex gap-3 justify-end text-sm">
            <Button variant="ghost" size="sm" onClick={handleDecline}>
              Decline
            </Button>
            <Button variant="hero" size="sm" onClick={handleAccept}>
              Accept All
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
