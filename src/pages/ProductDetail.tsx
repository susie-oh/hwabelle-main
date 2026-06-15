import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Check, ShoppingBag, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import img1 from "@/assets/capture-moment.jpeg";
import img2 from "@/assets/step-by-step.jpeg";
import img3 from "@/assets/comparison.jpeg";
import img4 from "@/assets/digital-designer.jpeg";
import img5 from "@/assets/kit-contents.jpeg";
import NewsletterForm from "@/components/sections/NewsletterForm";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { PRODUCT, PRODUCT_PATH, buildCanonicalUrl, defaultKeywords } from "@/lib/site";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import CustomerStories from "@/components/CustomerStories";

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { toast } = useToast();

  const images = [
    {
      src: img1,
      alt: "Hwabelle acrylic flower press kit with preserved flowers",
    },
    {
      src: img2,
      alt: "Step-by-step flower pressing setup for beginners",
    },
    {
      src: img3,
      alt: "Acrylic flower press kit comparison for bouquet preservation",
    },
    {
      src: img4,
      alt: "Hwabelle AI Designer for keepsake planning",
    },
    {
      src: img5,
      alt: "What is included in the Hwabelle flower press kit",
    },
  ];

  const features = [
    "Crystal-clear acrylic plates so you can check placement while arranging petals and blooms",
    "Absorbent blotting paper for more even drying across bouquet flowers and garden clippings",
    "Sponge paper layers that help manage moisture while pressing",
    "Durable brass hardware that tightens securely and evenly",
    "Large and small press sizes for wedding bouquet blooms, wildflowers, and smaller petals",
    "Felt storage bags to keep the kit tidy between projects",
  ];

  const whatsIncluded = [
    "Two acrylic press sizes for larger blooms and smaller detail pieces",
    "Blotting paper sheets for drying support",
    "Sponge paper layers for moisture management",
    "Cardstock dry boards for stable layering",
    "Brass bolts and hardware",
    "Two felt storage bags",
  ];

  const useCases = [
    "DIY wedding bouquet preservation at home",
    "Pressed memorial flower keepsakes",
    "Garden flower pressing and seasonal blooms",
    "Wildflower pressing for frames, cards, and bookmarks",
    "DIY botanical art and pressed flower crafts",
    "Thoughtful gifting for brides and flower lovers",
  ];

  const beginnerTips = [
    "Start with the freshest flowers you can find.",
    "Choose flatter blooms or separate thick flowers into petals.",
    "Change absorbent layers if they feel noticeably damp.",
    "Store the press in a dry spot and give thicker flowers extra time.",
  ];

  const faqs = [
    {
      question: "Can I use this flower press kit for a wedding bouquet?",
      answer:
        "Yes. Hwabelle can help preserve selected blooms from a wedding bouquet, especially flatter flowers and petals that press well. For best results, start pressing as soon as possible while flowers are still fresh.",
    },
    {
      question: "Is this flower press kit beginner-friendly?",
      answer:
        "Yes. The kit is designed for beginners, crafters, gardeners, and adults who want a simple way to preserve flowers at home.",
    },
    {
      question: "What flowers are best for pressing?",
      answer:
        "Flatter blooms, petals, leaves, wildflowers, and thinner garden flowers usually press best. Thick flowers may need to be separated into petals or smaller sections.",
    },
    {
      question: "How long does flower pressing take?",
      answer:
        "Many flowers take one to three weeks depending on flower thickness, moisture, pressure, and drying conditions.",
    },
    {
      question: "What can I make with pressed flowers?",
      answer:
        "Pressed flowers can be used for frames, cards, bookmarks, wedding keepsakes, scrapbooks, and botanical art.",
    },
  ];

  const handleAddToCart = () => {
    addItem({
      id: PRODUCT.id,
      name: PRODUCT.shortName,
      price: PRODUCT.price,
      image: img1,
    });
    toast({
      title: "Added to cart",
      description: "Acrylic Flower Press Kit has been added to your cart.",
    });
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: PRODUCT.name,
    description: PRODUCT.description,
    category: PRODUCT.category,
    brand: {
      "@type": "Brand",
      name: "Hwabelle",
    },
    image: images.map((image) => new URL(image.src, window.location.origin).toString()),
    offers: {
      "@type": "Offer",
      price: PRODUCT.price,
      priceCurrency: PRODUCT.currency,
      url: buildCanonicalUrl(PRODUCT_PATH),
    },
  };

  return (
    <Layout>
      <Seo
        title="Acrylic Flower Press Kit for Adults | Hwabelle Flower Preservation Kit"
        description="Shop Hwabelle’s acrylic flower press kit for adults and beginners. Preserve wedding bouquets, garden flowers, wildflowers, and meaningful blooms as lasting keepsakes."
        path={PRODUCT_PATH}
        image={new URL(img1, window.location.origin).toString()}
        type="product"
        keywords={[
          ...defaultKeywords,
          "wedding bouquet keepsake",
          "memorial flower preservation",
          "garden flower pressing",
        ]}
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: "Hwabelle Acrylic Flower Press Kit", path: PRODUCT_PATH },
          ]),
          productSchema,
          faqSchema(faqs),
        ]}
      />

      <section className="py-12 md:py-20 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-4">
              <div className="bg-secondary rounded-lg overflow-hidden">
                <img
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  className="w-full h-auto block"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-secondary rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-foreground" : "border-transparent"
                    }`}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <img src={img.src} alt={img.alt} className="w-full h-auto block" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:py-4">
              <p className="caption mb-3">Hwabelle</p>
              <h1 className="font-serif text-display mb-2">Hwabelle Acrylic Flower Press Kit — DIY Wedding Bouquet Preservation Kit</h1>
              <p className="text-2xl font-serif mb-6">${PRODUCT.price.toFixed(2)}</p>

              <p className="text-muted-foreground leading-relaxed mb-8">
                A beginner-friendly acrylic flower press designed as the ultimate DIY wedding bouquet preservation kit. Use it to press wedding bouquet petals, garden flowers, wildflowers, memorial blooms, and sentimental keepsakes at home.
              </p>

              <div className="grid gap-3 mb-8 text-sm text-muted-foreground sm:grid-cols-2">
                <p>DIY wedding bouquet preservation kit</p>
                <p>Beginner-friendly flower pressing</p>
                <p>Designed for adults, crafters, and brides</p>
                <p>Clear acrylic plates for easier arrangement</p>
              </div>

              <div className="mb-8">
                <h2 className="text-sm tracking-widest uppercase mb-4">What this kit helps you preserve</h2>
                <ul className="space-y-2">
                  {useCases.map((useCase, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <Check size={16} className="text-foreground mt-1 flex-shrink-0" />
                      <span>{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-sm tracking-widest uppercase mb-4">Why people choose it</h2>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-muted-foreground">
                      <Check size={16} className="text-foreground mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 mb-10">
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  onClick={handleAddToCart}
                  id="add-to-cart-button"
                >
                  <ShoppingBag size={20} className="mr-2" />
                  Add to Cart
                </Button>
                <a
                  href="https://www.amazon.com/dp/B0GFGY8DGW"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-medium rounded-md border border-[#FF9900] text-[#FF9900] hover:bg-[#FF9900] hover:text-white transition-colors"
                  id="buy-on-amazon-button"
                >
                  <ExternalLink size={16} />
                  View on Amazon
                </a>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3">
                  <Check size={14} className="text-emerald-600 flex-shrink-0" />
                  <span>Secure checkout: fulfilled by Amazon with fast 2–5 business day delivery.</span>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Need details first? Review <Link to="/shipping" className="underline underline-offset-2">shipping</Link>,{" "}
                  <Link to="/returns" className="underline underline-offset-2">returns</Link>, or{" "}
                  <Link to="/contact" className="underline underline-offset-2">contact support</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-display text-center mb-12">What is included</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="mx-auto max-w-4xl grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-display mb-6">How it works</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Place flowers between the included absorbent layers, arrange them carefully, and
                  tighten the acrylic plates evenly. Leave the press in a dry area while the flowers
                  flatten and dry fully.
                </p>
                <p>
                  Flatter flowers and separated petals often press most cleanly. For thicker flowers,
                  breaking the bloom into smaller sections usually gives better results.
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-display mb-6">Best flowers to press</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Flatter blooms, leaves, wildflowers, and thinner garden flowers usually press best.
                  Roses, peonies, and fuller bouquet flowers can still work beautifully when pressed petal by petal.
                </p>
                <p>
                  If you are preserving a bridal bouquet, choose the freshest blooms first and start
                  as soon as possible after the event for better color retention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="mx-auto max-w-4xl grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-serif text-display mb-6">Who it is for</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This flower pressing kit is a good fit for beginners, adults starting a new botanical
                craft hobby, gardeners preserving seasonal blooms, and anyone making a sentimental keepsake.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                It also works well for wedding bouquet preservation at home when you want a simple, visible way to arrange petals and blooms.
              </p>
            </div>
            <div>
              <h2 className="font-serif text-display mb-6">Beginner tips, care, and storage</h2>
              <ul className="space-y-3 text-muted-foreground">
                {beginnerTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check size={16} className="text-foreground mt-1 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-secondary/35 border-t border-b border-border/50">
        <BeforeAfterSlider />
      </section>

      <section className="py-12 bg-background border-b border-border/40">
        <CustomerStories />
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-serif text-display mb-6">FAQ</h2>
            <div className="grid gap-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="border-b border-divider pb-6">
                  <h3 className="font-serif text-xl mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-sm">
              <Link to="/designer" className="underline underline-offset-2">
                Visit the Hwabelle AI Designer
              </Link>
              <Link to="/blog/how-to-preserve-wedding-bouquet-at-home" className="underline underline-offset-2">
                Read wedding bouquet preservation tips
              </Link>
              <Link to="/about" className="underline underline-offset-2">
                Learn about Hwabelle
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-md mx-auto text-center">
            <h2 className="font-serif text-heading mb-3">Pressing tips and seasonal guides</h2>
            <p className="text-muted-foreground mb-6">
              Get flower pressing tips, bouquet preservation ideas, and botanical craft inspiration in your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
