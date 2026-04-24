import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Unlock,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Loader2,
    ShoppingBag,
    ExternalLink,
    Key,
    Info,
    Mail,
    Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderSource = "website" | "amazon";

type SubmitState =
    | "idle"
    | "loading"
    | "success"
    | "auth-required"     // order valid, needs user login to claim
    | "invalid-order"     // order found but does not include AI Designer
    | "already-redeemed"  // entitlement already active
    | "not-found";        // no matching order

// ─── State UI config ──────────────────────────────────────────────────────────
const STATE_CONFIG: Record<
    Exclude<SubmitState, "idle" | "loading" | "auth-required">,
    { icon: React.ElementType; color: string; bgColor: string; borderColor: string; title: string; body: string }
> = {
    success: {
        icon: CheckCircle2,
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-500/5",
        borderColor: "border-emerald-500/20",
        title: "Access activated!",
        body: "Your AI Designer access is successfully linked to your account.",
    },
    "invalid-order": {
        icon: AlertCircle,
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-900/10",
        borderColor: "border-amber-200 dark:border-amber-800/30",
        title: "AI Designer not included",
        body: "We found an order with that ID, but it doesn't include AI Designer access. Check you've entered the correct order ID, or purchase AI Designer access below.",
    },
    "already-redeemed": {
        icon: Unlock,
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/10",
        borderColor: "border-blue-200 dark:border-blue-800/30",
        title: "Already activated",
        body: "This order has already been redeemed. If you've already activated it, simply sign in on the chat page.",
    },
    "not-found": {
        icon: XCircle,
        color: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-900/10",
        borderColor: "border-red-200 dark:border-red-800/30",
        title: "Order not found",
        body: "We couldn't find a valid paid order matching that ID and email. Double-check for typos. If you think this is a mistake, contact us.",
    },
};

