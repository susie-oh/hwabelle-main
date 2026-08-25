import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Flower2 } from "lucide-react";
import { isValidEmail } from "@/lib/flower-quiz/validation";
import { supabase } from "@/integrations/supabase/client";
import type { QuizAttribution } from "@/lib/flower-quiz/attribution";

interface QuizLeadCaptureProps {
  flowerResult: string;
  answers: Record<string, string>;
  attribution: QuizAttribution;
  onComplete: () => void;
}

const QuizLeadCapture = ({
  flowerResult,
  answers,
  attribution,
  onComplete,
}: QuizLeadCaptureProps) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(null);

    // Validate email
    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: fnError } = await supabase.functions.invoke("flower-quiz-submit", {
        body: {
          firstName: firstName.trim() || null,
          email: email.trim().toLowerCase(),
          marketingConsent,
          flowerResult,
          answers,
          source: attribution.source,
          utmSource: attribution.utmSource,
          utmMedium: attribution.utmMedium,
          utmCampaign: attribution.utmCampaign,
          utmContent: attribution.utmContent,
          utmTerm: attribution.utmTerm,
          referrer: attribution.referrer,
        },
      });

      if (fnError) throw fnError;
      onComplete();
    } catch (err) {
      console.error("Quiz submission error:", err);
      setError("Something went wrong. You can try again or skip to see your result.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Allow result to render even without persistence
    onComplete();
  };

  return (
    <div className="max-w-md mx-auto py-12 md:py-20 px-4 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-petal-sage/30 mb-6">
        <Flower2 size={24} strokeWidth={1.5} className="text-foreground" />
      </div>

      <h2 className="font-serif text-display mb-3">Your flower is ready.</h2>
      <p className="text-muted-foreground mb-8">
        Enter your details to reveal your personalized flower result.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <Label htmlFor="quiz-first-name" className="text-sm mb-1.5 block">
            First Name <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="quiz-first-name"
            type="text"
            placeholder="Your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength={100}
            disabled={isSubmitting}
            autoComplete="given-name"
          />
        </div>

        <div>
          <Label htmlFor="quiz-email" className="text-sm mb-1.5 block">
            Email
          </Label>
          <Input
            id="quiz-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
            }}
            disabled={isSubmitting}
            required
            autoComplete="email"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && (
            <p id="email-error" className="text-sm text-destructive mt-1.5" role="alert">
              {emailError}
            </p>
          )}
        </div>

        <div className="flex items-start gap-3 pt-2">
          <Checkbox
            id="quiz-marketing"
            checked={marketingConsent}
            onCheckedChange={(checked) =>
              setMarketingConsent(checked === true)
            }
            disabled={isSubmitting}
          />
          <Label htmlFor="quiz-marketing" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
            Send me Hwabelle flower pressing tips, project ideas, and offers.
          </Label>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3" role="alert">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="pt-4 space-y-3">
          <Button
            id="quiz-submit-button"
            type="submit"
            variant="hero"
            size="lg"
            className="w-full text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Revealing…
              </>
            ) : (
              "Reveal My Flower"
            )}
          </Button>

          {error && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={handleSkip}
            >
              Skip and see my result
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuizLeadCapture;
