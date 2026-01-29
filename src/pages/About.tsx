import Layout from "@/components/layout/Layout";
import lifestyleImage from "@/assets/pressing-in-action.png";

const About = () => {
  const values = [
    {
      title: "Sustainability",
      description: "We source materials responsibly and design products meant to last for generations."
    },
    {
      title: "Creativity",
      description: "We believe in the power of hands-on crafting to spark joy and meaningful connection."
    },
    {
      title: "Nature Appreciation",
      description: "Every bloom tells a story. We help you preserve those stories beautifully."
    }
  ];

  const timeline = [
    { year: "2023", event: "The idea blooms", description: "Inspired by a garden's fleeting beauty, Hwabelle was born." },
    { year: "2024", event: "First prototype", description: "Months of design refinement to create the perfect press." },
    { year: "2025", event: "Official launch", description: "Hwabelle Flower Press Kit available to the world." }
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-2xl">
            <p className="caption mb-4">About</p>
            <h1 className="font-serif text-display-lg mb-6">
              Preserving what matters
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hwabelle creates thoughtful tools for those who find beauty in nature's 
              fleeting moments and want to hold onto them forever.
            </p>
          </div>
        </div>
      </section>

      {/* Story Image */}
      <section className="aspect-[21/9] overflow-hidden">
        <img 
          src={lifestyleImage} 
          alt="The art of flower pressing" 
          className="w-full h-full object-cover"
        />
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-display mb-8 text-center">Our Story</h2>
            <div className="prose-like space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Hwabelle was born from a simple observation: the most beautiful flowers 
                fade all too quickly. A garden in full bloom, a wedding bouquet, wildflowers 
                picked on a summer walk—these moments deserve to be preserved.
              </p>
              <p>
                We set out to create a flower press that was not just functional, but 
                beautiful in its own right. Something you'd be proud to display, gift, 
                or pass down through generations.
              </p>
              <p>
                Every Hwabelle kit is designed with care, crafted from sustainable materials, 
                and made to transform delicate blooms into lasting botanical art.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <h2 className="font-serif text-display mb-16 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <h3 className="font-serif text-xl mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-display mb-8">From the Founder</h2>
            <blockquote className="font-serif text-xl md:text-2xl italic text-foreground/80 mb-6">
              "[ADD FOUNDER QUOTE]"
            </blockquote>
            <p className="text-muted-foreground">
              — [ADD FOUNDER NAME], Founder of Hwabelle
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <h2 className="font-serif text-display mb-16 text-center">Our Journey</h2>
          <div className="max-w-2xl mx-auto">
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-8">
                  <div className="w-20 flex-shrink-0">
                    <span className="font-serif text-2xl text-muted-foreground">{item.year}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg mb-2">{item.event}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
