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

const Index = () => {
  const productHighlights = [
    {
      icon: Leaf,
      title: "Beginner-friendly flower preservation",
      description:
        "A clear acrylic flower press kit that helps you preserve wedding bouquets, garden flowers, and meaningful blooms at home.",
    },
    {
      icon: Gift,
      title: "Beautiful for keepsakes and gifting",
      description:
        "Designed for adults, crafters, gardeners, artists, and anyone creating a pressed flower keepsake or botanical gift.",
    },
    {
      icon: BookOpen,
      title: "Simple process, meaningful results",
      description:
        "Use the included layers and hardware to press flatter flowers, petals, and foliage into frame-ready botanical art.",
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
    "Flower selection tips for bouquet and garden blooms",
    "Event-aware keepsake and arrangement ideas",
    "Beginner pressing guidance and troubleshooting",
    "Layout inspiration for framed pressed flower art",
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

        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-20 sm:pb-28 md:pb-40 lg:pb-52">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 px-4"
          >
            <Button variant="hero" size="lg" className="text-sm sm:text-base" asChild>
              <Link to={PRODUCT_PATH}>Shop the Flower Press Kit</Link>
            </Button>
            <Button variant="hero-outline" size="lg" className="text-sm sm:text-base bg-background/75 backdrop-blur-sm" asChild>
              <Link to="/designer">Open the Design Assistant</Link>
            </Button>
          </motion.div>
        </div>
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
              <p className="caption mb-4">Preserve Meaningful Flowers</p>
              <h1 className="font-serif text-display md:text-display-lg mb-6">
                Preserve Meaningful Flowers Before They Fade
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                A beginner-friendly acrylic flower press kit for wedding bouquets, garden flowers,
                wildflowers, and sentimental blooms. Hwabelle helps adults, crafters, gardeners,
                and artists create pressed flower keepsakes at home.
              </p>
              <ul className="mb-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <li>Beginner-friendly</li>
                <li>Great for wedding bouquet keepsakes</li>
                <li>Designed for adults, crafters, gardeners, and artists</li>
                <li>Gift-ready botanical preservation kit</li>
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
              <p className="caption mb-4">Planning Support</p>
              <h2 className="font-serif text-display mb-6">Flower Preservation Design Assistant</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Get event-aware guidance, flower selection tips, keepsake ideas, and beginner-friendly
                pressing checklists when you are deciding what to preserve and how to arrange it.
              </p>
              <ul className="space-y-4 mb-8">
                {aiFeatures.map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Sparkles size={18} className="text-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={0.2}>
              <div className="bg-background p-8 md:p-10">
                <h3 className="font-serif text-xl mb-2">Plan your keepsake before you press</h3>
                <p className="text-muted-foreground mb-6">
                  Use the assistant to decide which blooms to save, what will press best, and how to turn them into a keepsake.
                </p>
                <Button variant="hero" size="lg" className="w-full" asChild>
                  <Link to="/designer">
                    <Sparkles size={16} className="mr-2" />
                    Open the Design Assistant
                  </Link>
                </Button>
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
              Preserve your bouquet, frame a garden memory, and start at home
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Shop the acrylic flower press kit, explore the design assistant, or read practical guides before you begin.
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
