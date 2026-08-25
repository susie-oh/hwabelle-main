import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoWhite from "@/assets/hwabelle-logo-white.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('subscribe-newsletter', {
        body: { email }
      });

      if (error) throw error;

      toast.success("Thanks for subscribing!", {
        description: "You'll receive our latest tips and updates.",
      });
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Failed to subscribe", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-serif text-2xl md:text-3xl mb-4">
              Join our community
            </h3>
            <p className="text-primary-foreground/70 mb-8">
              Receive pressing tips, seasonal inspiration, and be the first to know about new products.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-transparent border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 flex-1"
              />
              <Button variant="outline" type="submit" disabled={isSubmitting} className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-foreground">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/">
              <img
                src={logoWhite}
                alt="Hwabelle"
                className="h-16 w-auto mb-6"
              />
            </Link>
            <p className="text-sm text-primary-foreground/60 leading-relaxed mb-4">
              Thoughtfully crafted tools for preserving nature's fleeting beauty.
            </p>
            <p className="text-xs text-primary-foreground/45 leading-relaxed">
              Fast & secure delivery: all orders are stored and fulfilled via Amazon Multi-Channel Fulfillment.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 text-primary-foreground/50">
              Shop
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/shop" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/product/flower-press-kit" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Flower Press Kit
                </Link>
              </li>
              <li>
                <Link to="/flower-quiz" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Find Your Flower
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 text-primary-foreground/50">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-4 text-primary-foreground/50">
              Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/hwabelle/?hl=en" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://www.tiktok.com/@hwabelle.shop" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tiktok"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
            </a>
            <a href="https://www.pinterest.com/hwabelle/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors" aria-label="Pinterest">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pinterest"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.25 2.67 7.82 6.36 9.24-.09-.79-.17-2 .03-2.87.19-.79 1.24-5.26 1.24-5.26s-.31-.64-.31-1.58c0-1.48.86-2.59 1.93-2.59.91 0 1.35.68 1.35 1.5 0 .92-.58 2.3-.88 3.58-.25 1.07.54 1.94 1.59 1.94 1.91 0 3.38-2.02 3.38-4.93 0-2.58-1.85-4.38-4.5-4.38-3.07 0-4.87 2.3-4.87 4.68 0 .93.36 1.93.8 2.46.09.11.1.2.07.31-.08.33-.26 1.06-.3 1.2-.05.21-.17.25-.4.15-1.48-.69-2.4-2.85-2.4-4.59 0-3.74 2.72-7.18 7.84-7.18 4.12 0 7.32 2.94 7.32 6.86 0 4.1-2.58 7.4-6.17 7.4-1.2 0-2.34-.63-2.73-1.37l-.75 2.85c-.27 1.04-1 2.35-1.49 3.14C10.22 21.78 11.09 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
            </a>
            <a href="https://www.youtube.com/@Hwabelle" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><polygon points="10 15 15 12 10 9" /></svg>
            </a>
            <a href="https://www.facebook.com/hwabelle/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
          </div>

          <div className="flex items-center gap-6 text-xs text-primary-foreground/50">
            <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy</Link>
            <Link to="/data-protection" className="hover:text-primary-foreground transition-colors">Data Protection</Link>
            <Link to="/terms" className="hover:text-primary-foreground transition-colors">Terms</Link>
            <span>© {new Date().getFullYear()} Hwabelle</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
