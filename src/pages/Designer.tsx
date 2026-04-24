import Layout from "@/components/layout/Layout";
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
  Star,
  Users,
  Zap,
  Crown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import productImage from "@/assets/product-flower-press.jpg";

const features = [
  {
    icon: Camera,
    title: "Photo Identification",
    description:
      "Snap a photo of any flower and instantly learn its species, pressing difficulty, and colour retention potential.",
  },
  {
    icon: Palette,
    title: "Design Inspiration",
    description:
      "Get curated ideas for framing, arrangements, resin pieces, and mixed media based on your pressed flowers.",
  },
  {
    icon: BookOpen,
    title: "9-Module Course",
    description:
      "A full floral preservation curriculum — from pressing fundamentals to advanced resin — in workbook format.",
  },
  {
    icon: ShieldCheck,
    title: "Mold Prevention",
    description:
      "Expert drying-support recommendations and moisture management to protect every bloom you press.",
  },
  {
    icon: Leaf,
    title: "Salvage & Disassembly",
    description:
      "Turn broken petals, half blooms, and bent stems into intentional design elements.",
  },
  {
    icon: MessageCircle,
    title: "Unlimited Conversations",
    description:
      "Ask anything, anytime. No message caps, no cooldowns — your expert is always available.",
  },
];

const courseModules = [
  "Pressing Fundamentals",
  "Flower Triage & Selection",
  "Disassembly Skills",
  "Assisted Drying Tools",
  "Storage & Pause Mode",
  "The 5 Hwabelle Design Styles",
  "Color Shift & Recoloring",
  "Mixed Media Techniques",
  "Resin Preservation (Advanced)",
];

