import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import productImage from "@/assets/capture-moment.jpeg";
import designerImage from "@/assets/digital-designer.jpeg";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Sparkles } from "lucide-react";
import { PRODUCT_PATH, defaultKeywords } from "@/lib/site";

const products = [
  {
    id: "flower-press-kit",
    name: "Acrylic Flower Press Kit",
    variant: "For adults, beginners, and keepsake makers",
    price: 34.99,
    description:
      "A complete acrylic flower pressing kit for preserving wedding bouquets, garden flowers, wildflowers, and meaningful blooms at home.",
    image: productImage,
    detailUrl: PRODUCT_PATH,
    type: "physical" as const,
    alt: "Hwabelle acrylic flower press kit with preserved flowers",
  },
  {
    id: "ai-designer-access",
    name: "Flower Preservation Design Assistant",
    variant: "Digital guidance for planning keepsakes",
    price: 19.99,
    description:
      "Get flower selection help, keepsake ideas, and beginner-friendly pressing guidance for bouquets, garden blooms, and botanical crafts.",
    image: designerImage,
    detailUrl: "/designer",
    type: "digital" as const,
    alt: "Flower preservation design assistant preview for bouquet keepsakes",
  },
];

const Shop = () => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image ?? undefined,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Layout>
      <Seo
        title="Shop Hwabelle Flower Press Kits | Botanical Press Kits for Adults"
        description="Explore Hwabelle flower press kits designed for beginners, crafters, gardeners, artists, and anyone preserving meaningful flowers at home."
        path="/shop"
        image={new URL(productImage, window.location.origin).toString()}
        keywords={[...defaultKeywords, "botanical crafts", "flower preservation gift"]}
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
          ]),
        ]}
      />

      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-3xl">
            <p className="caption mb-4">Shop</p>
            <h1 className="font-serif text-display-lg mb-4">
              Shop Flower Press Kits for Meaningful Keepsakes
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore flower pressing tools and guidance built for preserving wedding bouquets,
              sentimental blooms, wildflowers, and garden flowers at home.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background border-b border-divider">
        <div className="container">
          <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-4">
            <p>Beginner-friendly setup</p>
            <p>Ideal for bouquet and garden keepsakes</p>
            <p>Clear what’s included before checkout</p>
            <p>
              Need planning help? <Link to="/designer" className="underline underline-offset-2">Try the design assistant</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 max-w-5xl">
            {products.map((product) => (
              <article key={product.id} className="group">
                <Link to={product.detailUrl} className="block">
                  <div className="aspect-square mb-6 overflow-hidden rounded-lg bg-secondary relative">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.alt}
                        className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-foreground/5 transition-colors group-hover:bg-foreground/10">
                        <Sparkles size={48} className="text-foreground/40 mb-3" />
                        <span className="text-sm text-muted-foreground font-serif">Digital Product</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-xl">{product.name}</h2>
                    <p className="text-muted-foreground text-sm">{product.variant}</p>
                  </div>
                  <span className="font-serif text-lg">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="hero-outline" size="sm" asChild>
                    <Link to={product.detailUrl}>View Details</Link>
                  </Button>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    id={`add-to-cart-${product.id}`}
                  >
                    <ShoppingBag size={16} className="mr-1.5" />
                    Add to Cart
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
