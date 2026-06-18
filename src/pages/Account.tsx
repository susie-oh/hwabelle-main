import Layout from "@/components/layout/Layout";
import Seo from "@/components/seo/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
    Package, CheckCircle2, Sparkles, Loader2, AlertCircle,
    ShieldCheck, LogIn, ChevronRight, ExternalLink, Mail, Lock,
    LogOut, UserPlus, ShoppingBag
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
    mcf_order_id?: string | null;
    mcf_status?: string | null;
    mcf_submitted_at?: string | null;
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

const Account = () => {
    const { user, session, isLoading: authLoading, signIn, signUp, signOut } = useAuth();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // ── Page States ───────────────────────────────────────────────────────────
    const [isResolving, setIsResolving] = useState(true);
    const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [signUpSuccess, setSignUpSuccess] = useState(false);

    // Dashboard data
    const [orders, setOrders] = useState<Order[]>([]);
    const [hasAiAccess, setHasAiAccess] = useState(false);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState<string | null>(null);

    // Post-checkout verification state
    const [purchaseConfirmed, setPurchaseConfirmed] = useState(false);
    const [purchaseHasAi, setPurchaseHasAi] = useState(false);
    const [verifyingSession, setVerifyingSession] = useState(false);
    const verifyRetriesRef = useRef(0);

    // Set authMode based on path if they come to /login explicitly
    useEffect(() => {
        if (location.pathname === "/login") {
            setAuthMode("signin");
        }
    }, [location.pathname]);

    // ── Timeout fallback for infinite auth loader ─────────────────────────────
    useEffect(() => {
        if (!authLoading) {
            setIsResolving(false);
        }
    }, [authLoading]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsResolving(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    // ── Stripe Session Verification ───────────────────────────────────────────
    const verifySession = useCallback(async (sid: string) => {
        setVerifyingSession(true);
        try {
            const { data, error: fnErr } = await supabase.functions.invoke("lookup-orders", {
                body: { action: "verify-session", session_id: sid },
            });
            if (fnErr) throw fnErr;

            if (data?.pending && verifyRetriesRef.current < 6) {
                setTimeout(() => {
                    verifyRetriesRef.current += 1;
                    verifySession(sid);
                }, 2500);
                return;
            }

            setPurchaseConfirmed(!data?.pending);
            setPurchaseHasAi(data?.has_ai_access || false);
        } catch (err) {
            console.error("Session verify error:", err);
        } finally {
            setVerifyingSession(false);
        }
    }, []);

    // ── Fetch orders and claim status ─────────────────────────────────────────
    const loadOrders = useCallback(async () => {
        if (!session) return;
        setOrdersLoading(true);
        setOrdersError(null);
        try {
            const { data, error: fnErr } = await supabase.functions.invoke("lookup-orders", {
                body: { action: "my-orders" },
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (fnErr) throw fnErr;

            setOrders(data?.orders || []);
            setHasAiAccess(data?.has_ai_access || false);
        } catch (err: any) {
            console.error("Order load error:", err);
            setOrdersError(err.message || "Failed to load orders");
        } finally {
            setOrdersLoading(false);
        }
    }, [session]);

    // Bootstrap data fetching and Stripe session verification
    useEffect(() => {
        if (session) {
            loadOrders();
            if (sessionId) {
                clearCart();
                verifySession(sessionId);
            }
        }
    }, [session, sessionId, clearCart, verifySession, loadOrders]);

    // Redirect logged-in users away from /login route to /account
    useEffect(() => {
        if (session && location.pathname === "/login" && !isResolving) {
            navigate("/account", { replace: true });
        }
    }, [session, location.pathname, isResolving, navigate]);

    // ── Auth Handlers ─────────────────────────────────────────────────────────
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionError(null);
        setSignUpSuccess(false);
        setActionLoading(true);

        try {
            if (authMode === "signin") {
                const { error } = await signIn(email, password);
                if (error) throw error;
                // Session listener in AuthProvider will trigger, updating state
            } else {
                const { error } = await signUp(email, password);
                if (error) throw error;
                setSignUpSuccess(true);
                // Reset form fields
                setPassword("");
            }
        } catch (err: any) {
            setActionError(err.message || "Authentication failed. Please check your credentials.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setOrders([]);
            setHasAiAccess(false);
            navigate("/login");
        } catch (err) {
            console.error("Error signing out:", err);
        }
    };

    // Render loading or resolving state
    const showLoader = isResolving || (session && ordersLoading && orders.length === 0);

    return (
        <Layout>
            <Seo 
                title={session ? "My Account | Hwabelle" : authMode === "signin" ? "Sign In | Hwabelle" : "Create Account | Hwabelle"} 
                path={session ? "/account" : "/login"} 
                robots="noindex,nofollow" 
            />
            <div className="container py-16 md:py-24 max-w-3xl min-h-[60vh] flex flex-col justify-center">
                {showLoader ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 size={36} className="text-emerald-600 animate-spin" />
                        <p className="text-xs text-muted-foreground animate-pulse">Loading account dashboard...</p>
                    </div>
                ) : !session ? (
                    // ── AUTHENTICATION STATE (Log In / Sign Up) ──────────────────────
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md w-full mx-auto"
                    >
                        {/* Checkout confirmation banner */}
                        {sessionId && (
                            <div className="mb-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <CheckCircle2 size={16} className="text-emerald-600" />
                                    <span className="font-semibold text-sm text-emerald-800 dark:text-emerald-400">
                                        Thank you for your purchase!
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Sign in or create an account with your checkout email to activate your access and view order details.
                                </p>
                            </div>
                        )}

                        <div className="border border-border rounded-2xl shadow-sm overflow-hidden bg-card">
                            <div className="px-6 py-5 border-b border-border bg-secondary/20 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck size={19} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="font-serif text-lg leading-tight">
                                        {authMode === "signin" ? "Welcome Back" : "Create Account"}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        {authMode === "signin" 
                                            ? "Sign in to access your orders & AI Designer" 
                                            : "Register to track orders and save your designs"}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="px-6 py-6">
                                {/* Mode Toggle Tabs */}
                                <div className="flex gap-2 mb-6 p-1 bg-secondary/50 rounded-lg border border-border">
                                    <button
                                        type="button"
                                        onClick={() => { setAuthMode("signin"); setActionError(null); setSignUpSuccess(false); }}
                                        className={`flex-1 text-xs py-2 rounded-md font-medium transition-colors ${authMode === "signin" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setAuthMode("signup"); setActionError(null); setSignUpSuccess(false); }}
                                        className={`flex-1 text-xs py-2 rounded-md font-medium transition-colors ${authMode === "signup" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                                    >
                                        Create Account
                                    </button>
                                </div>

                                {signUpSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-4 text-center py-4"
                                    >
                                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <Mail className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <h3 className="font-serif text-lg">Confirm your email</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            We've sent a verification link to <strong>{email}</strong>. 
                                            Please check your inbox and click the link to confirm your account and see your orders.
                                        </p>
                                        <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setSignUpSuccess(false)}>
                                            Return to login
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleAuth} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
                                            <div className="relative">
                                                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="pl-9 text-sm"
                                                    autoComplete="email"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
                                            <div className="relative">
                                                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="pl-9 text-sm"
                                                    autoComplete={authMode === "signin" ? "current-password" : "new-password"}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {actionError && (
                                            <p className="text-xs text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg px-3 py-2">
                                                {actionError}
                                            </p>
                                        )}
                                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2" disabled={actionLoading}>
                                            {actionLoading ? (
                                                <><Loader2 size={14} className="animate-spin" /> Working...</>
                                            ) : authMode === "signin" ? (
                                                <><LogIn size={14} /> Sign In</>
                                            ) : (
                                                <><UserPlus size={14} /> Create Account</>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    // ── DASHBOARD STATE (Authenticated User View) ───────────────────
                    <div className="space-y-8 w-full">
                        {/* Dashboard Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
                            <div>
                                <h1 className="font-serif text-3xl md:text-4xl mb-1.5">My Account</h1>
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    Logged in as <span className="font-medium text-foreground">{user?.email}</span>
                                </p>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleSignOut}
                                className="gap-2 border-border/80 text-muted-foreground hover:text-foreground self-start md:self-center"
                            >
                                <LogOut size={14} />
                                Sign Out
                            </Button>
                        </div>

                        {/* Post-Checkout confirmation banner on Dashboard */}
                        {sessionId && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center"
                            >
                                {verifyingSession ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <Loader2 size={18} className="text-emerald-600 animate-spin" />
                                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                                            Confirming your payment details...
                                        </span>
                                    </div>
                                ) : purchaseConfirmed ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                                            <CheckCircle2 size={18} />
                                            <span>Purchase Confirmed!</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {purchaseHasAi
                                                ? "Your order has been verified. AI Designer access is now unlocked."
                                                : "Your order is confirmed and has been registered to your account."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <Loader2 size={18} className="text-amber-600 animate-spin" />
                                        <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                                            Fulfillment status processing...
                                        </span>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Error state */}
                        {ordersError && (
                            <div className="flex items-center gap-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3">
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{ordersError}</span>
                                <Button size="sm" variant="ghost" className="text-red-700 underline ml-auto h-auto p-0" onClick={loadOrders}>
                                    Retry
                                </Button>
                            </div>
                        )}

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
                                    <p className="font-medium text-sm">AI Designer Unlocked</p>
                                    <p className="text-xs text-muted-foreground">
                                        Your AI Floral Designer access is active. Create stunning arrangements now.
                                    </p>
                                </div>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 flex-shrink-0" asChild>
                                    <Link to="/designer-chat">
                                        <ExternalLink size={13} />
                                        Open Designer
                                    </Link>
                                </Button>
                            </motion.div>
                        )}

                        {/* Orders list section */}
                        <div className="space-y-5">
                            <h2 className="font-serif text-xl">Order History</h2>

                            {orders.length === 0 ? (
                                <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-secondary/10">
                                    <Package size={36} className="mx-auto mb-3 opacity-30 text-muted-foreground" />
                                    <p className="font-serif text-base mb-1">No orders found</p>
                                    <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                                        Once you make a purchase using this email, your physical kits and access status will appear here.
                                    </p>
                                    <Button variant="outline" size="sm" className="mt-5 gap-2" asChild>
                                        <Link to="/shop">
                                            Visit the Shop
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
                                            transition={{ delay: i * 0.05 }}
                                            className="border border-border rounded-xl p-5 bg-background shadow-xs hover:border-emerald-600/20 transition-all duration-300"
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
                                                <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border capitalize ${statusColors[order.status] || statusColors.pending}`}>
                                                    {order.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm py-2 border-b border-border/40">
                                                <span className="text-xs text-muted-foreground">Total Paid</span>
                                                <span className="font-medium text-sm">
                                                    ${(order.total_amount / 100).toFixed(2)} {order.currency?.toUpperCase()}
                                                </span>
                                            </div>

                                            {order.order_items && order.order_items.length > 0 && (
                                                <div className="mt-3 space-y-1.5">
                                                    {order.order_items.map((item) => (
                                                        <div key={item.id} className="flex items-center text-xs">
                                                            <span className="text-muted-foreground w-6 font-medium">{item.quantity}x</span>
                                                            <span className="font-medium text-foreground/90">{item.product_name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {order.shipping_address && (
                                                <div className="mt-3 pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
                                                    Shipping to {order.shipping_address.city}, {order.shipping_address.state}
                                                </div>
                                            )}

                                            {/* Detailed Shipping Info for Kits */}
                                            {(() => {
                                                const hasPhysicalKit = order.order_items?.some(item => item.product_type === 'physical') || !!order.shipping_address;
                                                if (!hasPhysicalKit) return null;

                                                let shippingStatusLabel = "Processing";
                                                let shippingDescription = "We are preparing your Acrylic Flower Press Kit for shipment via Amazon MCF.";

                                                if (order.status === 'processing') {
                                                    shippingStatusLabel = "Packaging";
                                                    shippingDescription = "Your order is being processed and packaged at the fulfillment center.";
                                                } else if (order.status === 'shipped') {
                                                    shippingStatusLabel = "Shipped";
                                                    shippingDescription = "Your Acrylic Flower Press Kit has shipped! You will receive tracking details via email.";
                                                } else if (order.status === 'delivered') {
                                                    shippingStatusLabel = "Delivered";
                                                    shippingDescription = "Delivered! Your kit has arrived. Enjoy preserving your beautiful flowers!";
                                                } else if (order.status === 'cancelled') {
                                                    shippingStatusLabel = "Cancelled";
                                                    shippingDescription = "This shipment has been cancelled.";
                                                }

                                                if (order.mcf_status) {
                                                    const ms = order.mcf_status.toUpperCase();
                                                    if (ms === 'SHIPPED') {
                                                        shippingStatusLabel = "Shipped";
                                                        shippingDescription = "Your Acrylic Flower Press Kit has shipped! You will receive tracking details via email.";
                                                    } else if (ms === 'DELIVERED') {
                                                        shippingStatusLabel = "Delivered";
                                                        shippingDescription = "Delivered! Your kit has arrived. Enjoy preserving your beautiful flowers!";
                                                    } else if (ms === 'RECEIVED' || ms === 'PLANNING' || ms === 'PROCESSING') {
                                                        shippingStatusLabel = "Packaging";
                                                        shippingDescription = "Your order is being processed and packaged at the fulfillment center.";
                                                    }
                                                }

                                                return (
                                                    <div className="mt-4 p-3.5 bg-secondary/40 rounded-lg border border-border/40 space-y-2">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-muted-foreground font-medium">Shipping Status</span>
                                                            <span className={`font-semibold capitalize px-2 py-0.5 rounded text-[11px] ${
                                                                shippingStatusLabel === 'Delivered' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' :
                                                                shippingStatusLabel === 'Shipped' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20' :
                                                                'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20'
                                                            }`}>
                                                                {shippingStatusLabel}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                                            {shippingDescription}
                                                        </p>
                                                        {order.mcf_order_id && (
                                                            <div className="text-[10px] text-muted-foreground flex justify-between pt-2 border-t border-border/20">
                                                                <span>Fulfillment ID</span>
                                                                <span className="font-mono">{order.mcf_order_id}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Account;
