import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Sparkles,
  Flower2,
  Palette,
  BookOpen,
  ShieldCheck,
  Leaf,
  ArrowRight,
  Camera,
  MessageCircle,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import productImage from "@/assets/product-flower-press.jpg";
import designerImage from "@/assets/digital-designer.jpeg";
import { defaultKeywords } from "@/lib/site";

const features = [
  {
    icon: Camera,
    title: "Photo-based flower guidance",
    description:
      "Upload a flower photo and get help identifying pressing suitability, bloom thickness, and arrangement options.",
  },
  {
    icon: Palette,
    title: "Keepsake planning ideas",
    description:
      "Explore ideas for bouquet keepsakes, frames, botanical art, cards, and other pressed flower projects.",
  },
  {
    icon: BookOpen,
    title: "Beginner checklists",
    description:
      "Work through practical flower selection, pressing, and drying steps without needing to guess your next move.",
  },
  {
    icon: ShieldCheck,
    title: "Troubleshooting support",
    description:
      "Get guidance when flowers are thick, damp, fragile, or difficult to press evenly.",
  },
  {
    icon: Leaf,
    title: "Bouquet and garden use cases",
    description:
      "Plan around wedding bouquets, memorial blooms, wildflowers, seasonal cuttings, and sentimental flowers.",
  },
  {
    icon: MessageCircle,
    title: "Design-focused questions",
    description:
      "Use it as a planning assistant for layout ideas, flower pairings, and display concepts.",
  },
];

const courseModules = [
  "Flower triage and selection",
  "Beginner pressing setup",
  "Layering and moisture control",
  "Bouquet flower preparation",
  "Storage and handling",
  "Pressed flower design ideas",
];

const chatPreview = [
  {
    role: "user" as const,
    text: "I want to preserve part of my wedding bouquet. Which flowers should I start with?",
  },
  {
    role: "assistant" as const,
    text: "Start with the freshest flatter blooms, petals, and greenery first. If any flowers feel thick or damp, separate them into smaller sections before pressing.",
  },
  {
    role: "user" as const,
    text: "What should I make with the pressed flowers?",
  },
  {
    role: "assistant" as const,
    text: "A floating frame, vow keepsake, or botanical collage usually works beautifully for bouquet flowers. You can plan the layout before pressing so you know which pieces to save.",
  },
];

