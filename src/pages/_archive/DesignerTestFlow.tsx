import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import FallingPetals from "@/components/animations/FallingPetals";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
    ImagePlus, Send, X, Sparkles, Loader2, ArrowDown,
    Leaf, Flower2, Camera, Upload, Lock, AlertTriangle,
    RotateCcw, Crown, CreditCard, Check, ChevronRight, Zap, ShieldCheck,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

const DESIGNER_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-designer`;

interface Message {
    role: "user" | "assistant";
    content: string;
    imagePreview?: string;
}

type FlowStep = "landing" | "checkout" | "processing" | "active" | "expired";

const DesignerTestFlow = () => {
    const [step, setStep] = useState<FlowStep>("landing");
    const [monthsActive, setMonthsActive] = useState(1);

    // Chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const resetAll = () => {
        setStep("landing");
        setMonthsActive(1);
        setMessages([]);
        setInput("");
        setImage(null);
        setImagePreview(null);
    };

    const simulatePayment = () => {
        setStep("processing");
        setTimeout(() => {
            setStep("active");
        }, 2000);
    };

    const scrollToBottom = () => {
        const container = messagesContainerRef.current;
        if (container) container.scrollTop = container.scrollHeight;
    };

    useEffect(() => {
        if (messages.length > 0) scrollToBottom();
    }, [messages]);

    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (!container) return;
        const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 80;
        setShowScrollButton(!atBottom);
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
        if (step !== "active") return;
        const text = messageText ?? input.trim();
        if (!text && !image) return;

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
            const history = messages.map(m => ({ role: m.role, content: m.content }));

            if (currentImage) {
                const formData = new FormData();
                formData.append("message", text);
                formData.append("image", currentImage);
                formData.append("history", JSON.stringify(history));
                response = await fetch(DESIGNER_URL, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                    },
                    body: formData,
                });
            } else {
                response = await fetch(DESIGNER_URL, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: text, history }),
                });
            }

            const data = await response.json();
            if (!response.ok || data.error) throw new Error(data.error || "Failed to get a response");

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.reply },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: `Error: ${err instanceof Error ? err.message : "Something went wrong. Please try again."}`,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const isEmpty = messages.length === 0;

    // Flow step labels for the progress bar
    const flowSteps = [
        { key: "landing", label: "Landing Page" },
        { key: "checkout", label: "Checkout" },
        { key: "active", label: "AI Designer" },
    ];
    const currentStepIndex = step === "expired" ? 2 :
        step === "processing" ? 1 :
            flowSteps.findIndex(s => s.key === step);

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-background">
            {/* ─── TEST MODE BANNER ─── */}
            <div className="bg-amber-500 text-white flex-shrink-0 z-50">
                <div className="container flex items-center justify-between py-2 px-4 text-sm">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={14} />
                        <span className="font-medium">TEST MODE</span>
                        <span className="hidden sm:inline">— Complete subscriber journey</span>
                    </div>
                    <button
                        onClick={resetAll}
                        className="flex items-center gap-1.5 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md transition-colors text-xs font-medium"
                    >
                        <RotateCcw size={12} />
                        Reset
                    </button>
                </div>
            </div>

            {/* ─── FLOW PROGRESS BAR ─── */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800/50 flex-shrink-0 z-40">
                <div className="container flex items-center gap-2 py-2.5 px-4">
                    {/* Step indicators */}
                    <div className="flex items-center gap-1 flex-1 justify-center">
                        {flowSteps.map((s, i) => (
                            <div key={s.key} className="flex items-center gap-1">
                                <button
                                    onClick={() => {
                                        if (s.key === "landing") { setStep("landing"); }
                                        else if (s.key === "checkout") { setStep("checkout"); }
                                        else if (s.key === "active") { setStep("active"); }
                                    }}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${i <= currentStepIndex
                                        ? i === currentStepIndex
                                            ? "bg-emerald-600 text-white"
                                            : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400"
                                        : "bg-white dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-700"
                                        }`}
                                >
                                    {i < currentStepIndex ? (
                                        <Check size={11} />
                                    ) : (
                                        <span className="w-4 text-center">{i + 1}</span>
                                    )}
                                    <span className="hidden sm:inline">{s.label}</span>
                                </button>
                                {i < flowSteps.length - 1 && (
                                    <ChevronRight size={12} className={`${i < currentStepIndex ? "text-emerald-500" : "text-amber-300 dark:text-amber-700"}`} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Quick jump */}
                    <div className="hidden md:flex items-center gap-1.5 ml-4">
                        <div className="w-px h-5 bg-amber-300 dark:bg-amber-700" />
                        <button
                            onClick={() => setStep("expired")}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${step === "expired"
                                ? "bg-red-600 text-white"
                                : "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                                }`}
                        >
                            Expire
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── SITE HEADER ─── */}
            <Header />

            {/* ─── MAIN CONTENT ─── */}
            <div className="flex-1 flex flex-col overflow-hidden relative" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--secondary)) 100%)" }}>
                <FallingPetals />

                {/* ══════════════ STEP 1: LANDING PAGE ══════════════ */}
                {step === "landing" && (
                    <div className="flex-1 overflow-y-auto pt-16 md:pt-20">
                        <div className="container max-w-3xl py-16 px-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center"
                            >
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/5 rounded-full px-4 py-2 mb-8">
                                    <Sparkles size={14} className="text-emerald-600" />
                                    <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">AI-Powered Floral Preservation</span>
                                    <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">$19.99/mo</span>
                                </div>

                                <h1 className="font-serif text-4xl md:text-5xl mb-4">
                                    Your Personal Flower
                                    <br />
                                    <span className="text-emerald-600">Preservation Expert</span>
                                </h1>

                                <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                                    Upload a photo, ask a question, and get expert guidance on pressing techniques, design ideas, and colour preservation.
                                </p>

                                {/* Features */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
                                    {[
                                        { icon: Camera, text: "Photo flower ID" },
                                        { icon: Sparkles, text: "Design inspiration" },
                                        { icon: Leaf, text: "Pressing guidance" },
                                    ].map((f, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                                            className="flex items-center gap-2 justify-center text-sm text-muted-foreground"
                                        >
                                            <f.icon size={16} className="text-emerald-600" />
                                            <span>{f.text}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                    className="flex flex-col sm:flex-row gap-3 justify-center"
                                >
                                    <Button
                                        size="lg"
                                        className="bg-foreground hover:bg-foreground/90 text-background gap-2 text-base px-8"
                                        onClick={() => setStep("checkout")}
                                    >
                                        <Zap size={16} />
                                        Start for $19.99/mo
                                    </Button>
                                </motion.div>
                                <p className="text-xs text-muted-foreground/50 mt-3">Cancel anytime · Instant access</p>

                                {/* Mock chat preview */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    className="mt-14 max-w-md mx-auto bg-card/80 backdrop-blur border border-border rounded-2xl overflow-hidden shadow-lg"
                                >
                                    <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2.5 bg-card">
                                        <div className="w-7 h-7 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                                            <Sparkles size={12} className="text-emerald-600" />
                                        </div>
                                        <span className="text-xs font-medium">Floral Designer</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-auto" />
                                    </div>
                                    <div className="p-4 space-y-3">
                                        <div className="flex gap-2 justify-end">
                                            <div className="bg-foreground text-background rounded-2xl rounded-br-sm px-3 py-2 text-xs max-w-[75%]">
                                                I have a fresh rose from my garden — which press plate should I use?
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Sparkles size={8} className="text-emerald-600" />
                                            </div>
                                            <div className="bg-secondary/80 rounded-2xl rounded-bl-sm px-3 py-2 text-xs max-w-[85%] text-left">
                                                <strong>Use the large 10×10" acrylic plates!</strong> Disassemble the rose into individual petals, layer them between your blotting papers and reusable drying boards, and you'll be able to monitor the drying progress through the clear acrylic.
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* ══════════════ STEP 2: CHECKOUT ══════════════ */}
                {step === "checkout" && (
                    <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto pt-16 md:pt-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            className="w-full max-w-md"
                        >
                            <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                                {/* Checkout header */}
                                <div className="px-6 py-5 border-b border-border bg-secondary/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                                            <ShieldCheck size={20} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <h2 className="font-serif text-lg">Secure Checkout</h2>
                                            <p className="text-xs text-muted-foreground">AI Designer — Monthly</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order summary */}
                                <div className="px-6 py-4 border-b border-border/50">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm">AI Floral Designer</span>
                                        <span className="text-sm font-medium">$19.99/mo</span>
                                    </div>
                                    <div className="space-y-1.5 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-2"><Check size={12} className="text-emerald-500" /> Advice tailored to your acrylic press kit</div>
                                        <div className="flex items-center gap-2"><Check size={12} className="text-emerald-500" /> Photo flower ID + pressing guidance</div>
                                        <div className="flex items-center gap-2"><Check size={12} className="text-emerald-500" /> Large & mini press size recommendations</div>
                                        <div className="flex items-center gap-2"><Check size={12} className="text-emerald-500" /> 9-module preservation course included</div>
                                    </div>
                                </div>

                                {/* Simulated card form */}
                                <div className="px-6 py-5 space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground block mb-1.5">Card number</label>
                                        <div className="bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
                                            <CreditCard size={14} />
                                            <span>•••• •••• •••• 4242</span>
                                            <span className="ml-auto text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded">Test</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Expiry</label>
                                            <div className="bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-muted-foreground">12/28</div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground block mb-1.5">CVC</label>
                                            <div className="bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-muted-foreground">•••</div>
                                        </div>
                                    </div>

                                    {/* Total */}
                                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                        <span className="text-sm font-medium">Total today</span>
                                        <span className="text-lg font-bold">$19.99</span>
                                    </div>

                                    <Button
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-sm py-5"
                                        onClick={simulatePayment}
                                    >
                                        <Lock size={14} />
                                        Subscribe & Get Access
                                    </Button>

                                    <p className="text-[10px] text-center text-muted-foreground/50">
                                        Simulated checkout · No real charge
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* ══════════════ STEP 2.5: PROCESSING ══════════════ */}
                {step === "processing" && (
                    <div className="flex-1 flex items-center justify-center p-4 pt-16 md:pt-20">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <motion.div
                                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500/15 flex items-center justify-center"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader2 size={28} className="text-emerald-600" />
                            </motion.div>
                            <h3 className="font-serif text-xl mb-2">Processing payment...</h3>
                            <p className="text-sm text-muted-foreground">Setting up your AI Designer access</p>
                        </motion.div>
                    </div>
                )}

                {/* ══════════════ STEP 3: ACTIVE CHAT ══════════════ */}
                {step === "active" && (
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
                                    {/* Welcome banner after payment */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="w-full max-w-md bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 mb-8 text-center"
                                    >
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <Check size={16} className="text-emerald-600" />
                                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Subscription active</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">You're all set! Ask about your acrylic press kit or upload a flower photo to get started.</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
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
                                        transition={{ delay: 0.4, duration: 0.5 }}
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
                                                transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
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
                                                        <div className="prose prose-sm max-w-none text-foreground leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:text-foreground [&_p]:!mb-5 [&_p]:leading-relaxed [&_li]:text-foreground [&_li]:!my-2 [&_strong]:text-foreground [&_h1]:font-serif [&_h2]:font-serif [&_h3]:font-serif [&_a]:text-emerald-600 dark:[&_a]:text-emerald-400 [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-xs [&_br]:block [&_br]:content-[''] [&_br]:mt-3">
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
                                    <div ref={messagesEndRef} />
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

                        {/* Input Area */}
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
                                    <Textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={image ? "Add a question about this image..." : "Ask about flowers, pressing, or design..."} className="flex-1 resize-none min-h-[36px] max-h-[120px] text-sm border-0 bg-transparent focus-visible:ring-0 shadow-none rounded-none px-1" rows={1} />
                                    <Button onClick={() => sendMessage()} disabled={isLoading || (!input.trim() && !image)} size="icon" className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-30 disabled:bg-muted-foreground/20 disabled:text-muted-foreground transition-all">
                                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
                                    </Button>
                                </div>
                                <p className="text-[11px] text-muted-foreground/60 mt-2 text-center">Enter to send · Shift+Enter for new line</p>
                            </div>
                        </div>
                    </>
                )}

                {/* ══════════════ EXPIRED STATE ══════════════ */}
                {step === "expired" && (
                    <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto pt-16 md:pt-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center max-w-md"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
                                <Lock size={32} className="text-red-500" />
                            </div>
                            <h2 className="font-serif text-2xl md:text-3xl mb-3">Your subscription has expired</h2>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                Renew your AI Designer subscription to continue getting expert guidance on pressing techniques, flower identification, and botanical design.
                            </p>
                            <Button
                                size="lg"
                                className="bg-foreground hover:bg-foreground/90 text-background gap-2"
                                onClick={() => setStep("checkout")}
                            >
                                <Crown size={16} />
                                Resubscribe — $19.99/mo
                            </Button>
                            <p className="text-xs text-muted-foreground/50 mt-4">
                                Your previous conversations are saved and will be available when you resubscribe.
                            </p>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DesignerTestFlow;
