import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Link } from "react-router-dom";

const Returns = () => {
  return (
    <Layout>
      <Seo
        title="Returns Information | Hwabelle"
        description="Read Hwabelle returns information, Amazon return steps, refund timing guidance, and how to handle damaged orders."
        path="/returns"
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Returns", path: "/returns" },
          ]),
        ]}
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <p className="caption mb-4">Policies</p>
            <h1 className="font-serif text-display-lg mb-8">Return Policy</h1>

            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Return window</h2>
                <p>
                  Returns are handled through Amazon&apos;s return policy and timelines. Review the live order
                  details in your Amazon account for the exact return window that applies to your purchase.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Condition requirements</h2>
                <p>
                  Eligibility and refund conditions are determined by Amazon&apos;s current return rules for the order.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">How to start a return</h2>
                <p>
                  Open your Amazon orders page, select the order, and follow the return prompts shown there.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Refund timing</h2>
                <p>
                  Refund timing is processed through Amazon after the return is received and reviewed.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Damaged or defective items</h2>
                <p>
                  If an order arrives damaged or defective, start with Amazon customer service so the order can be reviewed promptly.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Questions?</h2>
                <p>
                  For return processing issues, contact Amazon customer service. For product questions, use the{" "}
                  <Link to="/contact" className="underline underline-offset-2">Hwabelle contact page</Link>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Returns;
