import Layout from "@/components/layout/Layout";

const Shipping = () => {
  return (
    <Layout>
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <p className="caption mb-4">Policies</p>
            <h1 className="font-serif text-display-lg mb-8">Shipping Policy</h1>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Fulfillment</h2>
                <p>
                  All Hwabelle products are fulfilled by Amazon. This means your order will be 
                  processed, packed, and shipped directly from Amazon's fulfillment centers.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Delivery Times</h2>
                <p>
                  Standard delivery typically takes 2-5 business days depending on your location. 
                  Prime members may be eligible for faster shipping options.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Shipping Costs</h2>
                <p>
                  Shipping costs are calculated at checkout on Amazon. Orders over $35 may qualify 
                  for free shipping. Prime members receive free shipping on eligible orders.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">International Shipping</h2>
                <p>
                  International availability depends on Amazon's shipping options for your region. 
                  Please check the Amazon product page for details on shipping to your country.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Order Tracking</h2>
                <p>
                  Once your order ships, you'll receive a tracking number from Amazon via email. 
                  You can track your package through your Amazon account or the carrier's website.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Questions?</h2>
                <p>
                  For shipping-related inquiries, please contact Amazon customer service. 
                  For product questions, reach us at [ADD EMAIL].
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
