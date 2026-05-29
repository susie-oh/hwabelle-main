import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/seo/Seo";

/**
 * /claim-success
 * 
 * This page is the email-confirmation redirect target.
 * Its ONLY job:
 *   1. Wait for Supabase to establish the session from the URL hash tokens
 *   2. Read the pending claim from localStorage
 *   3. Call verify-order to link the order to the new user
 *   4. Show "Access Activated!" with a button to the AI Designer
 */

type ClaimState = "loading" | "success" | "error";

const ClaimSuccess = () => {
    const [state, setState] = useState<ClaimState>("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const claimStarted = useRef(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            // Only proceed when we have a real authenticated session
            if (!session || claimStarted.current) return;

            // Check for pending claim
            const pendingClaimStr = localStorage.getItem("pending_designer_claim");
            if (!pendingClaimStr) {
                // No pending claim — user might have navigated here directly
                // Just show success since they confirmed their email
                setState("success");
                return;
            }

            let pendingClaim: { orderId: string; email: string };
            try {
                pendingClaim = JSON.parse(pendingClaimStr);
                if (!pendingClaim.orderId || !pendingClaim.email) throw new Error("invalid");
            } catch {
                localStorage.removeItem("pending_designer_claim");
                setState("success");
                return;
            }

            // Lock to prevent double-fire
            claimStarted.current = true;

            try {
                const { data, error } = await supabase.functions.invoke("verify-order", {
                    body: { order_number: pendingClaim.orderId, email: pendingClaim.email },
                });

                if (error) throw new Error(error.message);
                if (!data || !data.state) throw new Error("Invalid response from server");

                if (data.state === "success" || data.state === "already-redeemed") {
                    localStorage.removeItem("pending_designer_claim");
                    setState("success");
                } else {
                    throw new Error(data.message || "Could not link your order. Please try again from the Unlock page.");
                }
            } catch (err: any) {
                console.error("Claim failed:", err);
                setErrorMsg(err.message || "Something went wrong. Please try again.");
                setState("error");
            }
        });

        // Fallback timeout — if no auth event fires within 10 seconds, show error
        const timeout = setTimeout(() => {
            if (state === "loading") {
                setErrorMsg("Session could not be established. Please try signing in manually.");
                setState("error");
            }
        }, 10000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    return (
        <Layout>
            <Seo title="Claim Success | Hwabelle" path="/claim-success" robots="noindex,nofollow" />
            <section className="py-20 md:py-32 bg-background min-h-[60vh] flex items-center">
                <div className="container max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-border bg-secondary/20 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                <Sparkles size={19} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="font-serif text-lg leading-tight">AI Designer</h2>
                                <p className="text-xs text-muted-foreground">
                                    Account verification
                                </p>
                            </div>
                        </div>

                        <div className="px-6 py-10">
                            {/* Loading State */}
                            {state === "loading" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                                    <h1 className="font-serif text-xl mb-2 text-foreground">Activating your access…</h1>
                                    <p className="text-muted-foreground text-sm">
                                        Please wait while we link your order to your account.
                                    </p>
                                </motion.div>
                            )}

                            {/* Success State */}
                            {state === "success" && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-background shadow-sm">
                                        <Sparkles className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h1 className="font-serif text-2xl mb-2 text-foreground">Access Activated!</h1>
                                    <p className="text-muted-foreground text-sm mb-8 max-w-sm">
                                        Your order has been successfully linked to your account. You now have full access to the AI Botanical Designer.
                                    </p>
                                    <Button className="w-full max-w-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-11" asChild>
                                        <Link to="/designer-chat">
                                            Launch AI Designer <Sparkles size={16} />
                                        </Link>
                                    </Button>
                                </motion.div>
                            )}

                            {/* Error State */}
                            {state === "error" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                                        <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                                    </div>
                                    <h1 className="font-serif text-xl mb-2 text-foreground">Something went wrong</h1>
                                    <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                                        {errorMsg}
                                    </p>
                                    <div className="flex gap-3">
                                        <Button variant="outline" asChild>
                                            <Link to="/unlock">Try Again</Link>
                                        </Button>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                                            <Link to="/designer-chat">Go to Designer</Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
};

export default ClaimSuccess;
