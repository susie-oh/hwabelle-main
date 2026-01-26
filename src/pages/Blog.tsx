import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import blogImage from "@/assets/blog-botanical-art.jpg";
import pressedFlowers from "@/assets/pressed-flowers-collection.jpg";
import lifestyleImage from "@/assets/lifestyle-pressing.jpg";

const categories = ["All", "Flower Pressing", "DIY", "Botanical Art", "Preservation Tips"];

const posts = [
  {
    slug: "pressing-bridal-bouquets",
    title: "The Art of Pressing Bridal Bouquets",
    category: "Preservation Tips",
    excerpt: "Transform your wedding flowers into a cherished keepsake that lasts a lifetime.",
    image: blogImage,
    readTime: "5 min read"
  },
  {
    slug: "best-flowers-beginners",
    title: "Best Flowers for First-Time Pressers",
    category: "Flower Pressing",
    excerpt: "A curated guide to the most forgiving and beautiful flowers for beginners.",
    image: pressedFlowers,
    readTime: "4 min read"
  },
  {
    slug: "botanical-wall-art",
    title: "Creating Botanical Wall Art",
    category: "DIY",
    excerpt: "Step-by-step instructions for framing your pressed flowers into stunning displays.",
    image: lifestyleImage,
    readTime: "6 min read"
  },
  {
    slug: "seasonal-pressing-guide",
    title: "A Seasonal Pressing Guide",
    category: "Flower Pressing",
    excerpt: "What to press in spring, summer, fall, and even winter.",
    image: blogImage,
    readTime: "7 min read"
  },
  {
    slug: "pressed-flower-cards",
    title: "Handmade Pressed Flower Cards",
    category: "DIY",
    excerpt: "Create beautiful greeting cards with your pressed botanical collection.",
    image: pressedFlowers,
    readTime: "5 min read"
  },
  {
    slug: "preserving-color",
    title: "How to Preserve Color in Pressed Flowers",
    category: "Preservation Tips",
    excerpt: "Tips and techniques for maintaining vibrant hues in your preserved botanicals.",
    image: lifestyleImage,
    readTime: "4 min read"
  }
];

const Blog = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-2xl">
            <p className="caption mb-4">Journal</p>
            <h1 className="font-serif text-display-lg mb-4">Stories & Guides</h1>
            <p className="text-muted-foreground text-lg">
              Inspiration, techniques, and ideas for your botanical journey.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-divider bg-background sticky top-16 md:top-20 z-40">
        <div className="container">
          <div className="flex gap-6 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`text-sm whitespace-nowrap transition-colors ${
                  index === 0 ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {posts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
                <div className="aspect-[4/3] mb-5 overflow-hidden bg-secondary">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="caption">{post.category}</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h2 className="font-serif text-xl mb-2 group-hover:underline underline-offset-4">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
