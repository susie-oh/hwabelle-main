import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Link } from "react-router-dom";

const Shipping = () => {
  return (
    <Layout>
      <Seo
        title="Shipping Information | Hwabelle"
        description="Review Hwabelle shipping information, Amazon fulfillment details, delivery timing guidance, and order tracking information."
        path="/shipping"
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shipping", path: "/shipping" },
          ]),
        ]}
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <p className="caption mb-4">Policies</p>
            <h1 className="font-serif text-display-lg mb-8">Shipping Policy</h1>

            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Fulfillment</h2>
                <p>
                  Hwabelle product orders on this site are fulfilled through Amazon. Shipping,
                  carrier selection, and delivery timelines are handled through Amazon&apos;s fulfillment system.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Delivery timing</h2>
                <p>
                  Delivery timing depends on the shipping option shown at checkout and your location.
                  Please refer to the live Amazon listing for the most current shipping estimates.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Shipping costs</h2>
                <p>
                  Shipping costs are determined by Amazon during checkout. If you need exact shipping
                  details, use the live product page before placing your order.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">International orders</h2>
                <p>
                  International availability depends on Amazon&apos;s shipping options for your region.
                  Check the current listing for destination-specific options.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Order tracking</h2>
                <p>
                  Once your order ships, Amazon provides tracking details through your order history
                  and confirmation emails.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Questions?</h2>
                <p>
                  For shipping-related issues, contact Amazon customer service. For product questions or
                  pre-purchase support, visit the <Link to="/contact" className="underline underline-offset-2">Hwabelle contact page</Link>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shipping;
