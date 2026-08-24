import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
}

/* ── Categorised hardcoded FAQs ───────────────────────────────────────────────
   Always rendered on-page AND fed into JSON-LD schema so the /faq page is
   useful even if Supabase is slow or the admin hasn't added entries yet.
   ────────────────────────────────────────────────────────────────────────── */

interface StaticFaq {
  question: string;
  answer: string;
}

const staticFaqsByCategory: Record<string, StaticFaq[]> = {
  "Product & Pressing": [
    {
      question: "Can I use the Hwabelle flower press kit to press my bridal bouquet?",
      answer:
        "Yes! The Hwabelle flower press kit is designed specifically for preserving wedding and bridal bouquets. Its large clear acrylic plates accommodate full-size blooms like roses, peonies, and hydrangeas, letting you turn your special-day flowers into lasting keepsakes.",
    },
    {
      question: "What are the advantages of a clear acrylic flower press over a wooden one?",
      answer:
        "Clear acrylic lets you monitor drying progress without opening the press, which reduces the risk of disturbing delicate petals. It is also moisture-resistant, easier to clean, and provides even pressure distribution for consistently flat, vibrant results.",
    },
    {
      question: "How long does it take to dry flowers in a Hwabelle press?",
      answer:
        "Most flowers dry within 2–4 weeks depending on petal thickness and moisture content. Thinner blooms like pansies and violets can be ready in as little as 10 days, while thicker flowers such as roses may take the full 4 weeks for best results.",
    },
    {
      question: "What flowers are best for pressing?",
      answer:
        "Flatter blooms like pansies, violets, daisies, cosmos, and ferns press beautifully. Thinner petals and leaves yield the most vibrant results. Thicker flowers such as roses and peonies can still be pressed — simply separate them into individual petals or smaller sections before placing them in the kit.",
    },
    {
      question: "Can I press succulents, herbs, or non-flower foliage?",
      answer:
        "Absolutely. Herbs like lavender, rosemary sprigs, and sage leaves press well and retain their scent. Ferns, eucalyptus, and thin succulents also produce stunning results. Just allow extra drying time for any plant material with higher moisture content.",
    },
    {
      question: "How do I keep the natural color of my pressed flowers?",
      answer:
        "Start pressing flowers as soon as possible after cutting — freshness is the single biggest factor in color retention. Keep the press in a cool, dry spot away from direct sunlight. Replacing the blotting paper after the first few days also helps wick moisture faster and preserve pigment.",
    },
  ],

  "Getting Started": [
    {
      question: "Is this flower press kit beginner-friendly?",
      answer:
        "Yes. The kit is designed for complete beginners, crafters, gardeners, and anyone who wants a simple way to preserve flowers at home. No special skills or prior experience required — just arrange, press, and wait.",
    },
    {
      question: "What is included in the Hwabelle flower press kit?",
      answer:
        "Each kit includes two clear acrylic press sizes (large and small), blotting paper sheets for drying support, sponge paper layers for moisture management, cardstock dry boards for stable layering, durable brass bolts and hardware, and a canvas storage bag to keep everything organized between projects.",
    },
    {
      question: "Do I need any additional tools or materials?",
      answer:
        "No. Everything you need to start pressing flowers is included in the box. For ongoing projects, you may want to pick up extra blotting paper refills once your originals are well-used, but this is not required right away.",
    },
    {
      question: "How many flowers can I press at the same time?",
      answer:
        "Each press can hold several layers of flowers separated by blotting paper, so you can press multiple blooms in a single session. The exact number depends on flower size and thickness — typically 6–12 stems per press load is comfortable without overcrowding.",
    },
  ],

  "Shipping & Orders": [
    {
      question: "How long does shipping take?",
      answer:
        "Standard domestic orders typically ship within 1–2 business days and arrive within 3–7 business days depending on your location. Expedited shipping options are available at checkout for faster delivery.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently we ship within the United States. We are actively working on expanding to international markets. Sign up for our newsletter to be the first to know when international shipping becomes available.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day satisfaction guarantee. If you are not happy with your flower press kit for any reason, contact us within 30 days of delivery for a full refund or exchange. The product should be in its original condition with all components included.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes. Once your order ships, you will receive a confirmation email with a tracking number and link so you can follow your package every step of the way.",
    },
  ],

  "Care & Storage": [
    {
      question: "How should I store my pressed flowers after they are done?",
      answer:
        "Store finished pressed flowers flat between sheets of parchment or wax paper inside a book or archival folder. Keep them in a cool, dry place away from direct sunlight and humidity. When stored properly, pressed flowers can last for many years and even decades.",
    },
    {
      question: "How do I clean the acrylic plates?",
      answer:
        "Wipe the acrylic plates gently with a soft, damp cloth. Avoid abrasive cleaners or rough sponges that could scratch the surface. For stubborn residue, a small amount of mild dish soap and warm water works perfectly.",
    },
    {
      question: "Can I frame my pressed flowers? Any tips?",
      answer:
        "Yes — framing is one of the most popular ways to display pressed flowers. Use a shadow box or a frame with a glass front to protect the petals. Position flowers on acid-free card stock or watercolor paper, and use a small dot of archival glue to hold each piece in place. Avoid hanging frames in direct sunlight to prevent fading over time.",
    },
    {
      question: "How long do pressed flowers last?",
      answer:
        "With proper pressing and storage, dried flowers can retain their shape and color for 5–10 years or longer. Protecting them from moisture, heat, and UV light is the key to longevity. Sealed frames and archival materials help extend their life even further.",
    },
  ],

  "AI Designer": [
    {
      question: "What is the Hwabelle AI Designer?",
      answer:
        "The Hwabelle AI Designer is a free conversational tool that helps you plan your pressed flower projects. You can describe your event (a wedding, memorial, garden harvest) and it will suggest which flowers to press, layout ideas for frames and keepsakes, and step-by-step guidance tailored to your situation.",
    },
    {
      question: "Is the AI Designer free to use?",
      answer:
        "Yes. The AI Designer is completely free for all Hwabelle customers and visitors. There are no hidden fees, subscriptions, or usage limits. Simply visit the Designer page and start chatting.",
    },
    {
      question: "What kind of projects can the AI Designer help with?",
      answer:
        "The AI Designer can help with wedding bouquet preservation layouts, memorial flower keepsakes, seasonal botanical art ideas, gift planning for flower lovers, and beginner pressing guidance. It adapts its suggestions based on the flowers and occasion you describe.",
    },
  ],

  "Gifting": [
    {
      question: "Does the Hwabelle kit make a good gift?",
      answer:
        "Absolutely. The flower press kit is a thoughtful, unique gift for brides-to-be, gardeners, crafters, nature lovers, and anyone who appreciates handmade keepsakes. It arrives in attractive packaging that is ready to give.",
    },
    {
      question: "Can I include a gift message with my order?",
      answer:
        "Yes. During checkout you can add a personalized gift message that will be printed on a card and included inside the package. Just look for the gift message option on the checkout page.",
    },
    {
      question: "Do you offer gift wrapping?",
      answer:
        "The kit's packaging is already designed to feel gift-ready with a premium unboxing experience. We do not currently offer additional gift wrapping, but many customers tell us the presentation looks beautiful as-is.",
    },
    {
      question: "What occasions is this kit best for?",
      answer:
        "The Hwabelle kit is perfect for bridal showers, weddings, birthdays, Mother's Day, anniversaries, housewarming gifts, teacher appreciation, or simply as a self-care craft project. It is a meaningful gift for anyone who wants to preserve flowers and create something lasting by hand.",
    },
  ],
};

