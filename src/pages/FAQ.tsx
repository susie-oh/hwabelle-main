import Layout from "@/components/layout/Layout";
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

  // Group FAQs by category
  const groupedFaqs = faqs?.reduce((acc, faq) => {
    const category = faq.category || "General";
    if (!acc[category]) acc[category] = [];
    acc[category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-2xl">
            <p className="caption mb-4">Support</p>
            <h1 className="font-serif text-display-lg mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions about our products and process.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !groupedFaqs || Object.keys(groupedFaqs).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No FAQs available at the moment.
              </div>
            ) : (
              Object.entries(groupedFaqs).map(([category, categoryFaqs], categoryIndex) => (
                <div key={categoryIndex} className="mb-12 last:mb-0">
                  <h2 className="font-serif text-heading mb-6">{category}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {categoryFaqs.map((faq, faqIndex) => (
                      <AccordionItem key={faq.id} value={`${categoryIndex}-${faqIndex}`} className="border-divider">
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
              ))
            )}
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
