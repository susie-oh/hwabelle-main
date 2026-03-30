import Layout from "@/components/layout/Layout";

const DataProtection = () => {
  return (
    <Layout>
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <p className="caption mb-4">Policies</p>
            <h1 className="font-serif text-display-lg mb-8">Data Protection Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: March 31, 2026</p>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <p>
                HWABELLE is committed to protecting customer information and limiting the collection, use, retention, and sharing of personal data to what is necessary for business operations, order fulfillment, customer service, fraud prevention, and legal compliance.
              </p>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">1. Purpose</h2>
                <p>
                  This Data Protection Policy explains how we protect customer data processed through our website, ecommerce systems, fulfillment workflows, and support operations.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">2. Data Minimization</h2>
                <p>We collect and process only the personal information reasonably necessary to:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Accept and process customer orders</li>
                  <li>Fulfill and deliver purchases</li>
                  <li>Provide customer support and order updates</li>
                  <li>Process returns, refunds, or disputes</li>
                  <li>Detect fraud, abuse, or unauthorized activity</li>
                  <li>Comply with legal and tax obligations</li>
                </ul>
                <p className="mt-3">We do not intentionally collect personal data that is not needed for these purposes.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">3. Access Controls</h2>
                <p>Access to customer data is restricted to authorized personnel who require access for legitimate business purposes.</p>
                <p className="mt-3">We apply the following principles:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Unique user accounts</li>
                  <li>Least-privilege access</li>
                  <li>Role-based access where possible</li>
                  <li>Prompt removal of access when no longer needed</li>
                  <li>Periodic review of privileged access</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">4. Authentication and Account Protection</h2>
                <p>We use reasonable account protection measures such as:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Strong passwords</li>
                  <li>Multi-factor authentication where supported</li>
                  <li>Restricted administrative access</li>
                  <li>Secure credential storage</li>
                  <li>Monitoring for suspicious login or access activity</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">5. Encryption and Secure Transmission</h2>
                <p>We use appropriate safeguards to protect customer information, including:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>HTTPS and encrypted transmission where supported</li>
                  <li>Encrypted storage or encrypted provider infrastructure where applicable</li>
                  <li>Secure handling of credentials and sensitive system data</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">6. Fulfillment and Shipping Data</h2>
                <p>For order fulfillment, we may share shipping-related personal information such as:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Recipient name</li>
                  <li>Shipping address</li>
                  <li>Phone number</li>
                  <li>Email address where required</li>
                </ul>
                <p className="mt-3">This information is shared only with approved service providers and fulfillment partners for fulfillment, delivery support, fraud prevention, and legal compliance.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">7. Data Retention</h2>
                <p>We retain customer data only for as long as necessary for:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Order fulfillment</li>
                  <li>Customer support</li>
                  <li>Returns, refunds, and disputes</li>
                  <li>Tax, accounting, and legal obligations</li>
                  <li>Fraud prevention and operational continuity</li>
                </ul>
                <p className="mt-3">Where feasible, shipping-related personal information is deleted, anonymized, or securely archived once no longer required.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">8. Logging and Monitoring</h2>
                <p>We maintain reasonable logging and monitoring practices to help detect:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Unauthorized access attempts</li>
                  <li>Suspicious account activity</li>
                  <li>Service misuse</li>
                  <li>Operational issues affecting customer data</li>
                </ul>
                <p className="mt-3">Logs are retained and reviewed according to internal operational and security practices.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">9. Service Providers</h2>
                <p>
                  We may use third-party providers for hosting, ecommerce, payments, shipping, analytics, security, and customer support. These providers are expected to process data only as needed to provide their contracted services.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">10. Backup and Recovery</h2>
                <p>
                  We maintain reasonable backup and recovery practices, subject to the capabilities of our hosting and service providers, to reduce the risk of accidental data loss and support continuity.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">11. Incident Response</h2>
                <p>
                  If we become aware of unauthorized access, misuse, loss, or disclosure of customer information, we will investigate, take reasonable steps to contain and remediate the issue, and provide notice where required by law.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">12. Policy Updates</h2>
                <p>
                  We may update this Data Protection Policy from time to time. Updates will be posted on this page with a revised "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">13. Contact</h2>
                <p>For questions about our data protection practices, contact:</p>
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

export default DataProtection;
