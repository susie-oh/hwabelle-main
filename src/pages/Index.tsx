import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema, organizationSchema, websiteSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import FlowerBurst from "@/components/animations/FlowerBurst";
import FloralBorder from "@/components/decorations/FloralBorder";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Gift, BookOpen, Sparkles } from "lucide-react";
import heroArrangement from "@/assets/hero-pressed-arrangement.webp";
import heroFlowImage from "@/assets/hero-pressed-flow.webp";
import lifestyleImage from "@/assets/lifestyle-pressing-cropped.webp";
import pressedFlowersImage from "@/assets/pressed-flowers-collection.webp";
import blogImage from "@/assets/blog-botanical-art.jpg";
import logoImage from "@/assets/hwabelle-logo.png";
import { PRODUCT_PATH, defaultKeywords } from "@/lib/site";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import CustomerStories from "@/components/CustomerStories";
import { CommunityHomepageModule } from "@/components/community/CommunityHomepageModule";

const Index = () => {
  const productHighlights = [
    {
      icon: Leaf,
      title: "DIY Wedding Bouquet Preservation",
      description:
        "A clear acrylic flower press kit designed to help you preserve bridal bouquets, garden flowers, and meaningful blooms at home.",
    },
    {
      icon: Gift,
      title: "Beautiful for Keepsakes & Gifting",
      description:
        "Designed for adults, crafters, brides, and artists creating a pressed flower wedding keepsake or sentimental botanical gift.",
    },
    {
      icon: BookOpen,
      title: "Simple Process, Lasting Results",
      description:
        "Use the included layers and hardware to press flatter flowers, leaves, and bridal petals into gorgeous, frame-ready botanical art.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Choose",
      description:
        "Pick fresh flowers, petals, and greenery before they wilt, especially bouquet flowers you want to preserve.",
    },
    {
      number: "02",
      title: "Arrange",
      description:
        "Layer blooms between absorbent sheets and position them carefully so they dry in a shape you love.",
    },
    {
      number: "03",
      title: "Press",
      description:
        "Tighten the plates evenly and let the flowers dry fully over the next one to three weeks.",
    },
    {
      number: "04",
      title: "Create",
      description:
        "Turn your pressed flowers into a wedding bouquet keepsake, framed botanical art, cards, or bookmarks.",
    },
  ];

  const aiFeatures = [
    {
      title: "Event-aware guidance",
      description:
        "Helps with weddings, memorial flowers, garden blooms, and sentimental arrangements.",
    },
    {
      title: "Flower selection help",
      description:
        "Shows which flowers, petals, leaves, and stems are better suited for pressing.",
    },
    {
      title: "Beginner-friendly checklist",
      description:
        "Gives simple next steps to prepare flowers before they wilt or lose their shape.",
    },
    {
      title: "Keepsake ideas",
      description:
        "Suggests frames, cards, bookmarks, botanical art, and other pressed flower projects.",
    },
  ];

  const blogPosts = [
    {
      title: "How to Preserve a Wedding Bouquet at Home",
      category: "Wedding Preservation",
      slug: "how-to-preserve-wedding-bouquet-at-home",
    },
    {
      title: "Best Flowers for Pressing: Beginner Guide",
      category: "Beginner Guide",
      slug: "best-flowers-for-pressing",
    },
    {
      title: "Flower Pressing for Beginners: Simple Step-by-Step Guide",
      category: "How-To",
      slug: "flower-pressing-for-beginners",
    },
  ];

  const faqs = [
    {
      q: "Can I use this flower press kit for a wedding bouquet?",
      a: "Yes. Hwabelle can help preserve selected blooms from a wedding bouquet, especially flatter flowers and petals that press well. For best results, start pressing as soon as possible while flowers are still fresh.",
    },
    {
      q: "Is this flower press kit beginner-friendly?",
      a: "Yes. The kit is designed for beginners, crafters, gardeners, and adults who want a simple way to preserve flowers at home.",
    },
    {
      q: "What flowers are best for pressing?",
      a: "Flatter blooms, petals, leaves, wildflowers, and thinner garden flowers usually press best. Thick flowers may need to be separated into petals or smaller sections.",
    },
    {
      q: "How long does flower pressing take?",
      a: "Many flowers take one to three weeks depending on flower thickness, moisture, pressure, and drying conditions.",
    },
  ];

  const logoUrl = new URL(logoImage, window.location.origin).toString();
  const socialUrls: string[] = [];

  return (
    <Layout>
      <Seo
        title="Hwabelle Flower Press Kit | Preserve Wedding Bouquets & Meaningful Blooms"
        description="Preserve wedding bouquets, garden flowers, wildflowers, and sentimental blooms at home with Hwabelle’s beginner-friendly acrylic flower press kit."
        path="/"
        image={new URL(heroArrangement, window.location.origin).toString()}
        keywords={defaultKeywords}
        schema={[
          organizationSchema(logoUrl, socialUrls),
          websiteSchema(),
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          faqSchema(
            faqs.map((faq) => ({
              question: faq.q,
              answer: faq.a,
            })),
          ),
        ]}
      />

      <section className="relative min-h-[88vh] md:min-h-screen w-full overflow-hidden">
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <img
            src={heroArrangement}
            alt="Pressed wedding bouquet petals arranged as a keepsake"
            className="w-full h-full object-cover object-center md:object-[center_35%]"
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>

        <div className="absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      <section className="relative z-10 -mt-8 bg-transparent px-4 pb-8 sm:-mt-10 md:-mt-14 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="container"
        >
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-border/70 bg-background/95 px-6 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm md:px-8 md:py-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <p className="caption mb-2">Begin Here</p>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  Start with the flower press kit, then use the Hwabelle AI Designer to plan bouquet preservation, flower selection, and keepsake ideas.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap md:justify-end">
                <Button variant="hero" size="lg" className="text-sm sm:text-base" asChild>
                  <Link to={PRODUCT_PATH}>Shop the Flower Press Kit</Link>
                </Button>
                <Button variant="hero-outline" size="lg" className="text-sm sm:text-base" asChild>
                  <Link to="/designer">Explore AI Designer</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative overflow-hidden bg-background py-16 md:py-24">
        <FloralBorder position="all" size="lg" />
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <ScrollReveal direction="left">
              <motion.img
                src={heroFlowImage}
                alt="Hwabelle acrylic flower press kit with preserved flowers"
                className="h-auto w-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6 }}
              />
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <p className="caption mb-4">DIY Wedding Bouquet Preservation Kit</p>
              <h1 className="font-serif text-display md:text-display-lg mb-6">
                DIY Wedding Bouquet Preservation Kit & Flower Press
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Preserve your most precious wedding day memories, garden blooms, and wildflowers. Hwabelle's beginner-friendly acrylic flower press kit lets you create beautiful DIY wedding bouquet keepsakes, framed arrangements, and botanical art at home.
              </p>
              <ul className="mb-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <li>Beginner-friendly & easy to use</li>
                <li>Great for bridal bouquet keepsakes</li>
                <li>Designed for adults, crafters, and brides</li>
                <li>Complete DIY flower preservation kit</li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" asChild>
                  <Link to="/shop">View the Shop</Link>
                </Button>
                <Button variant="hero-outline" asChild>
                  <Link to="/about">Learn About Hwabelle</Link>
                </Button>
                <Button variant="hero-outline" asChild>
                  <Link to="/blog">Read Resources</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 md:py-30">
        <div className="container">
          <StaggerContainer className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {productHighlights.map((highlight, index) => (
              <StaggerItem key={index} className="text-center">
                <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center">
                  <highlight.icon size={28} strokeWidth={1.5} className="text-foreground" />
                </div>
                <h2 className="font-serif text-xl mb-3">{highlight.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{highlight.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Flower Quiz Discovery Section */}
      <section className="relative overflow-hidden bg-secondary/30 py-16 md:py-24 border-y border-border/40">
        <div className="container">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <p className="caption mb-4">Personality Quiz</p>
            <h2 className="font-serif text-display md:text-display-lg mb-4">
              What's Your Flower?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              Discover the flower that matches your personality and what you can create with it.
            </p>
            <ul className="text-sm text-muted-foreground space-y-2.5 mb-10 max-w-md mx-auto text-left">
              <li className="flex items-start gap-2.5">
                <span className="text-foreground mt-0.5 shrink-0">·</span>
                <span>Your signature flower and what it represents</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-foreground mt-0.5 shrink-0">·</span>
                <span>Its strongest personality traits</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-foreground mt-0.5 shrink-0">·</span>
                <span>How suitable it is for flower pressing</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-foreground mt-0.5 shrink-0">·</span>
                <span>A personalized pressed-flower project idea</span>
              </li>
            </ul>
            <Button variant="hero" size="xl" asChild>
              <Link to="/flower-quiz?source=homepage">Discover My Flower</Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              7 quick questions · Takes about 2 minutes
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="container">
        <div className="divider" />
      </div>

      <section className="bg-background py-20 md:py-30">
        <div className="container">
          <ScrollReveal className="mb-16 text-center">
            <p className="caption mb-4">How It Works</p>
            <h2 className="font-serif text-display mb-4">Press flowers in four simple steps</h2>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6" staggerDelay={0.15}>
            {steps.map((step, index) => (
              <StaggerItem key={index} className="text-center">
                <span className="font-serif text-4xl md:text-5xl text-muted-foreground/30 block mb-4">
                  {step.number}
                </span>
                <h3 className="font-serif text-xl mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-secondary/30 py-12 border-t border-b border-border/50">
        <BeforeAfterSlider />
      </section>

      <section className="py-0">
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
          <ScrollReveal direction="left" className="aspect-square overflow-hidden md:aspect-auto">
            <motion.img
              src={lifestyleImage}
              alt="Beginner flower pressing kit in use with garden flowers"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6 }}
              loading="lazy"
            />
          </ScrollReveal>
          <ScrollReveal direction="right" className="aspect-square overflow-hidden md:aspect-auto">
            <motion.img
              src={pressedFlowersImage}
              alt="Pressed flowers collected for botanical keepsakes"
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6 }}
              loading="lazy"
            />
          </ScrollReveal>
        </div>
      </section>

      <section id="ai-designer" className="relative overflow-hidden bg-secondary py-20 md:py-30">
        <FlowerBurst originX="left" originY="top" />
        <div className="container">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
            <ScrollReveal direction="left">
              <p className="caption mb-4">Hwabelle AI Designer</p>
              <h2 className="font-serif text-display mb-6">Plan Your Flower Keepsake Before You Press</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Use the Hwabelle AI Designer to get flower preservation guidance for wedding bouquets,
                garden flowers, memorial blooms, wildflowers, and meaningful keepsakes. It helps you
                understand which flowers press best, what to prepare, and how to turn your blooms into a lasting keepsake.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {aiFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="rounded-2xl border border-border/60 bg-background/80 p-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                      <Sparkles size={18} className="text-foreground" />
                    </div>
                    <h3 className="font-serif text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <div className="bg-background p-8 md:p-10">
                <h3 className="font-serif text-xl mb-2">A clearer next step before flowers fade</h3>
                <p className="text-muted-foreground mb-6">
                  Visit the AI Designer landing page to see how it works, who it helps, and how to unlock access when you are ready.
                </p>
                <div className="flex flex-col gap-3">
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to="/designer">
                      <Sparkles size={16} className="mr-2" />
                      Explore AI Designer
                    </Link>
                  </Button>
                  <Button variant="hero-outline" size="lg" className="w-full" asChild>
                    <Link to={PRODUCT_PATH}>Shop the Flower Press Kit</Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 md:py-30">
        <div className="container">
          <ScrollReveal>
            <div className="mb-12 flex items-end justify-between">
              <div>
                <p className="caption mb-4">Resources</p>
                <h2 className="font-serif text-display">Guides for bouquet and flower preservation</h2>
              </div>
              <Link to="/blog" className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:flex">
                View all <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 gap-8 md:grid-cols-3" staggerDelay={0.15}>
            {blogPosts.map((post, index) => (
              <StaggerItem key={index}>
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-[4/3] mb-4 overflow-hidden bg-secondary">
                    <motion.img
                      src={blogImage}
                      alt={post.title}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      loading="lazy"
                    />
                  </div>
                  <p className="caption mb-2">{post.category}</p>
                  <h3 className="font-serif text-lg group-hover:underline underline-offset-4">{post.title}</h3>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <Link to="/blog" className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:hidden">
            View all resources <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="bg-background border-t border-b border-border/40 py-8">
        <CustomerStories />
      </section>

      <section className="bg-background py-16 md:py-24 border-b border-border/40">
        <CommunityHomepageModule />
      </section>

      <section className="bg-secondary py-20 md:py-30">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal className="mb-12 text-center">
              <p className="caption mb-4">FAQ</p>
              <h2 className="font-serif text-display">Frequently asked questions</h2>
            </ScrollReveal>
            <div className="divide-y divide-border space-y-0">
              {faqs.map((faq, index) => (
                <ScrollReveal key={index} delay={index * 0.1} className="py-6">
                  <h3 className="font-serif text-lg mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal className="mt-8 text-center">
              <Link to="/faq" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                View the full FAQ <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-background py-20 md:py-30">
        <FloralBorder position="all" size="md" />
        <div className="container">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-display md:text-display-lg mb-6">
              Start Your DIY Wedding Bouquet Preservation Project Today
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Shop the acrylic flower press kit, explore AI Designer, or read practical guides before you begin.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to={PRODUCT_PATH}>Shop the Flower Press Kit</Link>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <Link to="/blog">Read Resources</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Need policies or support first? Visit the{" "}
              <Link to="/shipping" className="underline underline-offset-2">
                shipping page
              </Link>
              ,{" "}
              <Link to="/returns" className="underline underline-offset-2">
                returns page
              </Link>
              , or{" "}
              <Link to="/contact" className="underline underline-offset-2">
                contact support
              </Link>
              .
            </p>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
