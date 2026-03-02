import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Flower2, Palette, BookOpen, ShieldCheck, Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Flower2,
    title: "Flower Identification",
    description: "Upload a photo of any flower and get instant identification, along with specific pressing techniques tailored to that species.",
  },
  {
    icon: Palette,
    title: "Design Inspiration",
    description: "Receive curated design ideas for framing, arrangements, and mixed media projects based on your pressed flowers.",
  },
  {
    icon: BookOpen,
    title: "Structured Course Content",
    description: "Access a full floral preservation course — from pressing fundamentals to advanced resin work — in modern workbook format.",
  },
  {
    icon: ShieldCheck,
    title: "Mold Prevention Guidance",
    description: "Get expert drying-support recommendations and moisture management techniques to protect every bloom you press.",
  },
  {
    icon: Leaf,
    title: "Salvage & Disassembly",
    description: "Learn how to work with imperfect flowers. Broken petals, half blooms, and bent stems all become design elements.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Expertise",
    description: "Powered by advanced AI trained specifically for floral preservation — calm, expert guidance whenever you need it.",
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

const Designer = () => {
  return (
    <Layout>
      <div className="min-h-screen pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-secondary/30">
          <div className="container py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-full text-sm text-muted-foreground mb-8">
                  <Sparkles size={14} />
                  <span>AI-Powered Floral Preservation</span>
                </div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
                  Your Personal Flower
                  <br />
                  <span className="text-primary">Preservation Expert</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
                  Upload a photo, ask a question, and get expert guidance on pressing techniques,
                  design ideas, and preservation methods — all powered by AI trained specifically
                  for botanical art.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/shop">
                    <Button variant="hero" size="lg" className="gap-2 text-base px-8">
                      Get the Kit + AI Access
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                  <Link to="/shop">
                    <Button variant="outline" size="lg" className="gap-2 text-base px-8 border-foreground/20 hover:bg-foreground hover:text-background">
                      AI Designer Only
                      <Sparkles size={16} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-secondary/20 border-y border-border">
          <div className="container py-20 md:py-28">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">Choose Your Path</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Start your preservation journey with the full kit, or unlock the AI Designer on its own.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Kit + AI */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative border-2 border-foreground p-8 bg-background"
              >
                <div className="absolute -top-3 left-6 bg-foreground text-background text-xs font-medium px-3 py-1 uppercase tracking-wider">
                  Best Value
                </div>
                <h3 className="font-serif text-2xl mb-2">Kit + AI Access</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Everything you need — the Hwabelle Flower Press Kit plus full access to the AI Designer Assistant.
                </p>
                <ul className="space-y-3 mb-8 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-foreground mt-0.5">✓</span>
                    <span>Premium flower press kit with all tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground mt-0.5">✓</span>
                    <span>Full AI Designer access (unlimited)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground mt-0.5">✓</span>
                    <span>9-module preservation course</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground mt-0.5">✓</span>
                    <span>Photo analysis & flower identification</span>
                  </li>
                </ul>
                <Link to="/shop" className="block">
                  <Button variant="hero" size="lg" className="w-full gap-2">
                    Shop the Kit
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </motion.div>

              {/* AI Only */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="border border-border p-8 bg-background"
              >
                <h3 className="font-serif text-2xl mb-2">AI Designer Only</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Already have your tools? Unlock the AI Designer Assistant for expert guidance and course content.
                </p>
                <ul className="space-y-3 mb-8 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-foreground mt-0.5">✓</span>
                    <span>Full AI Designer access (unlimited)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground mt-0.5">✓</span>
                    <span>9-module preservation course</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground mt-0.5">✓</span>
                    <span>Photo analysis & flower identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-foreground mt-0.5">✓</span>
                    <span>Design inspiration & salvage techniques</span>
                  </li>
                </ul>
                <Link to="/shop" className="block">
                  <Button variant="outline" size="lg" className="w-full gap-2 border-foreground/20 hover:bg-foreground hover:text-background">
                    Get AI Access
                    <Sparkles size={16} />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container py-20 md:py-28">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">What Your AI Designer Can Do</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Expert-level guidance at your fingertips — from your first press to advanced mixed media.
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
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 border border-border hover:border-foreground/20 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:bg-foreground/10 transition-colors">
                    <Icon size={18} className="text-foreground" />
                  </div>
                  <h3 className="font-serif text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Course Modules */}
        <section className="bg-foreground text-primary-foreground">
          <div className="container py-20 md:py-28">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl mb-4">
                    A Complete Preservation Course
                  </h2>
                  <p className="text-primary-foreground/70 leading-relaxed mb-6">
                    Your AI Designer isn't just a chatbot — it's trained on a full floral
                    preservation curriculum. From beginner fundamentals to advanced resin
                    techniques, every lesson is structured in clear, workbook-style format.
                  </p>
                  <p className="text-primary-foreground/70 leading-relaxed text-sm">
                    Preservation-first. Tool-forward. Mold-free, always.
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

        {/* CTA Section */}
        <section className="container py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles size={32} className="mx-auto mb-6 text-foreground/60" />
              <h2 className="font-serif text-3xl md:text-4xl mb-4">
                Ready to Preserve with Confidence?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Get the Hwabelle Flower Press Kit and unlock your personal AI preservation expert.
                Every kit includes full access to the AI Designer Assistant.
              </p>
              <Link to="/shop">
                <Button variant="hero" size="lg" className="gap-2 text-base px-8">
                  Shop the Kit
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Designer;
