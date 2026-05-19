import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import img1 from "@/assets/capture-moment.jpeg";
import img2 from "@/assets/step-by-step.jpeg";
import img3 from "@/assets/comparison.jpeg";
import img5 from "@/assets/kit-contents.jpeg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import Autoplay from "embla-carousel-autoplay";
import { defaultKeywords } from "@/lib/site";

const About = () => {
  const carouselImages = [img1, img2, img3, img5];
  const values = [
    {
      title: "Thoughtful preservation",
      description: "Hwabelle focuses on simple tools that help people preserve meaningful flowers before they fade.",
    },
    {
      title: "Beginner accessibility",
      description: "We want flower pressing to feel approachable for adults, first-time crafters, and sentimental keepsake makers.",
    },
    {
      title: "Botanical memory keeping",
      description: "From wedding bouquets to garden blooms, we care about the emotional meaning behind what people choose to save.",
    },
  ];

  const timeline = [
    { year: "2023", event: "The idea blooms", description: "Hwabelle starts with a desire to preserve flowers that carry personal meaning." },
    { year: "2024", event: "Product refinement", description: "The flower press kit is shaped around clarity, usability, and beautiful presentation." },
    { year: "2025", event: "Launch", description: "Hwabelle begins helping customers turn bouquet flowers and garden blooms into keepsakes." },
  ];

  return (
    <Layout>
      <Seo
        title="About Hwabelle | Flower Preservation & Botanical Keepsakes"
        description="Learn how Hwabelle helps people preserve meaningful flowers, wedding bouquets, garden blooms, and botanical memories with simple flower pressing tools."
        path="/about"
        image={new URL(img1, window.location.origin).toString()}
        keywords={[...defaultKeywords, "about flower preservation", "botanical keepsakes"]}
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-2xl">
            <p className="caption mb-4">About</p>
            <h1 className="font-serif text-display-lg mb-6">
              Helping You Preserve the Flowers That Matter
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Hwabelle creates flower preservation tools for wedding bouquets, sentimental blooms,
              garden flowers, and botanical keepsakes that deserve a longer life.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-24 bg-secondary">
        <div className="container">
          <div className="max-w-5xl mx-auto relative px-12">
            <Carousel opts={{ align: "start", loop: true }} plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]} className="w-full">
              <CarouselContent className="-ml-4">
                {carouselImages.map((src, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="rounded-xl overflow-hidden bg-background shadow-sm border border-border cursor-pointer">
                          <img
                            src={src}
                            alt={`Hwabelle flower preservation story image ${index + 1}`}
                            className="w-full h-auto block hover:opacity-90 transition-opacity"
                            loading="lazy"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-[90vw] md:max-w-4xl bg-transparent border-none shadow-none p-0 flex justify-center items-center [&>button]:text-white">
                        <DialogTitle className="sr-only">Flower preservation image {index + 1}</DialogTitle>
                        <img
                          src={src}
                          alt={`Hwabelle flower preservation story image ${index + 1}`}
                          className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-md"
                        />
                      </DialogContent>
                    </Dialog>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-display mb-8 text-center">Why Hwabelle exists</h2>
            <div className="prose-like space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Hwabelle was built around a simple idea: flowers often mark the moments people most want to remember.
                A wedding bouquet, a memorial arrangement, a first garden harvest, or a wildflower picked on an ordinary walk can all carry lasting meaning.
              </p>
              <p>
                The goal is not just to sell a flower press kit. It is to make preservation feel approachable, beautiful,
                and practical for beginners who want to create a pressed flower keepsake at home.
              </p>
              <p>
                That is why Hwabelle focuses on clear tools, useful guidance, and resources that help people press flowers with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <h2 className="font-serif text-display mb-16 text-center">What guides the brand</h2>
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

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-display mb-8">From the founder</h2>
            <blockquote className="font-serif text-xl md:text-2xl italic text-foreground/80 mb-6">
              "Pressing flowers can turn fleeting blooms into something you can keep, display, and return to."
            </blockquote>
            <p className="text-muted-foreground">Susie Oh, Founder of Hwabelle</p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-display mb-8 text-center">Where it started</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                The inspiration behind Hwabelle is deeply personal: a love of flowers, a respect for the stories people attach to them,
                and a wish to preserve those moments more intentionally.
              </p>
              <p>
                That personal connection shapes the way the brand talks about bouquets, garden blooms, memorial flowers, and beginner flower pressing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <h2 className="font-serif text-display mb-16 text-center">The journey</h2>
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
