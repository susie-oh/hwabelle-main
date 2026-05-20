import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Mail, Instagram, Facebook, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name,
          email: formData.email,
          message: formData.message
        }]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Seo
        title="Contact Hwabelle | Flower Press Kit Support"
        description="Contact Hwabelle for flower pressing questions, bouquet preservation help, product details, and customer support."
        path="/contact"
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      {/* Header */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-2xl">
            <p className="caption mb-4">Contact</p>
            <h1 className="font-serif text-display-lg mb-4">Get in Touch</h1>
            <p className="text-muted-foreground text-lg">
              Have a question or just want to say hello? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl mx-auto">
            {/* Form */}
            <div>
              <h2 className="font-serif text-heading mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button variant="hero" size="lg" type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </div>

            {/* Info */}
            <div>
              <h2 className="font-serif text-heading mb-6">Other Ways to Reach Us</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm tracking-widest uppercase mb-3 text-muted-foreground">Email</h3>
                  <a 
                    href="mailto:support@hwabelle.shop" 
                    className="flex items-center gap-3 text-foreground hover:underline underline-offset-4"
                  >
                    <Mail size={18} />
                    support@hwabelle.shop
                  </a>
                </div>

                <div>
                  <h3 className="text-sm tracking-widest uppercase mb-3 text-muted-foreground">Social</h3>
                  <div className="flex gap-4">
                    <a 
                      href="#" 
                      className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                    <a 
                      href="#" 
                      className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook size={20} />
                    </a>
                  </div>
                </div>

                <div className="pt-8 border-t border-divider">
                  <h3 className="text-sm tracking-widest uppercase mb-3 text-muted-foreground">Response Time</h3>
                  <p className="text-muted-foreground">
                    We typically respond within 1-2 business days. For order-related inquiries, 
                    please contact Amazon customer service directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
