import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import NewsletterForm from "@/components/sections/NewsletterForm";
import ScrollReveal from "@/components/animations/ScrollReveal";
import StaggerContainer, { StaggerItem } from "@/components/animations/StaggerContainer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Gift, BookOpen, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-flower-press.jpg";
import lifestyleImage from "@/assets/lifestyle-pressing.jpg";
import pressedFlowersImage from "@/assets/pressed-flowers-collection.jpg";
import blogImage from "@/assets/blog-botanical-art.jpg";

const Index = () => {
  const productHighlights = [
    {
      icon: Leaf,
      title: "Sustainable Materials",
      description: "Crafted from responsibly sourced wood and durable hardware built to last."
    },
    {
      icon: Gift,
      title: "Giftable Design",
      description: "Beautifully presented and ready to give for any occasion."
    },
    {
      icon: BookOpen,
      title: "Detailed Instructions",
      description: "Step-by-step guide included to help you achieve perfect results."
    }
  ];

  const steps = [
    { number: "01", title: "Pick", description: "Select fresh flowers and foliage at their peak." },
    { number: "02", title: "Press", description: "Arrange between absorbent paper and tighten." },
    { number: "03", title: "Preserve", description: "Wait 2-4 weeks for perfect preservation." },
    { number: "04", title: "Create", description: "Use in art, cards, or keepsake displays." }
  ];

  const aiFeatures = [
    "Identify plants from photos instantly",
    "Receive personalized care guides",
    "Get design suggestions for events",
    "Find options that fit your budget"
  ];

  const blogPosts = [
    { title: "The Art of Pressing Bridal Bouquets", category: "Preservation Tips", slug: "pressing-bridal-bouquets" },
    { title: "Best Flowers for First-Time Pressers", category: "Flower Pressing", slug: "best-flowers-beginners" },
    { title: "Creating Botanical Wall Art", category: "DIY", slug: "botanical-wall-art" }
  ];

  const faqs = [
    { q: "How long does it take to press flowers?", a: "Most flowers take 2-4 weeks to fully dry and flatten, depending on thickness and moisture content." },
    { q: "What flowers work best?", a: "Flat flowers like pansies, ferns, and daisies work beautifully. Thicker flowers can be pressed but may take longer." },
    { q: "Is the kit ready for gifting?", a: "Yes, each kit comes in elegant, minimal packaging perfect for gifting." },
    { q: "Can I replace the blotting paper?", a: "Absolutely. We recommend replacing papers between uses for best results." }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Hwabelle Flower Press Kit with pressed flowers" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/30" />
        </div>
        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-display-lg md:text-display-xl text-foreground mb-6">
              Preserve nature's beauty, one bloom at a time.
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-lg md:text-xl text-foreground/80 mb-10 leading-relaxed"
            >
              A thoughtfully crafted flower press for gardeners, artists, and anyone who treasures nature's fleeting moments.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="hero" size="xl" asChild>
                <a href="[ADD AMAZON LINK]" target="_blank" rel="noopener noreferrer">
                  Shop the Kit
                </a>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <a href="#ai-waitlist">
                  Join AI Waitlist
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="py-20 md:py-30 bg-background">
        <div className="container">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {productHighlights.map((highlight, index) => (
              <StaggerItem key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                  <highlight.icon size={28} strokeWidth={1.5} className="text-foreground" />
                </div>
                <h3 className="font-serif text-xl mb-3">{highlight.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{highlight.description}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <div className="divider" />
      </div>

      {/* How It Works */}
      <section className="py-20 md:py-30 bg-background">
        <div className="container">
          <ScrollReveal className="text-center mb-16">
            <p className="caption mb-4">The Process</p>
            <h2 className="font-serif text-display mb-4">How it works</h2>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6" staggerDelay={0.15}>
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

      {/* Lifestyle Image Band */}
      <section className="py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <ScrollReveal direction="left" className="aspect-square md:aspect-auto overflow-hidden">
            <motion.img 
              src={lifestyleImage} 
              alt="Hands pressing flowers" 
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6 }}
            />
          </ScrollReveal>
          <ScrollReveal direction="right" className="aspect-square md:aspect-auto overflow-hidden">
            <motion.img 
              src={pressedFlowersImage} 
              alt="Collection of pressed botanical specimens" 
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.6 }}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* AI Designer Assistant */}
      <section id="ai-waitlist" className="py-20 md:py-30 bg-secondary">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <ScrollReveal direction="left">
              <p className="caption mb-4">Coming Soon</p>
              <h2 className="font-serif text-display mb-6">AI Designer Assistant</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                An intelligent companion for your botanical journey. Get personalized recommendations, identify plants, and discover design possibilities.
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
                <h3 className="font-serif text-xl mb-2">Be the first to know</h3>
                <p className="text-muted-foreground mb-6">Join the waitlist for early access.</p>
                <NewsletterForm variant="ai-waitlist" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 md:py-30 bg-background">
        <div className="container">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="caption mb-4">From the Journal</p>
                <h2 className="font-serif text-display">Stories & Guides</h2>
              </div>
              <Link to="/blog" className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                View all <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {blogPosts.map((post, index) => (
              <StaggerItem key={index}>
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-[4/3] mb-4 overflow-hidden bg-secondary">
                    <motion.img 
                      src={blogImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="caption mb-2">{post.category}</p>
                  <h3 className="font-serif text-lg group-hover:underline underline-offset-4">{post.title}</h3>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <Link to="/blog" className="md:hidden flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors">
            View all posts <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 md:py-30 bg-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal className="text-center mb-12">
              <p className="caption mb-4">Questions</p>
              <h2 className="font-serif text-display">Frequently Asked</h2>
            </ScrollReveal>
            <div className="space-y-0 divide-y divide-border">
              {faqs.map((faq, index) => (
                <ScrollReveal key={index} delay={index * 0.1} className="py-6">
                  <h3 className="font-serif text-lg mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal className="text-center mt-8">
              <Link to="/faq" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                View all questions <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-30 bg-background">
        <div className="container">
          <ScrollReveal className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-display md:text-display-lg mb-6">
              Start your first press
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Transform fleeting blooms into lasting treasures.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Button variant="hero" size="xl" asChild>
                <a href="[ADD AMAZON LINK]" target="_blank" rel="noopener noreferrer">
                  Buy on Amazon
                </a>
              </Button>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
