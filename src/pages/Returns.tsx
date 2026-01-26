import Layout from "@/components/layout/Layout";

const Returns = () => {
  return (
    <Layout>
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <p className="caption mb-4">Policies</p>
            <h1 className="font-serif text-display-lg mb-8">Return Policy</h1>
            
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Return Window</h2>
                <p>
                  Returns are handled through Amazon's return policy. Most items purchased 
                  from Amazon can be returned within 30 days of receipt of delivery.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Condition Requirements</h2>
                <p>
                  Items must be returned in new, unused condition with all original packaging 
                  and components. Products that have been used or damaged may not be eligible 
                  for a full refund.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">How to Return</h2>
                <p>
                  To initiate a return, visit your Amazon orders page and select the item you 
                  wish to return. Follow the prompts to print a return label and arrange pickup 
                  or drop-off.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Refund Processing</h2>
                <p>
                  Once Amazon receives your return, they will process your refund within 3-5 
                  business days. The refund will be credited to your original payment method.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Damaged or Defective Items</h2>
                <p>
                  If you receive a damaged or defective product, please contact Amazon customer 
                  service immediately. They will arrange for a replacement or full refund.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-foreground mb-3">Questions?</h2>
                <p>
                  For return-related inquiries, please contact Amazon customer service. 
                  For product quality concerns, reach us at [ADD EMAIL].
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
