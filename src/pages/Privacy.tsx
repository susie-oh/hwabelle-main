import Layout from "@/components/layout/Layout";

const Privacy = () => {
  return (
    <Layout>
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <p className="caption mb-4">Policies</p>
            <h1 className="font-serif text-display-lg mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: March 31, 2026</p>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <p>
                HWABELLE ("we," "us," or "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, share, and protect your information when you visit or make a purchase from www.hwabelle.shop (the "Site").
              </p>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">1. Information We Collect</h2>
                <p>We may collect the following categories of information:</p>
                
                <h3 className="font-medium text-foreground mt-4 mb-2">A. Information You Provide</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Billing address</li>
                  <li>Shipping address</li>
                  <li>Order details</li>
                  <li>Messages you send to us through contact forms, email, or customer support</li>
                </ul>

                <h3 className="font-medium text-foreground mt-4 mb-2">B. Information Collected Automatically</h3>
                <p>When you browse our Site, we may automatically collect:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device type</li>
                  <li>Pages visited</li>
                  <li>Referral URLs</li>
                  <li>Usage data</li>
                  <li>Cookie and session data</li>
                </ul>

                <h3 className="font-medium text-foreground mt-4 mb-2">C. Payment Information</h3>
                <p>
                  Payments may be processed through third-party payment processors. We do not store full payment card details on our servers unless explicitly stated otherwise by the payment provider.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">2. How We Use Your Information</h2>
                <p>We use personal information to:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Process and fulfill orders</li>
                  <li>Ship products and provide order updates</li>
                  <li>Respond to customer service requests</li>
                  <li>Handle returns, refunds, or disputes</li>
                  <li>Prevent fraud and misuse</li>
                  <li>Improve the Site, products, and customer experience</li>
                  <li>Maintain security and business operations</li>
                  <li>Comply with legal, tax, and regulatory obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">3. How We Share Information</h2>
                <p>We do not sell your personal information.</p>
                <p className="mt-3">We may share your information only where necessary with:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Payment processors</li>
                  <li>Shipping and fulfillment providers</li>
                  <li>Ecommerce platform providers</li>
                  <li>Website hosting providers</li>
                  <li>Customer support tools</li>
                  <li>Analytics and fraud prevention services</li>
                  <li>Government authorities, regulators, or law enforcement when legally required</li>
                </ul>
                <p className="mt-3">These parties receive only the information necessary to perform their services.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">4. Fulfillment and Shipping Information</h2>
                <p>
                  If you place an order with us, we may share shipping-related personal information such as recipient name, shipping address, phone number, and email address where required with approved fulfillment and shipping partners to process, pack, ship, and support delivery of your order.
                </p>
                <p className="mt-3">
                  This information is used only for legitimate order fulfillment, customer support, fraud prevention, and legal compliance.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">5. Data Retention</h2>
                <p>We retain personal information only for as long as reasonably necessary to:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Complete and support your order</li>
                  <li>Provide customer service</li>
                  <li>Process returns, refunds, or disputes</li>
                  <li>Maintain required business and tax records</li>
                  <li>Comply with applicable laws</li>
                </ul>
                <p className="mt-3">
                  Where feasible, shipping-related personal information is deleted, anonymized, or securely archived after it is no longer needed for these purposes.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">6. Data Security</h2>
                <p>We use reasonable administrative, technical, and organizational safeguards to protect personal information, including:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>HTTPS and encrypted transmission where supported</li>
                  <li>Access controls and least-privilege access</li>
                  <li>Monitoring for unauthorized access</li>
                  <li>Secure storage practices</li>
                  <li>Vendor and platform protections where applicable</li>
                </ul>
                <p className="mt-3">
                  No method of transmission over the internet or storage system is completely secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">7. Cookies and Similar Technologies</h2>
                <p>We may use cookies, pixels, and similar technologies to:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Keep the Site functioning properly</li>
                  <li>Remember preferences</li>
                  <li>Understand traffic and usage patterns</li>
                  <li>Improve performance and customer experience</li>
                </ul>
                <p className="mt-3">You can adjust cookie settings through your browser.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">8. Your Rights</h2>
                <p>Depending on your location, you may have rights to:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Request access to your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of certain information</li>
                  <li>Object to or limit certain processing where applicable</li>
                </ul>
                <p className="mt-3">To make a request, contact us using the details below.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">9. Third-Party Services and Links</h2>
                <p>
                  Our Site may contain links to third-party websites or use third-party services. We are not responsible for the privacy or security practices of third parties.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">10. Children's Privacy</h2>
                <p>
                  Our Site is not intended for children under 13, and we do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">11. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Any updates will be posted on this page with a revised "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">12. Contact Us</h2>
                <p>If you have questions about this Privacy Policy or our data practices, contact us at:</p>
                <div className="mt-3">
                  <p>HWABELLE</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
