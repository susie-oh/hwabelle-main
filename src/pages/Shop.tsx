import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import productImage from "@/assets/capture-moment.jpeg";
import designerImage from "@/assets/digital-designer.jpeg";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Sparkles } from "lucide-react";

const products = [
  {
    id: "flower-press-kit",
    name: "Acrylic Flower Press Kit",
    variant: "For Beginners & Beyond",
    price: 34.99,
    description: "A complete DIY flower pressing kit with large and small acrylic press plates, blotting paper, and felt storage bags. Perfect for wedding bouquet preservation, botanical art, and everyday pressing.",
    image: productImage,
    detailUrl: "/product/flower-press-kit",
    type: "physical" as const,
  },
  {
    id: "ai-designer-access",
    name: "AI Designer Access",
    variant: "Digital Product",
    price: 19.99,
    description: "Unlock your personal AI flower preservation expert. Get instant flower identification, pressing guidance, design inspiration, and access to the full 9-module preservation course.",
    image: designerImage,
    detailUrl: "/designer",
    type: "digital" as const,
  },
];

const Shop = () => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: typeof products[0]) => {
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
      {/* Header */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container">
          <div className="max-w-2xl">
            <p className="caption mb-4">Shop</p>
            <h1 className="font-serif text-display-lg mb-4">Shop Hwabelle</h1>
            <p className="text-muted-foreground text-lg">
              Flower press kits, AI-powered tools, and everything you need to preserve nature's beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 max-w-4xl">
            {products.map((product) => (
              <div key={product.id} className="group">
                <Link to={product.detailUrl} className="block">
                  <div className="aspect-square mb-6 overflow-hidden bg-secondary rounded-lg relative">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-foreground/5 transition-colors group-hover:bg-foreground/10">
                        <Sparkles size={48} className="text-foreground/40 mb-3" />
                        <span className="text-sm text-muted-foreground font-serif">Digital Product</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="font-serif text-xl">{product.name}</h2>
                    <p className="text-muted-foreground text-sm">{product.variant}</p>
                  </div>
                  <span className="font-serif text-lg">${product.price.toFixed(2)}</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                <div className="flex gap-3">
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
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
