import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import FallingPetals from "@/components/animations/FallingPetals";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Send, X, Sparkles, Loader2, ArrowDown, Leaf, Flower2, Camera, Upload } from "lucide-react";
import ReactMarkdown from "react-markdown";

const DESIGNER_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-designer`;

interface Message {
    role: "user" | "assistant";
    content: string;
    imagePreview?: string;
}

const DesignerChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
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

            if (!response.ok || data.error) {
                throw new Error(data.error || "Failed to get a response");
            }

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

    return (
        <div className="h-screen flex flex-col overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--secondary)) 100%)" }}>
            {/* Site Header */}
            <Header />
            <FallingPetals />

            {/* Chat Header */}
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

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto min-h-0"
            >
                {isEmpty ? (
                    <div className="container max-w-2xl py-12 px-4 flex flex-col items-center">
                        {/* Photo Upload Hero */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
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

                        {/* Upload Drop Zone */}
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full max-w-md border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all duration-300 hover:bg-emerald-500/5 group cursor-pointer mb-10"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center transition-colors">
                                <Upload size={24} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-sm font-medium text-foreground">Upload a flower photo</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG, HEIC — or drag and drop</p>
                        </motion.button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 w-full max-w-md mb-8">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">or ask a question</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* Quick Prompts */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-md">
                            {[
                                { text: "Best flowers for beginners to press", icon: Flower2 },
                                { text: "How do I prevent mold when pressing?", icon: Leaf },
                                { text: "Design ideas for framing pressed flowers", icon: Sparkles },
                                { text: "What drying support tools do you recommend?", icon: Flower2 },
                            ].map((prompt, i) => (
                                <motion.button
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 + i * 0.06, duration: 0.4 }}
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
                                    <div
                                        className={`max-w-[80%] ${msg.role === "user"
                                            ? "bg-foreground text-background rounded-2xl rounded-br-md px-4 py-3 text-sm shadow-sm"
                                            : "text-foreground"
                                            }`}
                                    >
                                        {msg.imagePreview && (
                                            <div className="mb-2">
                                                <img
                                                    src={msg.imagePreview}
                                                    alt="Uploaded"
                                                    className="max-w-[220px] max-h-[220px] object-cover rounded-xl shadow-sm"
                                                />
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
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-start gap-3"
                            >
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500/15 to-green-600/15 border border-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex items-center gap-1.5 py-3 px-1">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            className="w-2 h-2 bg-emerald-500/60 rounded-full"
                                            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
                                            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Scroll to bottom button */}
            <AnimatePresence>
                {showScrollButton && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToBottom}
                        className="fixed bottom-36 right-6 z-20 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                        <ArrowDown size={16} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="backdrop-blur-md border-t border-divider/50 flex-shrink-0" style={{ background: "hsla(var(--background), 0.9)" }}>
                <div className="container max-w-3xl py-4 px-4">
                    {imagePreview && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-3 relative inline-block"
                        >
                            <img
                                src={imagePreview}
                                alt="Selected"
                                className="h-20 w-20 object-cover rounded-xl border border-border shadow-sm"
                            />
                            <button
                                onClick={clearImage}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                            >
                                <X size={12} />
                            </button>
                        </motion.div>
                    )}

                    <div className="flex gap-2 items-end bg-secondary/50 rounded-2xl border border-border/60 focus-within:border-emerald-500/30 transition-colors p-1.5 pl-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl hover:bg-emerald-500/10 transition-colors text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400"
                            title="Upload flower photo"
                        >
                            <ImagePlus size={18} />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />

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
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Send size={14} />
                            )}
                        </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground/60 mt-2 text-center">
                        Enter to send · Shift+Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DesignerChat;