const Designer = () => {
  const { addItem, openCart } = useCart();
  const { toast } = useToast();

  const handleAddKitAndAI = () => {
    addItem({
      id: "flower-press-kit",
      name: "Acrylic Flower Press Kit",
      price: 34.99,
      image: productImage,
    });
    addItem({ id: "ai-designer-access", name: "AI Designer Access", price: 19.99 });
    toast({
      title: "Added to cart",
      description: "Kit + design assistant access added to your cart.",
    });
    openCart();
  };

  const handleAddAIOnly = () => {
    addItem({ id: "ai-designer-access", name: "AI Designer Access", price: 19.99 });
    toast({
      title: "Added to cart",
      description: "Design assistant access added to your cart.",
    });
    openCart();
  };

  return (
    <Layout>
      <Seo
        title="Flower Preservation Design Assistant | Hwabelle"
        description="Use Hwabelle’s flower preservation design assistant for event-aware guidance, flower selection tips, keepsake ideas, and beginner-friendly pressing checklists."
        path="/designer"
        image={new URL(designerImage, window.location.origin).toString()}
        keywords={[...defaultKeywords, "flower preservation for beginners", "pressed flower frame"]}
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Flower Preservation Design Assistant", path: "/designer" },
          ]),
        ]}
      />

      <div className="min-h-screen">
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
            }}
          />
          <div className="container py-24 md:py-36 relative">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-700 dark:text-emerald-400 mb-8">
                  <Sparkles size={14} />
                  <span>Planning support for flower keepsakes</span>
                </div>

                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                  Flower Preservation
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                    Design Assistant
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                  Get beginner-friendly guidance for preserving wedding bouquets, garden flowers,
                  and meaningful blooms, plus help choosing what to press and how to turn it into a keepsake.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg" className="gap-2 text-base px-8" onClick={handleAddAIOnly}>
                    <Sparkles size={16} />
                    Add Assistant Access
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 text-base px-8 border-foreground/20 hover:bg-foreground hover:text-background"
                    onClick={handleAddKitAndAI}
                  >
                    <ArrowRight size={16} />
                    Add Kit + Assistant
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-5">
                  Need the full kit too? <Link to="/product/flower-press-kit" className="underline underline-offset-2">See the acrylic flower press kit</Link>.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/40">
          <div className="container py-8">
            <div className="grid grid-cols-1 gap-4 text-center text-sm text-muted-foreground md:grid-cols-4">
              <p>Flower selection guidance</p>
              <p>Keepsake planning ideas</p>
              <p>Beginner pressing checklists</p>
              <p>Links back to the product and resources you need</p>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                How it helps
              </p>
              <h2 className="font-serif text-3xl md:text-4xl mb-4">
                Plan your flower keepsake before you press
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Use the assistant to decide which blooms are best to save, how to prepare them,
                and what kind of keepsake you want to create.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="border border-border rounded-2xl overflow-hidden bg-background shadow-xl shadow-black/5">
                <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3 bg-secondary/30">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/20 flex items-center justify-center">
                      <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">Flower Preservation Assistant</p>
                    <p className="text-[11px] text-muted-foreground">Planning preview</p>
                  </div>
                </div>

                <div className="px-5 py-6 space-y-5 max-h-[420px] overflow-hidden">
                  {chatPreview.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-2.5"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-1">
                          <Sparkles size={12} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-foreground text-background rounded-2xl rounded-br-md px-4 py-3"
                            : "text-foreground"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="px-5 py-3 border-t border-border/60 bg-secondary/20">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground/50 bg-secondary/50 rounded-xl px-4 py-2.5 border border-border/40">
                    <Camera size={16} />
                    <span>Ask about bouquets, flowers, and keepsake ideas...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-secondary/30 border-y border-border">
          <div className="container py-20 md:py-28">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">
                What the assistant is useful for
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Focused support for flower selection, pressing decisions, and display planning.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    className="p-6 bg-background border border-border hover:border-emerald-500/30 rounded-xl transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                      <Icon size={18} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-serif text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">
                Helpful starting points
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div className="border border-border rounded-2xl p-8 bg-background">
                <h3 className="font-serif text-2xl mb-3">What you can ask</h3>
                <ul className="space-y-3 text-sm">
                  {[
                    "Which flowers from my bouquet are best to press?",
                    "How should I arrange petals in a frame?",
                    "What flowers are easiest for beginners?",
                    "What should I make with my pressed blooms?",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check size={16} className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-border rounded-2xl p-8 bg-background">
                <h3 className="font-serif text-2xl mb-3">Resources it pairs with</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><Link to="/product/flower-press-kit" className="underline underline-offset-2">Hwabelle Acrylic Flower Press Kit</Link></p>
                  <p><Link to="/blog/how-to-preserve-wedding-bouquet-at-home" className="underline underline-offset-2">How to Preserve a Wedding Bouquet at Home</Link></p>
                  <p><Link to="/blog/best-flowers-for-pressing" className="underline underline-offset-2">Best Flowers for Pressing</Link></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-foreground text-primary-foreground">
          <div className="container py-20 md:py-28">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary-foreground/40 mb-4">
                    Included topics
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl mb-4">
                    Guided flower preservation topics
                  </h2>
                  <p className="text-primary-foreground/70 leading-relaxed mb-6">
                    The assistant is set up to help you think through preparation, pressing, and
                    display decisions without overcomplicating the process.
                  </p>
                </div>
                <div className="space-y-3">
                  {courseModules.map((module, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      className="flex items-center gap-3 py-3 border-b border-primary-foreground/10"
                    >
                      <span className="text-xs text-primary-foreground/40 font-mono w-6">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm">{module}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-serif text-3xl md:text-4xl mb-4">
                  Ready to preserve flowers with more clarity?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Add assistant access on its own, or pair it with the acrylic flower press kit.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg" className="gap-2 text-base px-8" onClick={handleAddKitAndAI}>
                    Add Kit + Assistant
                    <ArrowRight size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 text-base px-8 border-foreground/20 hover:bg-foreground hover:text-background"
                    onClick={handleAddAIOnly}
                  >
                    Add Assistant Only
                    <Sparkles size={16} />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Designer;
