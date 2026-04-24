import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CartDrawer = () => {
    const { items, removeItem, updateQuantity, totalPrice, isCartOpen, closeCart, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleCheckout = async () => {
        if (!items.length) return;

        setIsLoading(true);
        try {
            const hasAiDesigner = items.some((item) => item.id === "ai-designer-access");
            const successPath = hasAiDesigner ? "/designer-chat" : "/my-orders";
            const { data, error } = await supabase.functions.invoke("create-checkout", {
                body: {
                    items: items.map((item) => ({
                        id: item.id,        // stable slug — required for product_type resolution
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                    })),
                    successUrl: `${window.location.origin}${successPath}`,
                    cancelUrl: window.location.href,
                },
            });

            if (error) throw error;
            if (data?.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No checkout URL returned");
            }
        } catch (err: any) {
            console.error("Checkout error:", err);
            toast({
                title: "Checkout failed",
                description: err.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle className="font-serif text-xl">Your Cart</SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
                        <ShoppingBag size={48} className="text-muted-foreground/40" />
                        <div>
                            <p className="text-lg font-serif mb-1">Your cart is empty</p>
                            <p className="text-sm text-muted-foreground">
                                Add a flower press kit to get started
                            </p>
                        </div>
                        <Button variant="hero-outline" onClick={closeCart}>
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto py-4 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-3 border border-divider rounded-md"
                                >
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-contain p-1 rounded bg-secondary flex-shrink-0"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-serif text-sm leading-tight truncate">
                                            {item.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            ${item.price.toFixed(2)}
                                        </p>

                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-7 h-7 flex items-center justify-center border border-divider rounded hover:bg-secondary transition-colors"
                                                aria-label="Decrease quantity"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-7 h-7 flex items-center justify-center border border-divider rounded hover:bg-secondary transition-colors"
                                                aria-label="Increase quantity"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-divider pt-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="font-serif text-lg">Subtotal</span>
                                <span className="font-serif text-lg">
                                    ${totalPrice.toFixed(2)}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Shipping and taxes calculated at checkout
                            </p>
                            <Button
                                variant="hero"
                                size="xl"
                                className="w-full"
                                onClick={handleCheckout}
                                disabled={isLoading}
                            >
                                {isLoading ? "Redirecting…" : "Checkout"}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-muted-foreground"
                                onClick={() => {
                                    clearCart();
                                }}
                            >
                                Clear Cart
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default CartDrawer;
