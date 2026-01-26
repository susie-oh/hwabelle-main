import Layout from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <p className="caption mb-4">Policies</p>
            <h1 className="font-serif text-display-lg mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: [ADD DATE]</p>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Introduction</h2>
                <p>
                  Hwabelle ("we," "our," or "us") respects your privacy and is committed to 
                  protecting your personal data. This privacy policy explains how we collect, 
                  use, and safeguard your information when you visit our website.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Information We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Contact information (name, email address) when you sign up for our newsletter</li>
                  <li>Information you provide when contacting us</li>
                  <li>Usage data and analytics about how you interact with our website</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Send you newsletters and marketing communications (with your consent)</li>
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Improve our website and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Third-Party Services</h2>
                <p>
                  Our products are sold through Amazon. When you make a purchase, you are 
                  subject to Amazon's privacy policy. We do not have access to your payment 
                  information or Amazon account details.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Cookies</h2>
                <p>
                  We use cookies and similar technologies to analyze website traffic and 
                  improve your experience. You can control cookie settings through your 
                  browser preferences.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Your Rights</h2>
                <p>
                  You have the right to access, correct, or delete your personal data. 
                  To exercise these rights or unsubscribe from our newsletter, please 
                  contact us at [ADD EMAIL].
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Contact</h2>
                <p>
                  For privacy-related questions, please contact us at [ADD EMAIL].
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
