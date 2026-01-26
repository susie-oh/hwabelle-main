import Layout from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <p className="caption mb-4">Policies</p>
            <h1 className="font-serif text-display-lg mb-8">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: [ADD DATE]</p>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Agreement to Terms</h2>
                <p>
                  By accessing and using the Hwabelle website, you agree to be bound by these 
                  Terms of Service. If you do not agree with any part of these terms, please 
                  do not use our website.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Use of Website</h2>
                <p>
                  This website is provided for informational purposes and to connect you with 
                  our products. You agree to use this website only for lawful purposes and in 
                  accordance with these terms.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Products and Purchases</h2>
                <p>
                  All product purchases are made through Amazon and are subject to Amazon's 
                  terms of service. We are not responsible for transaction processing, 
                  fulfillment, or any disputes related to purchases made on Amazon.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Intellectual Property</h2>
                <p>
                  All content on this website, including text, images, logos, and design, is 
                  the property of Hwabelle and is protected by copyright and trademark laws. 
                  You may not reproduce, distribute, or use our content without permission.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Disclaimer</h2>
                <p>
                  This website and its content are provided "as is" without warranties of any 
                  kind. We do not guarantee the accuracy, completeness, or usefulness of any 
                  information on this website.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Limitation of Liability</h2>
                <p>
                  Hwabelle shall not be liable for any indirect, incidental, special, or 
                  consequential damages arising from your use of this website or our products.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Changes will be 
                  posted on this page with an updated revision date.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Contact</h2>
                <p>
                  For questions about these terms, please contact us at [ADD EMAIL].
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
