import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Mail, Instagram, Facebook } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Contact form:", formData);
  };

  return (
    <Layout>
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
                  />
                </div>
                <Button variant="hero" size="lg" type="submit" className="w-full">
                  Send Message
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
                    href="mailto:[ADD EMAIL]" 
                    className="flex items-center gap-3 text-foreground hover:underline underline-offset-4"
                  >
                    <Mail size={18} />
                    [ADD EMAIL]
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
