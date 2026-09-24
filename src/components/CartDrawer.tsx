import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Check, X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CartDrawer = () => {
    const {
        items,
        removeItem,
        updateQuantity,
        totalPrice,
        discountCode,
        discountPercent,
        discountAmount,
        finalPrice,
        applyDiscountCode,
        removeDiscountCode,
        isCartOpen,
        closeCart,
        clearCart,
    } = useCart();

    const [isLoading, setIsLoading] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const [couponError, setCouponError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleApplyCoupon = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setCouponError(null);
        if (!couponInput.trim()) return;

        const result = applyDiscountCode(couponInput);
        if (result.success) {
            toast({
                title: "Discount Applied! 🌸",
                description: result.message,
            });
            setCouponInput("");
        } else {
            setCouponError(result.message);
        }
    };

    const handleCheckout = async () => {
        if (!items.length) return;

        setIsLoading(true);
        try {
            const hasAiDesigner = items.some((item) => item.id === "ai-designer-access");
            const successPath = hasAiDesigner ? "/designer-chat" : "/account";
            
            // Calculate item price after discount if applied
            const discountMultiplier = discountPercent > 0 ? (100 - discountPercent) / 100 : 1;

            const { data, error } = await supabase.functions.invoke("create-checkout", {
                body: {
                    items: items.map((item) => ({
                        id: item.id,        // stable slug — required for product_type resolution
                        name: item.name,
                        price: Number((item.price * discountMultiplier).toFixed(2)),
                        quantity: item.quantity,
                    })),
                    discountCode: discountCode || undefined,
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
                                        <div className="flex items-center gap-2 mt-1">
                                            {discountPercent > 0 ? (
                                                <>
                                                    <span className="text-sm font-semibold text-primary">
                                                        ${(item.price * (1 - discountPercent / 100)).toFixed(2)}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground line-through">
                                                        ${item.price.toFixed(2)}
                                                    </span>
                                                </>
                                            ) : (
                                                <p className="text-sm text-muted-foreground">
                                                    ${item.price.toFixed(2)}
                                                </p>
                                            )}
                                        </div>

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

                        {/* Promo / Discount Code Section */}
                        <div className="border-t border-divider py-3">
                            {discountCode ? (
                                <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                        <div className="text-xs">
                                            <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                                                {discountCode}
                                            </span>
                                            <span className="text-emerald-600 dark:text-emerald-400 ml-1.5 font-medium">
                                                (10% OFF applied)
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={removeDiscountCode}
                                        className="text-emerald-700 hover:text-rose-600 dark:text-emerald-400 dark:hover:text-rose-400 p-1 transition-colors"
                                        aria-label="Remove coupon"
                                        title="Remove coupon"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Tag className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="Promo code"
                                                value={couponInput}
                                                onChange={(e) => {
                                                    setCouponInput(e.target.value);
                                                    if (couponError) setCouponError(null);
                                                }}
                                                className="h-9 pl-8 text-xs uppercase bg-secondary/40"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            size="sm"
                                            disabled={!couponInput.trim()}
                                            className="h-9 px-3 text-xs"
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                    {couponError && (
                                        <p className="text-[11px] text-rose-600 dark:text-rose-400 px-1">
                                            {couponError}
                                        </p>
                                    )}
                                </form>
                            )}
                        </div>

                        {/* Footer Totals */}
                        <div className="border-t border-divider pt-3 space-y-2.5">
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between items-center text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>

                                {discountAmount > 0 && (
                                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            10% Welcome Discount
                                        </span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center font-serif text-lg text-foreground pt-1 border-t border-divider">
                                    <span>Total</span>
                                    <span>${finalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <p className="text-[11px] text-muted-foreground text-center">
                                Shipping and taxes calculated at checkout
                            </p>

                            <Button
                                variant="hero"
                                size="xl"
                                className="w-full"
                                onClick={handleCheckout}
                                disabled={isLoading}
                            >
                                {isLoading ? "Redirecting…" : `Checkout · $${finalPrice.toFixed(2)}`}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-muted-foreground text-xs"
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
