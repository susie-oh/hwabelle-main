import { Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const stories = [
  {
    name: "Sarah M.",
    location: "Seattle, WA",
    project: "Bridal Bouquet Preservation",
    content: "The clear plates made it so easy to see my flower arrangement while tightening the plates. My white roses and eucalyptus pressed beautifully, and now they are framed on my living room wall as a permanent reminder of my wedding day. I couldn't be happier!",
    rating: 5,
  },
  {
    name: "Eleanor R.",
    location: "Austin, TX",
    project: "Garden Cutting Keepsake",
    content: "I've tried heavy books and wooden presses, but the Hwabelle kit is on another level. The blotting papers dry flowers much faster, retaining the vibrant pinks of my cosmos and pansies. Perfect for beginners and seasoned crafters alike.",
    rating: 5,
  },
  {
    name: "Jordan K.",
    location: "Boston, MA",
    project: "Memorial Flower Pressing",
    content: "We used this kit to preserve roses from a memorial service. The instructions and advice from the AI Designer helped us separate the thick petals and avoid browning. It was a therapeutic process and gave us a beautiful memory to keep.",
    rating: 5,
  },
];

const CustomerStories = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <span className="caption mb-2 block">Shared Memories</span>
        <h2 className="font-serif text-display mb-4">Customer Stories & Creations</h2>
        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm md:text-base">
          Read how Hwabelle customers have successfully preserved bridal bouquets, backyard garden blooms, and meaningful floral keepsakes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-background border border-border/80 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
          >
            <div>
              <div className="flex gap-1 mb-4 text-[#FF9900]">
                {Array.from({ length: story.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" stroke="none" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">
                &ldquo;{story.content}&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-3 border-t border-border/50 pt-4">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-serif text-sm font-medium">
                {story.name.split(" ")[0][0]}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground">{story.name}</h4>
                <p className="text-xs text-muted-foreground">{story.location} &bull; {story.project}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 bg-secondary/40 border border-border/50 rounded-2xl p-6 text-center max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
            <MessageSquare size={18} className="text-foreground" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Have a pressed flower keepsake to share?</h4>
            <p className="text-xs text-muted-foreground">Tag @Hwabelle on Instagram to showcase your framed wedding bouquet or botanical art!</p>
          </div>
        </div>
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
  );
};

export default CustomerStories;