const chatPreview = [
  {
    role: "user" as const,
    text: "I found these pink peonies — can I press them whole?",
  },
  {
    role: "assistant" as const,
    text: "Peonies are gorgeous but too thick to press whole! Gently disassemble petal by petal — the outer petals press beautifully flat. Use silica gel between layers for best colour retention. You'll end up with 15–20 stunning individual petals perfect for framing.",
  },
  {
    role: "user" as const,
    text: "How long will they take to dry?",
  },
  {
    role: "assistant" as const,
    text: "Individual peony petals typically take **2–3 weeks** with proper drying support. I'd recommend changing the absorbent paper every 3–4 days and adding a bamboo charcoal pouch nearby to manage humidity. You'll know they're ready when they feel papery-thin and hold their shape when lifted.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    text: "It identified my wildflowers instantly and told me exactly how to press each one. Worth every penny.",
    rating: 5,
  },
  {
    name: "Emily R.",
    text: "I preserved my wedding bouquet using the AI's guidance. The step-by-step instructions were perfect.",
    rating: 5,
  },
  {
    name: "Jessica L.",
    text: "The course modules are incredible. I went from beginner to confidently working with resin in weeks.",
    rating: 5,
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
      description: "Kit + AI Designer Access added to your cart.",
    });
    openCart();
  };

  const handleAddAIOnly = () => {
    addItem({ id: "ai-designer-access", name: "AI Designer Access", price: 19.99 });
    toast({
      title: "Added to cart",
      description: "AI Designer Access added to your cart.",
    });
    openCart();
  };

  return (
    <Layout>
      <div className="min-h-screen">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden">
          {/* Subtle radial glow */}
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
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-700 dark:text-emerald-400 mb-8">
                  <Sparkles size={14} />
                  <span>AI-Powered Floral Preservation</span>
                  <span className="ml-1 font-semibold">$19.99/mo or Free Trial</span>
                </div>

                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                  Your Personal Flower
                  <br />
                  <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                    Preservation Expert
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                  Upload a photo, ask a question, and get expert guidance on
                  pressing techniques, design ideas, and colour preservation —
                  powered by AI trained specifically for botanical art.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="hero"
                    size="lg"
                    className="gap-2 text-base px-8"
                    onClick={handleAddAIOnly}
                  >
                    <Zap size={16} />
                    Start for $19.99/mo
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 text-base px-8 border-foreground/20 hover:bg-foreground hover:text-background"
                    onClick={handleAddKitAndAI}
                  >
                    <Crown size={16} />
                    Kit + 30 Days Free AI — $44.98
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2 mt-5">
                  <p className="text-xs text-muted-foreground/60">
                    Cancel anytime · Instant activation
                  </p>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    Already purchased?{" "}
                    <Link
                      to="/unlock"
                      className="underline underline-offset-2 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                    >
                      Activate your access →
                    </Link>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Trust Strip ─── */}
        <section className="border-y border-border bg-secondary/40">
          <div className="container py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { value: "500+", label: "Flowers Identified", icon: Flower2 },
                { value: "9", label: "Course Modules", icon: BookOpen },
                { value: "24/7", label: "Always Available", icon: Zap },
                { value: "100%", label: "Mold-Free Method", icon: ShieldCheck },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="text-center"
                >
                  <stat.icon
                    size={20}
                    className="mx-auto mb-2 text-emerald-600 dark:text-emerald-400"
                  />
                  <p className="text-2xl font-serif">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Live Chat Preview ─── */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                See it in action
              </p>
              <h2 className="font-serif text-3xl md:text-4xl mb-4">
                Like Texting a Botanist Friend
              </h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Ask anything — from flower identification to advanced resin
                techniques. Here's a real conversation preview.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Chat window mockup */}
              <div className="border border-border rounded-2xl overflow-hidden bg-background shadow-xl shadow-black/5">
                {/* Chat header */}
                <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3 bg-secondary/30">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/20 flex items-center justify-center">
                      <Sparkles
                        size={16}
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">
                      Floral Designer
                    </p>
                    <p className="text-[11px] text-muted-foreground">Online</p>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="px-5 py-6 space-y-5 max-h-[420px] overflow-hidden">
                  {chatPreview.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start gap-2.5"
                        }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-1">
                          <Sparkles
                            size={12}
                            className="text-emerald-600 dark:text-emerald-400"
                          />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] text-sm leading-relaxed ${msg.role === "user"
                          ? "bg-foreground text-background rounded-2xl rounded-br-md px-4 py-3"
                          : "text-foreground"
                          }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Fake input */}
                <div className="px-5 py-3 border-t border-border/60 bg-secondary/20">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground/50 bg-secondary/50 rounded-xl px-4 py-2.5 border border-border/40">
                    <Camera size={16} />
                    <span>Ask about flowers, pressing, or design...</span>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <Button
                  variant="hero"
                  size="lg"
                  className="gap-2"
                  onClick={handleAddAIOnly}
                >
                  <Sparkles size={16} />
                  Try It Yourself
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Features Grid ─── */}
        <section className="bg-secondary/30 border-y border-border">
          <div className="container py-20 md:py-28">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">
                Everything Your AI Designer Can Do
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Expert-level guidance at your fingertips — from your first press
                to advanced mixed media.
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
                      <Icon
                        size={18}
                        className="text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                    <h3 className="font-serif text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Pricing ─── */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Choose the option that fits your journey. Both include full,
                unlimited access to the AI Designer.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Kit + AI */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative border-2 border-emerald-600 rounded-2xl p-8 bg-background shadow-lg shadow-emerald-500/5"
              >
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="text-center mb-6 pt-2">
                  <h3 className="font-serif text-2xl mb-1">Kit + AI Access</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Everything you need to start
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-serif text-4xl">$44.98</span>
                    <span className="text-muted-foreground text-sm">/kit + 30 days free</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 text-sm">
                  {[
                    "Premium acrylic flower press kit",
                    "Full AI Designer access (unlimited)",
                    "9-module preservation course",
                    "Photo analysis & flower ID",
                    "Design inspiration & salvage tips",
                    "Priority support",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check
                        size={16}
                        className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleAddKitAndAI}
                >
                  Get Kit + 30 Days Free AI
                  <ArrowRight size={16} />
                </Button>
              </motion.div>

              {/* AI Only */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="border border-border rounded-2xl p-8 bg-background"
              >
                <div className="text-center mb-6">
                  <h3 className="font-serif text-2xl mb-1">AI Designer Only</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Already have your tools?
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-serif text-4xl">$19.99</span>
                    <span className="text-muted-foreground text-sm">/mo</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 text-sm">
                  {[
                    "Full AI Designer access (unlimited)",
                    "9-module preservation course",
                    "Photo analysis & flower ID",
                    "Design inspiration & salvage tips",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check
                        size={16}
                        className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 border-foreground/20 hover:bg-foreground hover:text-background"
                  onClick={handleAddAIOnly}
                >
                  Get AI Access
                  <Sparkles size={16} />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Course Modules ─── */}
        <section className="bg-foreground text-primary-foreground">
          <div className="container py-20 md:py-28">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary-foreground/40 mb-4">
                    Included in every plan
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl mb-4">
                    A Complete Preservation Course
                  </h2>
                  <p className="text-primary-foreground/70 leading-relaxed mb-6">
                    Your AI Designer isn't just a chatbot — it's trained on a
                    full floral preservation curriculum. From beginner
                    fundamentals to advanced resin techniques, every lesson is
                    structured in clear, workbook-style format.
                  </p>
                  <p className="text-primary-foreground/50 leading-relaxed text-sm">
                    Preservation-first · Tool-forward · Mold-free, always
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

        {/* ─── Testimonials ─── */}
        <section className="py-20 md:py-28 bg-secondary/20">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">
                Loved by Flower Pressers
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Join a growing community of botanical artists using AI
                guidance.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 bg-background border border-border rounded-xl"
                >
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4 text-foreground">
                    "{t.text}"
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    — {t.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="py-20 md:py-28">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                  <Sparkles
                    size={28}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <h2 className="font-serif text-3xl md:text-4xl mb-4">
                  Ready to Preserve with Confidence?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Start your AI-guided botanical journey today. The Flower Press
                  Kit + AI Designer bundle is the fastest way to go from
                  beginner to confident preserver.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="hero"
                    size="lg"
                    className="gap-2 text-base px-8"
                    onClick={handleAddKitAndAI}
                  >
                    Get Kit + 30 Days Free AI
                    <ArrowRight size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 text-base px-8 border-foreground/20 hover:bg-foreground hover:text-background"
                    onClick={handleAddAIOnly}
                  >
                    AI Designer Only — $19.99/mo
                    <Sparkles size={16} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground/50 mt-5">
                  Cancel anytime · No hidden fees
                </p>
                <p className="text-xs text-muted-foreground/40 mt-2">
                  Already purchased?{" "}
                  <Link
                    to="/unlock"
                    className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
                  >
                    Activate your access →
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Designer;
