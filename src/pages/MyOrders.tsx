import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { Package, Search, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface Order {
    id: string;
    stripe_session_id: string;
    customer_email?: string;
    items: Record<string, unknown>;
    total_amount: number;
    currency: string;
    status: string;
    shipping_address: Record<string, string> | null;
    created_at: string;
}

const statusColors: Record<string, string> = {
    paid: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
};

const MyOrders = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [email, setEmail] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPostCheckout, setIsPostCheckout] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [hasAiAccess, setHasAiAccess] = useState(false);
    const { clearCart } = useCart();

    // Auto-lookup when arriving from Stripe checkout
    useEffect(() => {
        if (sessionId) {
            setIsPostCheckout(true);
            clearCart();
            lookupBySession(sessionId);
        }
    }, [sessionId]);

    const lookupBySession = async (sid: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: fnError } = await supabase.functions.invoke(
                "lookup-orders",
                { body: { session_id: sid, check_ai_access: true } }
            );
            if (fnError) throw fnError;

            if (data?.pending && retryCount < 5) {
                // Webhook hasn't processed yet, retry after a delay
                setTimeout(() => {
                    setRetryCount((c) => c + 1);
                    lookupBySession(sid);
                }, 2000);
                return;
            }

            setOrders(data?.orders || []);
            setHasAiAccess(data?.has_ai_access || false);
            setHasSearched(true);
        } catch (err: any) {
            console.error("Session lookup error:", err);
            setError("We're still processing your order. Please try again in a moment.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setIsLoading(true);
        setError(null);
        setIsPostCheckout(false);
        try {
            const { data, error: fnError } = await supabase.functions.invoke(
                "lookup-orders",
                { body: { email: email.trim(), check_ai_access: true } }
            );
            if (fnError) throw fnError;
            setOrders(data?.orders || []);
            setHasAiAccess(data?.has_ai_access || false);
            setHasSearched(true);
        } catch (err: any) {
            console.error("Lookup error:", err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const formatAmount = (cents: number, currency: string) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase(),
        }).format(cents / 100);

    const formatAddress = (addr: Record<string, string> | null) => {
        if (!addr) return null;
        return [addr.line1, addr.line2, addr.city, addr.state, addr.postal_code, addr.country]
            .filter(Boolean)
            .join(", ");
    };

    const orderHasAiDesigner = (order: Order) => {
        const itemStr = JSON.stringify(order.items).toLowerCase();
        return itemStr.includes("ai designer") || itemStr.includes("ai-designer") || itemStr.includes("designer access");
    };

    return (
        <Layout>
            <section className="py-24 md:py-32 bg-background">
                <div className="container">
                    <div className="max-w-2xl mx-auto">
                        {/* Post-checkout success banner */}
                        {isPostCheckout && hasSearched && orders.length > 0 && (
                            <div className="mb-10 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                                    <CheckCircle2 size={28} className="text-green-600" />
                                </div>
                                <h2 className="font-serif text-2xl mb-2">Thank you for your order!</h2>
                                <p className="text-green-700 text-sm">
                                    Your payment was successful. You'll receive a confirmation email shortly.
                                </p>
                            </div>
                        )}

                        {/* Header */}
                        <div className="text-center mb-12">
                            {!isPostCheckout && (
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                                    <Package size={28} className="text-foreground" />
                                </div>
                            )}
                            <h1 className="font-serif text-display mb-3">
                                {isPostCheckout ? "Your Orders" : "Track Your Orders"}
                            </h1>
                            {!isPostCheckout && (
                                <p className="text-muted-foreground text-lg">
                                    Enter the email you used at checkout to view your order history.
                                </p>
                            )}
                        </div>

                        {/* Lookup Form */}
                        {!isPostCheckout && (
                            <form
                                onSubmit={handleLookup}
                                className="flex flex-col sm:flex-row gap-3 mb-12"
                                id="order-lookup-form"
                            >
                                <div className="relative flex-1">
                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    />
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10"
                                        id="order-email-input"
                                    />
                                </div>
                                <Button
                                    variant="hero"
                                    size="lg"
                                    type="submit"
                                    disabled={isLoading}
                                    id="order-lookup-button"
                                >
                                    {isLoading ? (
                                        "Searching…"
                                    ) : (
                                        <>
                                            <Search size={18} className="mr-2" />
                                            Find Orders
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* Loading state for post-checkout */}
                        {isPostCheckout && isLoading && (
                            <div className="text-center py-16">
                                <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-muted-foreground">Loading your order…</p>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="text-center text-destructive mb-8 p-4 bg-destructive/5 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* AI Designer Access Banner */}
                        {hasSearched && hasAiAccess && (
                            <div className="mb-8 p-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                                        <Sparkles size={22} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-serif text-lg mb-0.5">AI Designer Access Active</h3>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-300">Your personalized floral preservation expert is ready.</p>
                                    </div>
                                    <Button variant="hero" size="lg" asChild className="gap-2 flex-shrink-0">
                                        <Link to="/designer-chat">
                                            <Sparkles size={16} />
                                            Open AI Designer
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Results */}
                        {hasSearched && !error && (
                            <>
                                {orders.length === 0 ? (
                                    <div className="text-center py-16">
                                        <p className="text-muted-foreground text-lg mb-2">
                                            No orders found{!isPostCheckout ? " for this email" : ""}.
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {isPostCheckout
                                                ? "Your order is still being processed. Please refresh in a moment."
                                                : "Make sure you're using the same email you entered during checkout."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground mb-6">
                                            {orders.length} order{orders.length !== 1 ? "s" : ""} found
                                        </p>
                                        {orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="border border-divider rounded-lg p-6 hover:border-foreground/20 transition-colors"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">
                                                            {formatDate(order.created_at)}
                                                        </p>
                                                        <p className="font-serif text-lg">
                                                            {formatAmount(order.total_amount, order.currency)}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border capitalize ${statusColors[order.status] ||
                                                            "bg-gray-50 text-gray-700 border-gray-200"
                                                            }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </div>

                                                {order.shipping_address && (
                                                    <div className="text-sm text-muted-foreground">
                                                        <span className="text-foreground font-medium">
                                                            Ships to:{" "}
                                                        </span>
                                                        {formatAddress(order.shipping_address)}
                                                    </div>
                                                )}

                                                <div className="mt-4 pt-4 border-t border-divider flex items-center justify-between gap-3">
                                                    <p className="text-xs text-muted-foreground">
                                                        Order ID: {order.id.slice(0, 8)}…
                                                    </p>
                                                    {orderHasAiDesigner(order) && (
                                                        <Button variant="outline" size="sm" asChild className="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/30">
                                                            <Link to="/designer-chat">
                                                                <Sparkles size={14} />
                                                                AI Designer
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Help note */}
                        {!hasSearched && !isPostCheckout && (
                            <div className="text-center mt-8">
                                <p className="text-sm text-muted-foreground">
                                    Need help?{" "}
                                    <a
                                        href="/contact"
                                        className="underline hover:text-foreground transition-colors"
                                    >
                                        Contact us
                                    </a>{" "}
                                    and we'll look into it.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default MyOrders;
