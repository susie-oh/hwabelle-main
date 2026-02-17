import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check } from "lucide-react";
import productImage from "@/assets/product-flower-press.jpg";
import lifestyleImage from "@/assets/lifestyle-pressing.jpg";
import heroImage from "@/assets/hero-flower-press.jpg";
import pressedFlowers from "@/assets/pressed-flowers-collection.jpg";
import NewsletterForm from "@/components/sections/NewsletterForm";

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  
  const images = [productImage, lifestyleImage, heroImage, pressedFlowers];

  const features = [
    "Crystal-clear acrylic plates — see your arrangement as it presses",
    "Absorbent blotting paper for consistent, even drying",
    "Sponge paper layers for optimal moisture absorption",
    "Durable brass hardware that tightens securely",
    "Large + small press sizes for every flower type",
    "Compact storage: 28 × 26 × 5 cm with felt bags included"
  ];

  const whatsIncluded = [
    "2× Acrylic press plates (25.4 × 25.4 cm & 7.6 × 7.6 cm)",
    "Blotting paper sheets (20 × 20 cm & 5.5 × 5.5 cm)",
    "Sponge paper layers (20 × 20 cm & 5.5 × 5.5 cm)",
    "Cardstock dry boards (20 × 20 cm & 5.5 × 5.5 cm)",
    "Brass bolts (M6 & M4)",
    "2× Felt storage bags (28 × 28 cm & 10 × 10 cm)"
  ];

  const perfectFor = [
    "Wedding bouquet preservation",
    "Beginner flower pressers",
    "Botanical art & framing",
    "Journaling & scrapbooking",
    "Seasonal garden keepsakes",
    "Crafters, artists & gift-givers"
  ];

  return (
    <Layout>
      <section className="py-12 md:py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-secondary overflow-hidden">
                <img 
                  src={images[selectedImage]} 
                  alt="Flower Press Kit" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-secondary overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-foreground" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:py-4">
              <p className="caption mb-3">Hwabelle</p>
              <h1 className="font-serif text-display mb-2">Acrylic Flower Press Kit</h1>
              <p className="text-2xl font-serif mb-6">Coming Soon</p>
              
              <p className="text-muted-foreground leading-relaxed mb-8">
                A complete DIY flower press kit for beginners and experienced crafters alike. Preserve your wedding bouquet, seasonal garden flowers, or any bloom worth keeping — with crystal-clear acrylic plates that let you see exactly how your arrangement is taking shape.
              </p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-sm tracking-widest uppercase mb-4">Features</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <Check size={16} className="text-foreground mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="space-y-3 mb-10">
                <Button variant="hero" size="xl" className="w-full" asChild>
                  <a href="[ADD AMAZON LINK]" target="_blank" rel="noopener noreferrer">
                    Buy on Amazon
                  </a>
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Free shipping on orders over $35
                </p>
              </div>

              {/* Shipping */}
              <div className="border-t border-divider pt-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Shipping:</strong> Fulfilled by Amazon. Typically arrives in 2-5 business days.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong className="text-foreground">Returns:</strong> 30-day return window through Amazon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-display text-center mb-12">What's in the Flower Press Kit</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whatsIncluded.map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-background p-4">
                  <Check size={18} className="text-foreground flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Perfect For */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-display mb-12">Perfect For</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {perfectFor.map((item, index) => (
                <span key={index} className="px-6 py-3 border border-divider text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-md mx-auto text-center">
            <h2 className="font-serif text-heading mb-3">Pressing Tips & Seasonal Guides</h2>
            <p className="text-muted-foreground mb-6">
              Which flowers press best each season, how to preserve wedding bouquets, and what to make with your pressed botanicals — straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
