import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { motion } from "framer-motion";
import {
    Package, CheckCircle2, Sparkles, Loader2, AlertCircle,
    ShieldCheck, LogIn, ChevronRight, ExternalLink,
} from "lucide-react";

interface Order {
    id: string;
    order_number?: string;
    customer_email?: string;
    total_amount: number;
    currency: string;
    status: string;
    shipping_address: Record<string, string> | null;
    created_at: string;
    order_items?: { id: string; product_name: string; quantity: number; product_type: string }[];
}

const statusColors: Record<string, string> = {
    paid: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/40",
    pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40",
    processing: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/40",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40",
    cancelled: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40",
};

type PageState =
    | "loading"          // resolving auth session
    | "unauthenticated"  // no session — prompt to sign in
    | "post-checkout"    // ?session_id= present — confirming purchase + prompting sign-in/up
    | "orders"           // authenticated, orders loaded
    | "error";

const MyOrders = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { clearCart } = useCart();

    const [pageState, setPageState] = useState<PageState>("loading");
    const [orders, setOrders] = useState<Order[]>([]);
    const [hasAiAccess, setHasAiAccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Post-checkout activation — was the purchase confirmed?
    const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);
    const [purchaseHasAi, setPurchaseHasAi] = useState(false);
    const [verifyRetries, setVerifyRetries] = useState(0);

    // ── Bootstrap ─────────────────────────────────────────────────────────────
    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            const { data: { session } } = await supabase.auth.getSession();

            if (!cancelled) {
                if (sessionId) {
                    // Always clear cart on post-checkout landing
                    clearCart();

                    if (session) {
                        // Authenticated — verify session then load their orders
                        await verifySession(sessionId);
                        if (!cancelled) await loadOrders(session.access_token);
                    } else {
                        // Not authenticated — show activation UX
                        setPageState("post-checkout");
                        verifySession(sessionId); // run in background to confirm purchase
                    }
                } else if (session) {
                    await loadOrders(session.access_token);
                } else {
                    setPageState("unauthenticated");
                }
            }
        }

        bootstrap();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!cancelled && session) {
                loadOrders(session.access_token);
            }
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, [sessionId]);

    // ── Verify Stripe session (post-checkout confirmation) ────────────────────
    const verifySession = useCallback(async (sid: string) => {
        try {
            const { data, error: fnErr } = await supabase.functions.invoke("lookup-orders", {
                body: { action: "verify-session", session_id: sid },
            });
            if (fnErr) throw fnErr;

            if (data?.pending && verifyRetries < 6) {
                setTimeout(() => {
                    setVerifyRetries((r) => r + 1);
                    verifySession(sid);
                }, 2500);
                return;
            }

            setPurchaseConfirmed(!data?.pending);
            setPurchaseHasAi(data?.has_ai_access || false);
        } catch (err) {
            console.error("Session verify error:", err);
        }
    }, [verifyRetries]);

    // ── Load authenticated user's orders ──────────────────────────────────────
    const loadOrders = useCallback(async (jwt: string) => {
        setPageState("loading");
        setError(null);
        try {
            const { data, error: fnErr } = await supabase.functions.invoke("lookup-orders", {
                body: { action: "my-orders" },
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (fnErr) throw fnErr;

            setOrders(data?.orders || []);
            setHasAiAccess(data?.has_ai_access || false);
            setPageState("orders");
        } catch (err: any) {
            console.error("Order load error:", err);
            setError(err.message || "Failed to load orders");
            setPageState("error");
        }
    }, []);

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <Layout>
            <div className="container py-16 md:py-24 max-w-3xl">
                <div className="mb-10">
                    <h1 className="font-serif text-3xl md:text-4xl mb-2">My Orders</h1>
                    <p className="text-muted-foreground">
                        {pageState === "orders" ? "Your purchase history and access status." : "Sign in to view your orders."}
                    </p>
                </div>

                {/* ── Loading ── */}
                {pageState === "loading" && (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 size={32} className="text-emerald-600 animate-spin" />
                    </div>
                )}

                {/* ── Error ── */}
                {pageState === "error" && (
                    <div className="flex items-center gap-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3">
                        <AlertCircle size={16} />
                        <span>{error || "Something went wrong. Please refresh and try again."}</span>
                    </div>
                )}

                {/* ── Unauthenticated ── */}
                {pageState === "unauthenticated" && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-border rounded-2xl p-8 text-center max-w-sm mx-auto"
                    >
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
                            <LogIn size={24} className="text-muted-foreground" />
                        </div>
                        <h2 className="font-serif text-xl mb-2">Sign In to View Orders</h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Your order history is linked to your account.
                        </p>
                        <Button className="gap-2" asChild>
                            <Link to="/designer-chat">
                                <LogIn size={14} />
                                Sign In
                            </Link>
                        </Button>
                    </motion.div>
                )}

                {/* ── Post-checkout activation (not yet authenticated) ── */}
                {pageState === "post-checkout" && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6 max-w-lg mx-auto"
                    >
                        {/* Purchase confirmation banner */}
                        {purchaseConfirmed ? (
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center">
                                <div className="flex items-center justify-center gap-2 mb-3">
                                    <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center">
                                        <CheckCircle2 size={18} className="text-emerald-600" />
                                    </div>
                                    <span className="font-medium text-emerald-700 dark:text-emerald-400">
                                        Purchase confirmed
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {purchaseHasAi
                                        ? "Your AI Designer access is ready to activate."
                                        : "Your order is confirmed and being prepared for fulfillment."}
                                </p>
                            </div>
                        ) : (
                            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-5 flex items-center gap-3">
                                <Loader2 size={18} className="text-amber-600 animate-spin flex-shrink-0" />
                                <p className="text-sm text-amber-700 dark:text-amber-400">
                                    Confirming your payment…
                                </p>
                            </div>
                        )}

                        {/* Activation prompt */}
                        <div className="border border-border rounded-2xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-border bg-secondary/30 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                    <ShieldCheck size={19} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="font-serif text-lg">Activate Your Access</h2>
                                    <p className="text-xs text-muted-foreground">Sign in to link this purchase to your account</p>
                                </div>
                            </div>
                            <div className="px-6 py-5">
                                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                    To view your orders and activate AI Designer access, sign in or create an account
                                    using the <strong>same email address you used at checkout.</strong>
                                </p>
                                <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                                    <Link to={`/designer-chat?session_id=${sessionId}`}>
                                        <LogIn size={14} />
                                        Sign In & Activate
                                        <ChevronRight size={14} />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── Orders list ── */}
                {pageState === "orders" && (
                    <div className="space-y-6">
                        {/* AI Designer access banner */}
                        {hasAiAccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <Sparkles size={22} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">AI Designer Active</p>
                                    <p className="text-xs text-muted-foreground">
                                        Your AI Floral Designer access is active. Start a session anytime.
                                    </p>
                                </div>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 flex-shrink-0" asChild>
                                    <Link to="/designer-chat">
                                        <ExternalLink size={13} />
                                        Open
                                    </Link>
                                </Button>
                            </motion.div>
                        )}

                        {orders.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground">
                                <Package size={40} className="mx-auto mb-4 opacity-30" />
                                <p className="font-serif text-lg mb-1">No orders yet</p>
                                <p className="text-sm">Once you make a purchase, your orders will appear here.</p>
                                <Button variant="outline" className="mt-6 gap-2" asChild>
                                    <Link to="/shop">
                                        Browse the Shop
                                        <ChevronRight size={14} />
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order, i) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.06 }}
                                        className="border border-border rounded-xl p-5 bg-background"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {order.order_number || `Order ${order.id.substring(0, 8).toUpperCase()}`}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {new Date(order.created_at).toLocaleDateString("en-US", {
                                                        year: "numeric", month: "long", day: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusColors[order.status] || statusColors.pending}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Total</span>
                                            <span className="font-medium">
                                                ${(order.total_amount / 100).toFixed(2)} {order.currency?.toUpperCase()}
                                            </span>
                                        </div>

                                        {order.order_items && order.order_items.length > 0 && (
                                            <div className="mt-3 space-y-1.5">
                                                {order.order_items.map((item) => (
                                                    <div key={item.id} className="flex items-center text-sm">
                                                        <span className="text-muted-foreground w-6">{item.quantity}x</span>
                                                        <span className="font-medium">{item.product_name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {order.shipping_address && (
                                            <div className="mt-3 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                                                Shipping to {order.shipping_address.city}, {order.shipping_address.state}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyOrders;
