import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Twitter, Facebook } from "lucide-react";
import blogImage from "@/assets/blog-botanical-art.jpg";

const BlogPost = () => {
  const { slug } = useParams();

  // In a real app, you would fetch the post data based on slug
  const post = {
    title: "The Art of Pressing Bridal Bouquets",
    category: "Preservation Tips",
    readTime: "5 min read",
    date: "January 2025",
    image: blogImage,
    content: `
      <p>Your wedding bouquet represents one of the most meaningful collections of flowers you'll ever hold. These blooms witnessed your vows, accompanied you down the aisle, and appeared in countless photos. Preserving them through pressing allows you to keep that beauty forever.</p>

      <h2>When to Start Pressing</h2>
      <p>Timing is essential. Ideally, begin the pressing process within 24-48 hours of your wedding. The fresher the flowers, the better they'll retain their color and form. If you're on a honeymoon, ask a trusted friend or family member to start the process for you.</p>

      <h2>Preparing Your Bouquet</h2>
      <p>Before pressing, gently separate your bouquet into individual blooms. Remove any damaged petals and wipe away excess moisture with a soft cloth. Larger flowers like roses may need to be pressed in sections—don't hesitate to press individual petals for a stunning effect.</p>

      <h2>The Pressing Process</h2>
      <p>Layer your flowers between sheets of absorbent blotting paper, ensuring they don't overlap. Place them in your flower press and tighten evenly. Store in a cool, dry location away from direct sunlight. Check weekly and replace damp papers as needed.</p>

      <h2>Creating Your Keepsake</h2>
      <p>After 3-4 weeks, your flowers should be fully dried and flattened. Now comes the creative part: arrange your pressed blooms into a frame, wedding album, or shadowbox. Many couples choose to recreate a miniature version of their original bouquet arrangement.</p>

      <p>The result is a timeless piece of botanical art that captures not just the beauty of your flowers, but the emotions of your special day.</p>
    `
  };

  return (
    <Layout>
      {/* Back Link */}
      <div className="container py-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          Back to Journal
        </Link>
      </div>

      {/* Hero Image */}
      <div className="aspect-[21/9] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <article className="py-12 md:py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-6">
              <span className="caption">{post.category}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-sm text-muted-foreground">{post.readTime}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-sm text-muted-foreground">{post.date}</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-display md:text-display-lg mb-8">{post.title}</h1>

            {/* Share */}
            <div className="flex items-center gap-4 pb-8 border-b border-divider mb-10">
              <span className="text-sm text-muted-foreground">Share</span>
              <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Share">
                <Share2 size={18} />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </button>
            </div>

            {/* Body */}
            <div 
              className="prose prose-lg max-w-none
                [&>p]:text-muted-foreground [&>p]:leading-relaxed [&>p]:mb-6
                [&>h2]:font-serif [&>h2]:text-xl [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:text-foreground
                [&>ul]:text-muted-foreground [&>ul]:leading-relaxed
                [&>ol]:text-muted-foreground [&>ol]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA */}
            <div className="mt-16 p-8 bg-secondary text-center">
              <h3 className="font-serif text-xl mb-3">Ready to preserve your memories?</h3>
              <p className="text-muted-foreground mb-6">
                Our Flower Press Kit makes it easy to create lasting botanical art.
              </p>
              <Button variant="hero" asChild>
                <a href="[ADD AMAZON LINK]" target="_blank" rel="noopener noreferrer">
                  Shop the Kit
                </a>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
