import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import FallingPetals from "@/components/animations/FallingPetals";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
    ImagePlus, Send, X, Sparkles, Loader2, ArrowDown,
    Leaf, Flower2, Camera, Upload, Lock, AlertCircle,
    Check, ChevronRight, LogIn, UserPlus, ShieldCheck,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

const DESIGNER_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-designer`;

interface Message {
    role: "user" | "assistant";
    content: string;
    imagePreview?: string;
}

// ─── Access states ─────────────────────────────────────────────────────────────
// unauthenticated  → show sign-in / sign-up UI
// authenticating   → loading spinner while we resolve session
// activation       → paid, just came from checkout — show activation step
// checking         → verifying entitlement server-side
// entitled         → access granted, show chat
// no-access        → authenticated but no entitlement — show purchase CTA
// error            → something went wrong
type AccessState =
    | "unauthenticated"
    | "authenticating"
    | "activation"
    | "checking"
    | "entitled"
    | "no-access"
    | "error";

type AuthMode = "signin" | "signup";

const DesignerChat = () => {
    const [searchParams] = useSearchParams();
    const sessionIdFromUrl = searchParams.get("session_id");

    // ─── Access state ──────────────────────────────────────────────────────────
    const [accessState, setAccessState] = useState<AccessState>("authenticating");
    const [authMode, setAuthMode] = useState<AuthMode>("signin");
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");
    const [authError, setAuthError] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(false);

    // ─── Chat state ────────────────────────────────────────────────────────────
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // ─── Bootstrap: resolve session on mount ──────────────────────────────────
    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            // If there's a session_id in the URL, the user just came from checkout.
            // Show the activation step before asking them to sign in.
            if (sessionIdFromUrl) {
                // Briefly check if they're already signed in
                const { data: { session } } = await supabase.auth.getSession();
                if (!cancelled) {
                    if (session) {
                        // Already authenticated — skip activation, go straight to entitlement check
                        checkEntitlement(session.access_token);
                    } else {
                        // Show activation step (post-checkout sign-in/up prompt)
                        setAccessState("activation");
                    }
                }
                return;
            }

            // Normal navigation — check current session
            const { data: { session } } = await supabase.auth.getSession();
            if (!cancelled) {
                if (session) {
                    checkEntitlement(session.access_token);
                } else {
                    setAccessState("unauthenticated");
                }
            }
        }

        bootstrap();

        // Listen for auth state changes (e.g. user signs in from another tab)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!cancelled && session) {
                checkEntitlement(session.access_token);
            }
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, [sessionIdFromUrl]);

    // ─── Server-side entitlement check ────────────────────────────────────────
    const checkEntitlement = useCallback(async (jwt: string) => {
        setAccessState("checking");
        try {
            const res = await supabase.functions.invoke("get-entitlement", {
                headers: { Authorization: `Bearer ${jwt}` },
            });

            if (res.error) throw new Error(res.error.message);

            const data = res.data as { has_access: boolean };
            setAccessState(data.has_access ? "entitled" : "no-access");
        } catch (err) {
            console.error("Entitlement check failed:", err);
            setAccessState("error");
        }
    }, []);

    // ─── Auth handlers ─────────────────────────────────────────────────────────
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
                    options: { emailRedirectTo: `${window.location.origin}/designer-chat` },
                });
                if (error) throw error;
                // After sign-up, Supabase may require email confirmation
                // onAuthStateChange will fire and trigger checkEntitlement when confirmed
                setAuthError("Check your email for a confirmation link to activate your account.");
                setAuthLoading(false);
                return;
            }
            // signIn success — onAuthStateChange fires and calls checkEntitlement
        } catch (err: any) {
            setAuthError(err.message || "Authentication failed");
        } finally {
            setAuthLoading(false);
        }
    };

    // ─── Chat handlers ─────────────────────────────────────────────────────────
    const scrollToBottom = () => {
        const c = messagesContainerRef.current;
        if (c) c.scrollTop = c.scrollHeight;
    };

    useEffect(() => {
        if (messages.length > 0) scrollToBottom();
    }, [messages]);

    const handleScroll = () => {
        const c = messagesContainerRef.current;
        if (!c) return;
        setShowScrollButton(c.scrollHeight - c.scrollTop - c.clientHeight > 80);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const sendMessage = async (messageText?: string) => {
        if (accessState !== "entitled") return;
        const text = messageText ?? input.trim();
        if (!text && !image) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setAccessState("unauthenticated");
            return;
        }

        const userMsg: Message = {
            role: "user",
            content: text || "Please analyse this image and provide botanical identification and design suggestions.",
            imagePreview: imagePreview || undefined,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        const currentImage = image;
        clearImage();
        setIsLoading(true);

        try {
            let response: Response;
            const history = messages.map((m) => ({ role: m.role, content: m.content }));
            const authHeader = { Authorization: `Bearer ${session.access_token}` };

            if (currentImage) {
                const formData = new FormData();
                formData.append("message", text);
                formData.append("image", currentImage);
                formData.append("history", JSON.stringify(history));
                response = await fetch(DESIGNER_URL, { method: "POST", headers: authHeader, body: formData });
            } else {
                response = await fetch(DESIGNER_URL, {
                    method: "POST",
                    headers: { ...authHeader, "Content-Type": "application/json" },
                    body: JSON.stringify({ message: text, history }),
                });
            }

            const data = await response.json();
            if (!response.ok || data.error) throw new Error(data.error || "Failed to get a response");

            // If the server says we lost entitlement mid-session (403), gate again
            if (response.status === 403) {
                setAccessState("no-access");
                return;
            }

            setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: `Error: ${err instanceof Error ? err.message : "Something went wrong."}` },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const isEmpty = messages.length === 0;

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="h-screen flex flex-col overflow-hidden bg-background">
            <Header />

            <div className="flex-1 flex flex-col overflow-hidden relative" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--secondary)) 100%)" }}>
                <FallingPetals />

                {/* ── Loading / checking ── */}
                {(accessState === "authenticating" || accessState === "checking") && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <motion.div
                                className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-500/10 flex items-center justify-center"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader2 size={24} className="text-emerald-600" />
                            </motion.div>
                            <p className="text-sm text-muted-foreground">
                                {accessState === "authenticating" ? "Loading..." : "Verifying access…"}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Post-checkout activation step ── */}
                {/* Shown when ?session_id= is in the URL and user is not yet authenticated. */}
                {/* Explains why sign-in is required and pre-fills the email if possible. */}
                {accessState === "activation" && (
                    <div className="flex-1 flex items-center justify-center p-4 pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-md"
                        >
                            {/* Confirmation banner */}
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 mb-6 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center">
                                        <Check size={16} className="text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                        Payment confirmed
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Your AI Designer access has been purchased successfully.
                                </p>
                            </div>

                            {/* Activation explanation */}
                            <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden mb-6">
                                <div className="px-6 py-5 border-b border-border bg-secondary/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                            <ShieldCheck size={20} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <h2 className="font-serif text-lg">One last step</h2>
                                            <p className="text-xs text-muted-foreground">Sign in to activate your AI Designer</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-5">
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                        To access your AI Designer, sign in or create an account using the{" "}
                                        <strong>same email address you used at checkout.</strong> This links
                                        your purchase to your account securely.
                                    </p>

                                    <div className="flex gap-1 p-1 bg-secondary/40 rounded-lg mb-5">
                                        {(["signin", "signup"] as AuthMode[]).map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => { setAuthMode(mode); setAuthError(null); }}
                                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition-all ${authMode === mode
                                                    ? "bg-background shadow-sm text-foreground"
                                                    : "text-muted-foreground hover:text-foreground"
                                                    }`}
                                            >
                                                {mode === "signin" ? <LogIn size={12} /> : <UserPlus size={12} />}
                                                {mode === "signin" ? "Sign In" : "Create Account"}
                                            </button>
                                        ))}
                                    </div>

                                    <form onSubmit={handleAuth} className="space-y-3">
                                        <Input
                                            type="email"
                                            placeholder="Your checkout email"
                                            value={authEmail}
                                            onChange={(e) => setAuthEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                            className="text-sm"
                                        />
                                        <Input
                                            type="password"
                                            placeholder={authMode === "signup" ? "Create a password" : "Password"}
                                            value={authPassword}
                                            onChange={(e) => setAuthPassword(e.target.value)}
                                            required
                                            autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                                            className="text-sm"
                                        />

                                        {authError && (
                                            <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-lg px-3 py-2.5">
                                                <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                                                <span>{authError}</span>
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                                            disabled={authLoading}
                                        >
                                            {authLoading ? (
                                                <Loader2 size={14} className="animate-spin" />
                                            ) : authMode === "signin" ? (
                                                <><LogIn size={14} /> Sign In & Activate</>
                                            ) : (
                                                <><UserPlus size={14} /> Create Account & Activate</>
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            </div>

                            <p className="text-center text-xs text-muted-foreground/60">
                                Need help?{" "}
                                <Link to="/faq" className="underline underline-offset-2 hover:text-foreground transition-colors">
                                    Visit our FAQ
                                </Link>
                            </p>
                        </motion.div>
                    </div>
                )}

                {/* ── Unauthenticated: normal sign-in (not post-checkout) ── */}
                {accessState === "unauthenticated" && (
                    <div className="flex-1 flex items-center justify-center p-4 pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-sm"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                                    <Sparkles size={28} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h1 className="font-serif text-2xl mb-2">AI Floral Designer</h1>
                                <p className="text-sm text-muted-foreground">Sign in to access your AI Designer</p>
                            </div>

                            <div className="bg-card border border-border rounded-2xl shadow-lg p-6">
                                <div className="flex gap-1 p-1 bg-secondary/40 rounded-lg mb-5">
                                    {(["signin", "signup"] as AuthMode[]).map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => { setAuthMode(mode); setAuthError(null); }}
                                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-md transition-all ${authMode === mode
                                                ? "bg-background shadow-sm text-foreground"
                                                : "text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            {mode === "signin" ? <LogIn size={12} /> : <UserPlus size={12} />}
                                            {mode === "signin" ? "Sign In" : "Create Account"}
                                        </button>
                                    ))}
                                </div>

                                <form onSubmit={handleAuth} className="space-y-3">
                                    <Input
                                        type="email"
                                        placeholder="Email address"
                                        value={authEmail}
                                        onChange={(e) => setAuthEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        className="text-sm"
                                    />
                                    <Input
                                        type="password"
                                        placeholder={authMode === "signup" ? "Create a password" : "Password"}
                                        value={authPassword}
                                        onChange={(e) => setAuthPassword(e.target.value)}
                                        required
                                        autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                                        className="text-sm"
                                    />

                                    {authError && (
                                        <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-lg px-3 py-2.5">
                                            <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                                            <span>{authError}</span>
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                                        disabled={authLoading}
                                    >
                                        {authLoading ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : authMode === "signin" ? (
                                            <><LogIn size={14} /> Sign In</>
                                        ) : (
                                            <><UserPlus size={14} /> Create Account</>
                                        )}
                                    </Button>
                                </form>

                                <p className="text-center text-xs text-muted-foreground/60 mt-4">
                                    Don't have access?{" "}
                                    <Link to="/designer" className="underline underline-offset-2 hover:text-foreground transition-colors">
                                        Get AI Designer
                                    </Link>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* ── No access: authenticated but no entitlement ── */}
                {accessState === "no-access" && (
                    <div className="flex-1 flex items-center justify-center p-4 pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center max-w-md"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
                                <Lock size={32} className="text-amber-500" />
                            </div>
                            <h2 className="font-serif text-2xl md:text-3xl mb-3">AI Designer Access Required</h2>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                Your account doesn't have an active AI Designer entitlement. Purchase access
                                to get expert guidance on pressing techniques, flower identification, and botanical design.
                            </p>
                            <Button
                                size="lg"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                                asChild
                            >
                                <Link to="/designer">
                                    <Sparkles size={16} />
                                    Get AI Designer — $19.99
                                    <ChevronRight size={16} />
                                </Link>
                            </Button>
                            <p className="text-xs text-muted-foreground/50 mt-4">
                                Already purchased? Sign out and sign in with your checkout email.
                            </p>
                        </motion.div>
                    </div>
                )}

                {/* ── Error state ── */}
                {accessState === "error" && (
                    <div className="flex-1 flex items-center justify-center p-4 pt-20">
                        <div className="text-center max-w-sm">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
                                <AlertCircle size={24} className="text-red-500" />
                            </div>
                            <h2 className="font-serif text-xl mb-2">Something went wrong</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                We couldn't verify your access. Please try refreshing the page.
                            </p>
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                Refresh
                            </Button>
                        </div>
                    </div>
                )}

                {/* ── Active chat ── */}
                {accessState === "entitled" && (
                    <>
                        {/* Chat sub-header */}
                        <div className="border-b border-divider/50 backdrop-blur-md z-10 flex-shrink-0 pt-16 md:pt-20" style={{ background: "hsla(var(--background), 0.85)" }}>
                            <div className="container max-w-3xl py-4 px-4 flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-600/20 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                        <Sparkles size={18} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                                </div>
                                <div>
                                    <h1 className="font-serif text-lg leading-tight">Floral Designer</h1>
                                    <p className="text-xs text-muted-foreground">Your botanical companion</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={messagesContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto min-h-0"
                        >
                            {isEmpty ? (
                                <div className="container max-w-2xl py-12 px-4 flex flex-col items-center">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1, duration: 0.6 }}
                                        className="text-center mb-10 w-full"
                                    >
                                        <motion.div
                                            className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-emerald-500/15 flex items-center justify-center"
                                            animate={{ rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <Camera size={32} className="text-emerald-600 dark:text-emerald-400" />
                                        </motion.div>
                                        <h2 className="font-serif text-2xl md:text-3xl mb-3">Upload a flower to get started</h2>
                                        <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                                            Snap or upload a photo and I'll identify it, tell you how to press it, and suggest designs — instantly.
                                        </p>
                                    </motion.div>

                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full max-w-md border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all duration-300 hover:bg-emerald-500/5 group cursor-pointer mb-10"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center transition-colors">
                                            <Upload size={24} className="text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <p className="text-sm font-medium text-foreground">Upload a flower photo</p>
                                        <p className="text-xs text-muted-foreground">JPG, PNG, HEIC — or drag and drop</p>
                                    </motion.button>

                                    <div className="flex items-center gap-4 w-full max-w-md mb-8">
                                        <div className="flex-1 h-px bg-border" />
                                        <span className="text-xs text-muted-foreground uppercase tracking-widest">or ask a question</span>
                                        <div className="flex-1 h-px bg-border" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md">
                                        {[
                                            { text: "What's included in my flower press kit?", icon: Flower2 },
                                            { text: "Which press plate should I use for peonies?", icon: Leaf },
                                            { text: "How do I use the reusable drying boards?", icon: Sparkles },
                                            { text: "Can I take the kit on nature walks?", icon: Flower2 },
                                        ].map((prompt, i) => (
                                            <motion.button
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                                                onClick={() => sendMessage(prompt.text)}
                                                className="group text-left px-4 py-3 text-sm rounded-xl border border-border/60 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 text-muted-foreground hover:text-foreground flex items-start gap-3"
                                            >
                                                <prompt.icon size={15} className="mt-0.5 flex-shrink-0 text-muted-foreground/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                                                <span>{prompt.text}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="container max-w-3xl py-6 px-4 space-y-5">
                                    <AnimatePresence initial={false}>
                                        {messages.map((msg, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                            >
                                                {msg.role === "assistant" && (
                                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-1">
                                                        <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                )}
                                                <div className={`max-w-[80%] ${msg.role === "user" ? "bg-foreground text-background rounded-2xl rounded-br-md px-4 py-3 text-sm shadow-sm" : "bg-secondary/80 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-foreground"}`}>
                                                    {msg.imagePreview && (
                                                        <div className="mb-2">
                                                            <img src={msg.imagePreview} alt="Uploaded" className="max-w-[220px] max-h-[220px] object-cover rounded-xl shadow-sm" />
                                                        </div>
                                                    )}
                                                    {msg.role === "assistant" ? (
                                                        <div className="prose prose-sm max-w-none text-foreground leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:text-foreground [&_p]:!mb-5 [&_p]:leading-relaxed [&_li]:text-foreground [&_li]:!my-2 [&_strong]:text-foreground [&_h1]:font-serif [&_h2]:font-serif [&_h3]:font-serif [&_a]:text-emerald-600 dark:[&_a]:text-emerald-400 [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-xs">
                                                            <ReactMarkdown>{msg.content.replace(/\n(?!\n)/g, '\n\n')}</ReactMarkdown>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {isLoading && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-1">
                                                <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div className="flex items-center gap-1.5 py-3 px-1">
                                                {[0, 1, 2].map((i) => (
                                                    <motion.span key={i} className="w-2 h-2 bg-emerald-500/60 rounded-full" animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }} />
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Scroll button */}
                        <AnimatePresence>
                            {showScrollButton && (
                                <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={scrollToBottom} className="fixed bottom-36 right-6 z-20 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                    <ArrowDown size={16} />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Input area */}
                        <div className="backdrop-blur-md border-t border-divider/50 flex-shrink-0" style={{ background: "hsla(var(--background), 0.9)" }}>
                            <div className="container max-w-3xl py-4 px-4">
                                {imagePreview && (
                                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-3 relative inline-block">
                                        <img src={imagePreview} alt="Selected" className="h-20 w-20 object-cover rounded-xl border border-border shadow-sm" />
                                        <button onClick={clearImage} className="absolute -top-2 -right-2 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
                                            <X size={12} />
                                        </button>
                                    </motion.div>
                                )}
                                <div className="flex gap-2 items-end bg-secondary/50 rounded-2xl border border-border/60 focus-within:border-emerald-500/30 transition-colors p-1.5 pl-2">
                                    <button onClick={() => fileInputRef.current?.click()} className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-emerald-500/10 transition-colors text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400" title="Upload flower photo">
                                        <ImagePlus size={18} />
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                                    <Textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={image ? "Add a question about this image..." : "Ask about flowers, pressing, or design..."}
                                        className="flex-1 resize-none min-h-[36px] max-h-[120px] text-sm border-0 bg-transparent focus-visible:ring-0 shadow-none rounded-none px-1"
                                        rows={1}
                                    />
                                    <Button
                                        onClick={() => sendMessage()}
                                        disabled={isLoading || (!input.trim() && !image)}
                                        size="icon"
                                        className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-30 disabled:bg-muted-foreground/20 disabled:text-muted-foreground transition-all"
                                    >
                                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
                                    </Button>
                                </div>
                                <p className="text-[11px] text-muted-foreground/60 mt-2 text-center">Enter to send · Shift+Enter for new line</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DesignerChat;
