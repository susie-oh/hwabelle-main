import { useState, useRef, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, Send, X, Sparkles, Loader2, ArrowDown } from "lucide-react";
import ReactMarkdown from "react-markdown";

const DESIGNER_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-designer`;

interface Message {
    role: "user" | "assistant";
    content: string;
    imagePreview?: string;
}

const textPrompts = [
    "What flowers are best for beginners to press?",
    "How do I prevent mold when pressing flowers?",
    "Give me design ideas for framing pressed flowers",
    "What drying support tools do you recommend?",
    "Teach me about flower disassembly for pressing",
];

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

            // Build conversation history for context (exclude image previews)
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
        <Layout>
            <div className="min-h-screen flex flex-col pt-16 md:pt-20 bg-background">
                {/* Header */}
                <div className="border-b border-divider bg-background/95 backdrop-blur-sm sticky top-16 md:top-20 z-10">
                    <div className="container py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                            <Sparkles size={16} className="text-foreground" />
                        </div>
                        <div>
                            <h1 className="font-serif text-lg leading-tight">AI Designer Assistant</h1>
                            <p className="text-xs text-muted-foreground">Upload a flower photo or ask anything botanical — TEST MODE</p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto"
                >
                    {isEmpty ? (
                        <div className="container max-w-2xl py-16 px-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center mb-12"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                                    <Sparkles size={28} className="text-foreground" />
                                </div>
                                <h2 className="font-serif text-display mb-3">How can I help?</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Upload a photo of flowers or plants and I'll identify them, suggest pressing techniques, and help you create beautiful botanical designs.
                                </p>
                            </motion.div>

                            <div className="space-y-2">
                                <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-widest">Try asking</p>
                                {textPrompts.map((prompt, i) => (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.08, duration: 0.4 }}
                                        onClick={() => sendMessage(prompt)}
                                        className="w-full text-left px-4 py-3 text-sm border border-border hover:border-foreground/20 hover:bg-secondary transition-all duration-200 text-muted-foreground hover:text-foreground"
                                    >
                                        {prompt}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="container max-w-2xl py-8 px-4 space-y-6">
                            <AnimatePresence initial={false}>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {msg.role === "assistant" && (
                                            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                                                <Sparkles size={14} className="text-foreground" />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[80%] ${msg.role === "user"
                                                ? "bg-foreground text-background px-4 py-3 text-sm"
                                                : "text-foreground"
                                                }`}
                                        >
                                            {msg.imagePreview && (
                                                <div className="mb-2">
                                                    <img
                                                        src={msg.imagePreview}
                                                        alt="Uploaded"
                                                        className="max-w-[200px] max-h-[200px] object-cover rounded"
                                                    />
                                                </div>
                                            )}
                                            {msg.role === "assistant" ? (
                                                <div className="prose prose-sm max-w-none text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:text-foreground [&_li]:text-foreground [&_strong]:text-foreground [&_h1]:font-serif [&_h2]:font-serif [&_h3]:font-serif">
                                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
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
                                    className="flex justify-start"
                                >
                                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                                        <Sparkles size={14} className="text-foreground" />
                                    </div>
                                    <div className="flex items-center gap-1.5 py-3">
                                        {[0, 1, 2].map((i) => (
                                            <motion.span
                                                key={i}
                                                className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
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
                            className="fixed bottom-32 right-6 z-20 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:opacity-80 transition-opacity"
                        >
                            <ArrowDown size={16} />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Input Area */}
                <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-divider">
                    <div className="container max-w-2xl py-4 px-4">
                        {imagePreview && (
                            <div className="mb-3 relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Selected"
                                    className="h-20 w-20 object-cover border border-border"
                                />
                                <button
                                    onClick={clearImage}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}

                        <div className="flex gap-2 items-end">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-shrink-0 w-10 h-10 flex items-center justify-center border border-border hover:border-foreground/30 transition-colors text-muted-foreground hover:text-foreground"
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
                                className="flex-1 resize-none min-h-[40px] max-h-[120px] text-sm border-border focus-visible:ring-0 focus-visible:border-foreground/30 rounded-none"
                                rows={1}
                            />

                            <Button
                                onClick={() => sendMessage()}
                                disabled={isLoading || (!input.trim() && !image)}
                                size="icon"
                                variant="hero"
                                className="flex-shrink-0 w-10 h-10 rounded-none"
                            >
                                {isLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Send size={16} />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                            Press Enter to send · Shift+Enter for new line
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DesignerChat;
