import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";

const DataProtection = () => {
  return (
    <Layout>
      <Seo
        title="Data Protection Policy | Hwabelle"
        description="Review Hwabelle’s data protection policy covering access controls, encryption, retention, incident response, and partner data handling."
        path="/data-protection"
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Data Protection Policy", path: "/data-protection" },
          ]),
        ]}
      />
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <p className="caption mb-4">Policies</p>
            <h1 className="font-serif text-display-lg mb-8">Data Protection Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: April 9, 2026</p>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <p>
                HWABELLE is committed to protecting customer information and the information of our marketplace and API partners. We limit the collection, use, retention, and sharing of personal data to what is strictly necessary for business operations, order fulfillment, customer service, fraud prevention, and legal compliance. This policy applies to all information processed through our website, ecommerce systems, third-party integrations (including Amazon Selling Partner API), fulfillment workflows, and support operations.
              </p>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">1. Purpose and Scope</h2>
                <p>
                  This Data Protection Policy describes the technical, administrative, and organizational safeguards we maintain to protect personally identifiable information ("PII") and confidential data—including information received through marketplace partner APIs such as the Amazon Selling Partner API ("Amazon Information"). All personnel, contractors, and authorized systems that process, store, or transmit such data are bound by the requirements of this policy.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">2. Data Minimization</h2>
                <p>We collect and process only the personal information reasonably necessary to:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Accept and process customer orders</li>
                  <li>Fulfill and deliver purchases via our fulfillment partners</li>
                  <li>Provide customer support and order status updates</li>
                  <li>Process returns, refunds, or disputes</li>
                  <li>Detect fraud, abuse, or unauthorized activity</li>
                  <li>Comply with legal and tax obligations</li>
                </ul>
                <p className="mt-3">
                  We do not collect, store, or process personal data beyond what is required for the purposes listed above. Information received from marketplace partners (such as Amazon) is used solely for the specific, approved purposes described in our integration agreements and is never repurposed for unrelated activities such as marketing, profiling, or resale.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">3. Access Controls and Identity Management</h2>
                <p>Access to customer data, API credentials, and marketplace information is restricted to authorized personnel who require access for legitimate, defined business purposes.</p>
                <p className="mt-3">We enforce the following access management principles:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Unique, non-shared user accounts for all personnel</li>
                  <li>Least-privilege access — users receive only the minimum permissions necessary for their role</li>
                  <li>Role-based access control (RBAC) for all systems that store or process PII</li>
                  <li>Multi-factor authentication (MFA) on systems that store confidential data, API secrets, or PII</li>
                  <li>Prompt revocation of access upon role change or departure</li>
                  <li>Periodic review of privileged accounts and access rights (at minimum quarterly)</li>
                  <li>Segregation of duties for critical operations such as credential management and deployment</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">4. Authentication and Account Protection</h2>
                <p>We use robust account protection measures including:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Strong password requirements (minimum length, complexity, expiration policies)</li>
                  <li>Multi-factor authentication (MFA) for all administrative and infrastructure accounts</li>
                  <li>Restricted administrative access with audit logging</li>
                  <li>Encrypted credential storage (API keys, secrets, and tokens are stored exclusively in encrypted environment variables and secret management systems — never in source code, client-side code, or public repositories)</li>
                  <li>Monitoring and alerting for suspicious login activity, brute-force attempts, and anomalous access patterns</li>
                  <li>Automatic session timeout for inactive sessions</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">5. Encryption Standards</h2>
                <p>We employ industry-standard encryption to protect customer information and partner data:</p>
                
                <h3 className="font-medium text-foreground mt-4 mb-2">Data in Transit</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>All data transmitted over public networks is encrypted using TLS 1.2 or higher</li>
                  <li>HTTPS is enforced on all web-facing services and API endpoints</li>
                  <li>Certificate validity and configuration are monitored and maintained</li>
                </ul>

                <h3 className="font-medium text-foreground mt-4 mb-2">Data at Rest</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>PII and confidential data stored in databases is encrypted at rest using AES-256 or equivalent encryption provided by our infrastructure providers</li>
                  <li>API credentials, tokens, and secrets are stored in encrypted secret management systems — never in plaintext configuration files, source code, or client-side applications</li>
                  <li>Backup data is encrypted using the same standards as primary storage</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">6. Network Security</h2>
                <p>We maintain network-level protections including:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Firewalls and network access controls restricting traffic to authorized services</li>
                  <li>Segmented environments for development, staging, and production</li>
                  <li>Intrusion detection and prevention monitoring</li>
                  <li>Regular security assessments of public-facing infrastructure</li>
                  <li>DDoS mitigation through our hosting and CDN providers</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">7. Fulfillment and Shipping Data</h2>
                <p>For order fulfillment, we may share shipping-related personal information with approved fulfillment partners. This may include:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Recipient name</li>
                  <li>Shipping address</li>
                  <li>Phone number</li>
                  <li>Email address where required by the carrier</li>
                </ul>
                <p className="mt-3">This information is shared only with approved service providers and fulfillment partners, solely for the purposes of fulfillment, delivery support, fraud prevention, and legal compliance. It is never used for marketing or sold to third parties.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">8. Data Retention and Secure Disposal</h2>
                <p>We retain customer and partner data only for as long as necessary for:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Order fulfillment and delivery</li>
                  <li>Customer support and dispute resolution</li>
                  <li>Returns, refunds, and chargebacks</li>
                  <li>Tax, accounting, and legal record-keeping as required by applicable law</li>
                  <li>Fraud prevention and operational continuity</li>
                </ul>

                <h3 className="font-medium text-foreground mt-4 mb-2">Retention Periods</h3>
                <p>
                  Transactional and order data is retained for a maximum of 30 days after order completion, unless a longer period is required for legal, tax, or dispute-resolution obligations. Shipping-related PII is deleted or anonymized within 30 days of delivery confirmation unless subject to a legal hold.
                </p>

                <h3 className="font-medium text-foreground mt-4 mb-2">Secure Disposal</h3>
                <p>When personal data is no longer required for the purposes described above, it is permanently deleted or irreversibly anonymized using industry-standard methods. This includes:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Secure deletion of database records</li>
                  <li>Overwriting or cryptographic erasure of stored files</li>
                  <li>Verification of removal from all active systems and backups where technically feasible</li>
                  <li>Destruction of physical media using shredding or degaussing methods where applicable</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">9. Logging and Monitoring</h2>
                <p>We maintain comprehensive logging and monitoring practices to detect and investigate security events, including:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Unauthorized access attempts and failed authentication events</li>
                  <li>Suspicious account activity and privilege escalation</li>
                  <li>Abnormal data access or exfiltration patterns</li>
                  <li>Changes to security configurations and access controls</li>
                  <li>Service misuse and operational anomalies affecting customer data</li>
                </ul>
                <p className="mt-3">Logs are retained in secure, tamper-resistant storage and reviewed according to internal operational and security practices. Automated alerting is configured for high-severity events.</p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">10. Vulnerability Management</h2>
                <p>We proactively manage security vulnerabilities through:</p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Regular security updates and patching of systems, frameworks, and dependencies</li>
                  <li>Automated dependency scanning for known vulnerabilities</li>
                  <li>Periodic security assessments and reviews of critical systems</li>
                  <li>Secure coding practices and code review processes</li>
                  <li>Timely remediation prioritized by severity and potential impact</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">11. Incident Response Plan</h2>
                <p>
                  HWABELLE maintains a formal incident response plan to address security incidents involving unauthorized access, misuse, loss, theft, or disclosure of personal or confidential information—including information received from marketplace partners such as Amazon ("Amazon Information").
                </p>

                <h3 className="font-medium text-foreground mt-4 mb-2">Incident Response Procedures</h3>
                <p>Upon detection or reasonable suspicion of a security incident, we will:</p>
                <ol className="list-decimal pl-5 mt-3 space-y-3">
                  <li>
                    <strong>Identify and Contain:</strong> Immediately identify the scope and nature of the incident, isolate affected systems, and take steps to contain the breach and prevent further unauthorized access.
                  </li>
                  <li>
                    <strong>Investigate and Assess:</strong> Conduct a thorough investigation to determine the root cause, the scope of data affected, and the potential impact on affected individuals and partners.
                  </li>
                  <li>
                    <strong>Remediate:</strong> Implement corrective actions to resolve the vulnerability or weakness that led to the incident and prevent recurrence. This may include revoking compromised credentials, patching systems, and updating access controls.
                  </li>
                  <li>
                    <strong>Notify Amazon (24-Hour Requirement):</strong> For any security incident involving Amazon Information — including any suspected or confirmed unauthorized access, use, disclosure, or loss of data received through the Amazon Selling Partner API — we will notify Amazon by emailing <strong>security@amazon.com within 24 hours</strong> of detection. The notification will include a description of the incident, the data involved, the actions taken to contain and remediate the issue, and a point of contact for further communication.
                  </li>
                  <li>
                    <strong>Notify Affected Individuals:</strong> Where required by applicable law or regulation, we will promptly notify affected individuals as prescribed by the relevant jurisdiction's breach notification requirements.
                  </li>
                  <li>
                    <strong>Document and Report:</strong> Maintain a complete written record of the incident, the investigation, the timeline, all actions taken, and all notifications issued. This documentation is retained for post-incident review and regulatory compliance.
                  </li>
                  <li>
                    <strong>Post-Incident Review:</strong> Conduct a post-incident review to evaluate the effectiveness of the response, identify lessons learned, and update this incident response plan, security controls, and training as needed.
                  </li>
                </ol>

                <h3 className="font-medium text-foreground mt-4 mb-2">Cooperation with Partners</h3>
                <p>
                  In the event of a security incident affecting data received from Amazon or other marketplace partners, we will cooperate fully with the partner's security team, provide timely updates on the investigation and remediation, and follow any additional notification or remediation requirements specified in the applicable partner agreement or data protection policy.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">12. Marketplace and API Partner Data Handling</h2>
                <p>
                  When we receive information through marketplace partner APIs (such as the Amazon Selling Partner API), we adhere to the following additional safeguards:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-2">
                  <li>Partner data is used solely for the specific, approved purposes described in the applicable partner agreement and integration authorization</li>
                  <li>Partner data is never shared with unauthorized third parties, resold, or repurposed for activities outside the authorized scope (such as advertising, profiling, or marketing)</li>
                  <li>API credentials and tokens are stored exclusively in encrypted environment variables and secret management systems — never exposed in client-side code, frontend applications, or version-control repositories</li>
                  <li>Access to partner data is restricted to authorized personnel on a need-to-know, least-privilege basis</li>
                  <li>Partner data is retained only for the minimum period necessary and securely disposed of in accordance with Section 8 of this policy</li>
                  <li>We comply with all applicable partner data protection policies, acceptable use policies, and security requirements</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">13. Service Providers</h2>
                <p>
                  We may use third-party providers for hosting, ecommerce, payments, shipping, analytics, security, and customer support. These providers are contractually required to process data only as needed to provide their contracted services and to maintain security standards consistent with this policy.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">14. Backup and Recovery</h2>
                <p>
                  We maintain regular backup and recovery practices, subject to the capabilities of our hosting and service providers, to reduce the risk of accidental data loss and support business continuity. Backup data is encrypted and retained in accordance with the retention and disposal requirements described in this policy.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">15. Employee Training and Awareness</h2>
                <p>
                  All personnel with access to PII, API credentials, or confidential partner data receive training on data protection responsibilities, security best practices, and this policy's requirements. Training is provided at onboarding and refreshed periodically.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">16. Policy Updates</h2>
                <p>
                  We may update this Data Protection Policy from time to time. Updates will be posted on this page with a revised "Last updated" date. Material changes will be communicated to affected partners and users as appropriate.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">17. Contact</h2>
                <p>For questions about our data protection practices or to report a security concern, contact:</p>
                <div className="mt-3">
                  <p>HWABELLE</p>
                  <p>Email: support@hwabelle.shop</p>
                  <p>Security incidents: security@hwabelle.shop</p>
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
