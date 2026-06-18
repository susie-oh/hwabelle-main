import * as React from "react";
import { Star, MessageSquare, Check, ExternalLink } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const reviews = [
  {
    reviewer: "Amazon Customer",
    title: "Best press I have used",
    rating: 5,
    date: "May 20, 2026",
    verified: true,
    content: "The best press I have used. The 11x11 size is perfect for handling full wedding bouquet roses and hydrangeas without having to cut them down. The thick acrylic plates do not warp and the layering system provides even pressure, yielding flat flowers with minimal browning and excellent color retention. Highly recommended.",
  },
  {
    reviewer: "Amazon Customer",
    title: "Such A Special Keepsake!",
    rating: 5,
    date: "June 2, 2026",
    verified: true,
    content: "Purchased to preserve flowers and special memories. More giftable and pretty than expected; the acrylic style makes it feel modern compared to basic wood craft kits. Highly recommended for weddings, crafts, or any sentimental flowers.",
  },
  {
    reviewer: "GummyCats",
    title: "Elegant, cutesy set",
    rating: 5,
    date: "May 28, 2026",
    verified: true,
    content: "An elegant and cutesy kit that was easy to figure out. Came with acrylic boards, tweezers, scissors, a carrying bag, and plenty of paper. Fun activity that teaches patience. Amazing value for money.",
  },
  {
    reviewer: "Elena M.",
    title: "Absolutely stunning kit",
    rating: 5,
    date: "June 14, 2026",
    verified: true,
    content: "Absolutely stunning kit. I bought this to press flowers from my anniversary bouquet. The scalloped edge on the acrylic plates is so elegant. The flowers dried very quickly using the thick blotting papers, keeping their vibrant red and purple colors. I love that it comes with a storage bag to keep everything organized.",
  },
  {
    reviewer: "CraftyMom",
    title: "Perfect for bridal bouquets!",
    rating: 5,
    date: "June 8, 2026",
    verified: true,
    content: "Perfect for bridal bouquets! The 11x11 size is large enough to handle thick flowers like roses and hydrangeas. The instructions are very clear, and the results are amazing. No browning or molding at all.",
  }
];

const CustomerStories = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Setup autoplay plugin to slide every 4 seconds, pausing on hover/interaction
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <span className="caption mb-2 block">Real Customer Reviews</span>
        <h2 className="font-serif text-display mb-4">Loved by Flower Artists & Crafters</h2>
        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm md:text-base">
          Read real, verified feedback from customer purchases on Amazon. From preserving wedding bouquets to capturing garden memories, see how Hwabelle delivers professional pressing results.
        </p>
      </div>

      <div className="relative group">
        <Carousel
          setApi={setApi}
          plugins={[autoplayPlugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className="pl-4 md:pl-6 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <div className="bg-card border border-border/60 p-6 rounded-2xl flex flex-col justify-between h-full min-h-[320px] transition-all duration-300 hover:shadow-md hover:border-foreground/20">
                  <div>
                    {/* Header: Stars & Verified Purchase Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div className="flex gap-0.5 text-[#F1A40E]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={15}
                            fill={i < review.rating ? "currentColor" : "none"}
                            stroke={i < review.rating ? "none" : "currentColor"}
                            className="stroke-muted-foreground/40"
                          />
                        ))}
                      </div>

                      {review.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100/55 dark:border-emerald-900/20">
                          <Check size={10} className="stroke-[3]" />
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Review Title */}
                    <h3 className="font-serif text-base font-semibold text-foreground mb-1 leading-snug line-clamp-1">
                      {review.title}
                    </h3>
                    
                    {/* Review Date */}
                    <p className="text-[10px] text-muted-foreground mb-3">{review.date}</p>

                    {/* Review Body */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic line-clamp-6">
                      &ldquo;{review.content}&rdquo;
                    </p>
                  </div>

                  {/* Reviewer Details */}
                  <div className="flex items-center gap-2.5 border-t border-border/40 pt-4 mt-auto">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-foreground font-serif text-sm font-semibold flex-shrink-0">
                      {review.reviewer.split(" ").map((n) => n[0]).join("") || "A"}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-foreground leading-tight">
                        {review.reviewer}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">Amazon Customer</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Manual Sliding Indicator Dots */}
      {count > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-8">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                current === i
                  ? "bg-foreground w-4"
                  : "bg-muted-foreground/35 hover:bg-muted-foreground/60 w-1.5"
              }`}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Footer Links (Amazon Reviews & Instagram Sharing) */}
      <div className="mt-16 bg-secondary/40 border border-border/40 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 justify-between">
        <div className="flex items-center gap-4 text-left">
          <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center flex-shrink-0 shadow-sm border border-border/40">
            <MessageSquare size={20} className="text-foreground" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">See all feedback or share your creations</h4>
            <p className="text-xs text-muted-foreground max-w-md mt-1">
              Read all buyer feedback on Amazon or tag @Hwabelle on Instagram to show off your framed keepsakes!
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://www.amazon.com/product-reviews/B0GFGY8DGW"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-colors whitespace-nowrap shadow-sm"
          >
            <span>Read on Amazon</span>
            <ExternalLink size={12} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-4 py-2 bg-background border border-border hover:bg-secondary rounded-full transition-colors whitespace-nowrap"
          >
            Follow Hwabelle
          </a>
        </div>
      </div>
    </div>
  );
};

export default CustomerStories;
