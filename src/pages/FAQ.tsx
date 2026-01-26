import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "Product & Use",
    faqs: [
      {
        q: "What flowers work best for pressing?",
        a: "Flat, single-layer flowers like pansies, violas, cosmos, and ferns work beautifully. Thicker flowers like roses can be pressed too—try separating individual petals for best results."
      },
      {
        q: "How long does it take to press flowers?",
        a: "Most flowers take 2-4 weeks to fully dry and flatten. Thicker specimens may need additional time. Check weekly and replace damp blotting paper as needed."
      },
      {
        q: "How do I replace the blotting paper?",
        a: "Simply unscrew the press, carefully remove the old paper, and replace with fresh sheets. We recommend acid-free blotting paper for best preservation."
      },
      {
        q: "Can I press leaves and other botanicals?",
        a: "Absolutely! Ferns, leaves, herbs, and even small grasses press beautifully. The press works for any flat botanical specimen."
      }
    ]
  },
  {
    title: "Ordering & Shipping",
    faqs: [
      {
        q: "Where can I purchase the Flower Press Kit?",
        a: "The Hwabelle Flower Press Kit is currently available exclusively on Amazon. Click the 'Buy on Amazon' button to order."
      },
      {
        q: "How long does shipping take?",
        a: "Shipping is fulfilled by Amazon. Standard delivery typically takes 2-5 business days depending on your location."
      },
      {
        q: "Do you ship internationally?",
        a: "International availability depends on Amazon's shipping options for your region. Please check Amazon for details."
      }
    ]
  },
  {
    title: "Gifting",
    faqs: [
      {
        q: "Is the kit ready for gifting?",
        a: "Yes! Each Flower Press Kit comes in elegant, minimal packaging that's perfect for gifting. No additional wrapping needed."
      },
      {
        q: "Can I include a gift message?",
        a: "Gift messaging is available through Amazon at checkout. You can also opt for gift wrapping if available in your region."
      }
    ]
  },
  {
    title: "Returns & Support",
    faqs: [
      {
        q: "What is the return policy?",
        a: "Returns are handled through Amazon's return policy. Most items can be returned within 30 days of delivery."
      },
      {
        q: "How do I contact customer support?",
        a: "For product questions, reach out to us at [ADD EMAIL]. For order-related inquiries, please contact Amazon customer service."
      }
    ]
  }
];

const FAQ = () => {
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
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12 last:mb-0">
                <h2 className="font-serif text-heading mb-6">{category.title}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`} className="border-divider">
                      <AccordionTrigger className="text-left font-normal hover:no-underline py-5">
                        <span className="font-serif text-lg">{faq.q}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.a}
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