// Flatten all static FAQs for JSON-LD schema
const allStaticFaqs: StaticFaq[] = Object.values(staticFaqsByCategory).flat();

const FAQ = () => {
  const { data: faqs, isLoading } = useQuery({
    queryKey: ["public-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as FAQ[];
    },
  });

  // Group Supabase FAQs by category
  const groupedSupabaseFaqs = faqs?.reduce((acc, faq) => {
    const category = faq.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  // Merge static + dynamic FAQs for JSON-LD schema
  const schemaFaqItems = [
    ...allStaticFaqs,
    ...(faqs?.map((faq) => ({ question: faq.question, answer: faq.answer })) ?? []),
  ];

  return (
    <Layout>
      <Seo
        title="Flower Press Kit FAQ | Hwabelle"
        description="Find answers about Hwabelle flower press kits, bouquet preservation, beginner flower pressing, shipping, care, AI Designer, gifting, and common support questions."
        path="/faq"
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          faqSchema(schemaFaqItems),
        ]}
      />

      {/* Header */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-2xl">
            <p className="caption mb-4">Support</p>
            <h1 className="font-serif text-display-lg mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about our flower press kits, ordering, care, the AI Designer, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Static FAQ Sections – always visible */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {Object.entries(staticFaqsByCategory).map(([category, items], catIdx) => (
              <div key={category} className="mb-12 last:mb-0">
                <h2 className="font-serif text-heading mb-6">{category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {items.map((faq, faqIdx) => (
                    <AccordionItem
                      key={`static-${catIdx}-${faqIdx}`}
                      value={`static-${catIdx}-${faqIdx}`}
                      className="border-divider"
                    >
                      <AccordionTrigger className="text-left font-normal hover:no-underline py-5">
                        <span className="font-serif text-lg">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}

            {/* Dynamic Supabase FAQs – render below static categories */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
            {!isLoading &&
              groupedSupabaseFaqs &&
              Object.keys(groupedSupabaseFaqs).length > 0 &&
              Object.entries(groupedSupabaseFaqs).map(([category, categoryFaqs], categoryIndex) => (
                <div key={`db-${categoryIndex}`} className="mb-12 last:mb-0">
                  <h2 className="font-serif text-heading mb-6">{category}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {categoryFaqs.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faq.id}
                        value={`db-${categoryIndex}-${faqIndex}`}
                        className="border-divider"
                      >
                        <AccordionTrigger className="text-left font-normal hover:no-underline py-5">
                          <span className="font-serif text-lg">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-serif text-display mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-8">
              We're here to help. Reach out and we'll get back to you as soon as possible.
            </p>
            <Button variant="hero" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
