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
                      href="https://www.instagram.com/hwabelle/?hl=en" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                    <a 
                      href="https://www.tiktok.com/@hwabelle.shop" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
                      aria-label="TikTok"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tiktok"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                    </a>
                    <a 
                      href="https://www.pinterest.com/hwabelle/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
                      aria-label="Pinterest"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pinterest"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.25 2.67 7.82 6.36 9.24-.09-.79-.17-2 .03-2.87.19-.79 1.24-5.26 1.24-5.26s-.31-.64-.31-1.58c0-1.48.86-2.59 1.93-2.59.91 0 1.35.68 1.35 1.5 0 .92-.58 2.3-.88 3.58-.25 1.07.54 1.94 1.59 1.94 1.91 0 3.38-2.02 3.38-4.93 0-2.58-1.85-4.38-4.5-4.38-3.07 0-4.87 2.3-4.87 4.68 0 .93.36 1.93.8 2.46.09.11.1.2.07.31-.08.33-.26 1.06-.3 1.2-.05.21-.17.25-.4.15-1.48-.69-2.4-2.85-2.4-4.59 0-3.74 2.72-7.18 7.84-7.18 4.12 0 7.32 2.94 7.32 6.86 0 4.1-2.58 7.4-6.17 7.4-1.2 0-2.34-.63-2.73-1.37l-.75 2.85c-.27 1.04-1 2.35-1.49 3.14C10.22 21.78 11.09 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>
                    </a>
                    <a 
                      href="https://www.youtube.com/@Hwabelle" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground hover:text-muted-foreground transition-colors"
                      aria-label="YouTube"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><polygon points="10 15 15 12 10 9" /></svg>
                    </a>
                    <a 
                      href="https://www.facebook.com/hwabelle/" 
                      target="_blank"
                      rel="noopener noreferrer"
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