const SOURCE_TABS: { key: OrderSource; label: string; placeholder: string; example: string }[] = [
    {
        key: "website",
        label: "Website Order",
        placeholder: "HW-20260424-ABC123",
        example: "Found in your Hwabelle order confirmation email",
    },
    {
        key: "amazon",
        label: "Amazon Order",
        placeholder: "113-1234567-1234567",
        example: "Found in your Amazon order confirmation email",
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
const UnlockPage = () => {
    // Session state
    const [session, setSession] = useState<any>(null);

    // Form state
    const [source, setSource] = useState<OrderSource>("website");
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [submitState, setSubmitState] = useState<SubmitState>("idle");
    const [touched, setTouched] = useState({ orderId: false, email: false });

    // Auth Form State (when auth-required)
    const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        // Init session
        supabase.auth.getSession().then(({ data }) => setSession(data.session));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    // Auto-claim if they authenticate while in auth-required state
    useEffect(() => {
        if (session && submitState === "auth-required") {
            verifyOrder();
        }
    }, [session]);

    const activeTab = SOURCE_TABS.find((t) => t.key === source)!;
    const isLoading = submitState === "loading";
    const resultState = submitState !== "idle" && submitState !== "loading" && submitState !== "auth-required" ? submitState : null;

    const orderIdEmpty = orderId.trim() === "";
    const emailInvalid = email.trim() === "" || !email.includes("@");

    const verifyOrder = async () => {
        setSubmitState("loading");
        try {
            const { data, error } = await supabase.functions.invoke("verify-order", {
                body: { order_number: orderId, email },
            });

            if (error) throw new Error(error.message);
            if (!data || !data.state) throw new Error("Invalid response");

            if (data.state === "success") {
                if (session) {
                    setSubmitState("success");
                } else {
                    // Stage A passed, need Stage B
                    setAuthEmail(email); // prepopulate auth email with order email
                    setSubmitState("auth-required");
                }
            } else {
                setSubmitState(data.state as SubmitState);
            }
        } catch (err) {
            console.error("Verification failed:", err);
            setSubmitState("not-found"); // Safe generic fallback
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ orderId: true, email: true });
        if (orderIdEmpty || emailInvalid) return;
        verifyOrder();
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);
        setAuthLoading(true);

        try {
            if (authMode === "signin") {
                const { error } = await supabase.auth.signInWithPassword({
                    email: authEmail,
                    password: authPassword,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email: authEmail,
                    password: authPassword,
                    options: { emailRedirectTo: `${window.location.origin}/unlock` },
                });
                if (error) throw error;
                setAuthError("Check your email for a confirmation link to activate your account.");
                setAuthLoading(false);
                return;
            }
            // If sign in success, onAuthStateChange fires, session sets, and useEffect calls verifyOrder.
        } catch (err: any) {
            setAuthError(err.message || "Authentication failed");
            setAuthLoading(false);
        }
    };

    const handleReset = () => {
        setSubmitState("idle");
        setOrderId("");
        setEmail("");
        setTouched({ orderId: false, email: false });
    };

    return (
        <Layout>
            <section className="py-16 md:py-24 bg-secondary/40 border-b border-border">
                <div className="container max-w-2xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm text-emerald-700 dark:text-emerald-400 mb-6">
                            <Key size={13} />
                            <span>Activate Your Purchase</span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl mb-4">
                            Unlock AI Designer Access
                        </h1>
                        <p className="text-muted-foreground leading-relaxed text-lg max-w-xl mx-auto">
                            Already purchased? Enter your order ID and email below to link your
                            AI Designer access to your account.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 md:py-20 bg-background">
                <div className="container max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-border bg-secondary/20 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                <Sparkles size={19} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="font-serif text-lg leading-tight">Redemption</h2>
                                <p className="text-xs text-muted-foreground">
                                    Links your order to your AI Designer session
                                </p>
                            </div>
                        </div>

                        <div className="px-6 py-6">
                            {/* Hide the source tabs and initial form if auth is required */}
                            {submitState !== "auth-required" && (
                                <>
                                    <div className="mb-5">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2.5">
                                            Where did you purchase?
                                        </p>
                                        <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl">
                                            {SOURCE_TABS.map((tab) => (
                                                <button
                                                    key={tab.key}
                                                    type="button"
                                                    disabled={isLoading || submitState === "success"}
                                                    onClick={() => {
                                                        setSource(tab.key);
                                                        setOrderId("");
                                                        setSubmitState("idle");
                                                        setTouched({ orderId: false, email: false });
                                                    }}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                        source === tab.key
                                                            ? "bg-background shadow-sm text-foreground"
                                                            : "text-muted-foreground hover:text-foreground"
                                                    } disabled:opacity-50`}
                                                >
                                                    {tab.key === "website" ? (
                                                        <ShoppingBag size={13} />
                                                    ) : (
                                                        <ExternalLink size={13} />
                                                    )}
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {resultState && (
                                            <motion.div
                                                key={resultState}
                                                initial={{ opacity: 0, scale: 0.97, y: -6 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.97 }}
                                                transition={{ duration: 0.25 }}
                                                className={`mb-5 rounded-xl border p-4 flex items-start gap-3 ${STATE_CONFIG[resultState].bgColor} ${STATE_CONFIG[resultState].borderColor}`}
                                            >
                                                {(() => {
                                                    const Ic = STATE_CONFIG[resultState].icon;
                                                    return <Ic size={18} className={`mt-0.5 flex-shrink-0 ${STATE_CONFIG[resultState].color}`} />;
                                                })()}
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium mb-0.5">{STATE_CONFIG[resultState].title}</p>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">{STATE_CONFIG[resultState].body}</p>
                                                    {resultState === "success" && (
                                                        <Button size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs h-8 px-3" asChild>
                                                            <Link to="/designer-chat"><Sparkles size={12} /> Open AI Designer</Link>
                                                        </Button>
                                                    )}
                                                    {(resultState === "already-redeemed") && (
                                                        <Button size="sm" variant="outline" className="mt-3 gap-1.5 text-xs h-8 px-3" asChild>
                                                            <Link to="/designer-chat">Sign In to Chat</Link>
                                                        </Button>
                                                    )}
                                                    {(resultState === "not-found" || resultState === "invalid-order") && (
                                                        <button type="button" onClick={handleReset} className="mt-2 text-xs underline underline-offset-2 text-muted-foreground hover:text-foreground transition-colors">
                                                            Try again
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* The Order validation Form */}
                                    {resultState !== "success" && (
                                        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Order ID</label>
                                                <Input
                                                    type="text"
                                                    placeholder={activeTab.placeholder}
                                                    value={orderId}
                                                    onChange={(e) => {
                                                        setOrderId(e.target.value);
                                                        if (resultState) setSubmitState("idle");
                                                    }}
                                                    onBlur={() => setTouched((t) => ({ ...t, orderId: true }))}
                                                    disabled={isLoading}
                                                    autoComplete="off" autoCorrect="off" spellCheck={false}
                                                    className={`font-mono text-sm ${touched.orderId && orderIdEmpty ? "border-red-400 focus-visible:ring-red-400/30" : ""}`}
                                                />
                                                <p className="text-[11px] text-muted-foreground/60 mt-1.5 flex items-center gap-1">
                                                    <Info size={10} /> {activeTab.example}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email address used at checkout</label>
                                                <Input
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        if (resultState) setSubmitState("idle");
                                                    }}
                                                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                                    disabled={isLoading}
                                                    autoComplete="email"
                                                    className={`text-sm ${touched.email && emailInvalid ? "border-red-400 focus-visible:ring-red-400/30" : ""}`}
                                                />
                                            </div>
                                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 mt-1" disabled={isLoading}>
                                                {isLoading ? <><Loader2 size={15} className="animate-spin" /> Verifying…</> : <><Key size={15} /> Activate Access</>}
                                            </Button>
                                        </form>
                                    )}
                                </>
                            )}

                            {/* Auth Required State */}
                            {submitState === "auth-required" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
                                        <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">Order verified!</p>
                                            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-1">
                                                Sign in or create an account to link this purchase to your profile.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-secondary/30 rounded-xl p-5 border border-border">
                                        <div className="flex gap-2 mb-5 p-1 bg-background rounded-lg border border-border">
                                            <button
                                                onClick={() => { setAuthMode("signin"); setAuthError(null); }}
                                                className={`flex-1 text-xs py-2 rounded-md font-medium transition-colors ${authMode === "signin" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                                            >
                                                Sign In
                                            </button>
                                            <button
                                                onClick={() => { setAuthMode("signup"); setAuthError(null); }}
                                                className={`flex-1 text-xs py-2 rounded-md font-medium transition-colors ${authMode === "signup" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                                            >
                                                Create Account
                                            </button>
                                        </div>

                                        <form onSubmit={handleAuth} className="space-y-3">
                                            <div>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                                                    <Input
                                                        type="email"
                                                        required
                                                        placeholder="Email address"
                                                        value={authEmail}
                                                        onChange={(e) => setAuthEmail(e.target.value)}
                                                        className="pl-9 h-10 text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="relative">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                                                    <Input
                                                        type="password"
                                                        required
                                                        placeholder="Password"
                                                        value={authPassword}
                                                        onChange={(e) => setAuthPassword(e.target.value)}
                                                        className="pl-9 h-10 text-sm"
                                                    />
                                                </div>
                                            </div>
                                            {authError && (
                                                <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-md border border-amber-200 dark:border-amber-800">
                                                    {authError}
                                                </p>
                                            )}
                                            <Button type="submit" disabled={authLoading} className="w-full h-10">
                                                {authLoading ? <Loader2 className="animate-spin" size={15} /> : authMode === "signin" ? "Sign In & Claim Access" : "Create Account & Claim Access"}
                                            </Button>
                                        </form>
                                    </div>
                                    <div className="text-center">
                                        <button onClick={handleReset} className="text-xs underline text-muted-foreground">
                                            Cancel and return to order verification
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-16 bg-secondary/30 border-t border-border">
                <div className="container max-w-lg text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-muted-foreground text-sm mb-4">
                            Don't have AI Designer access yet?
                        </p>
                        <Button variant="outline" asChild className="gap-2 border-foreground/20 hover:bg-foreground hover:text-background">
                            <Link to="/designer">
                                <Sparkles size={14} />
                                Learn about AI Designer — $19.99
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default UnlockPage;
