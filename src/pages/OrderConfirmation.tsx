import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import Seo from "@/components/seo/Seo";

const OrderConfirmation = () => {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, []);

    return (
        <Layout>
            <Seo title="Order Confirmation | Hwabelle" path="/order-confirmation" robots="noindex,nofollow" />
            <section className="py-24 md:py-32 bg-background">
                <div className="container">
                    <div className="max-w-lg mx-auto text-center">
                        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle2 size={40} className="text-green-600" />
                        </div>
                        <h1 className="font-serif text-display mb-4">
                            Thank You!
                        </h1>
                        <p className="text-muted-foreground text-lg mb-2">
                            Your order has been placed successfully.
                        </p>
                        <p className="text-muted-foreground mb-8">
                            You'll receive a confirmation email shortly with your order details
                            and tracking information.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button variant="hero" size="lg" asChild>
                                <Link to="/shop">Continue Shopping</Link>
                            </Button>
                            <Button variant="hero-outline" size="lg" asChild>
                                <Link to="/my-orders">Track Your Order</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default OrderConfirmation;
