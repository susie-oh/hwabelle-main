import { Button } from "@/components/ui/button";
import { Flower2 } from "lucide-react";

interface QuizIntroProps {
  onStart: () => void;
}

const QuizIntro = ({ onStart }: QuizIntroProps) => {
  return (
    <div className="max-w-2xl mx-auto text-center py-12 md:py-20 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-petal-lavender/30 mb-8">
        <Flower2 size={28} strokeWidth={1.5} className="text-foreground" />
      </div>

      <h1 className="font-serif text-display md:text-display-lg mb-4">
        What's Your Flower?
      </h1>

      <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
        Discover the flower that matches your personality, what it symbolizes, and a
        pressed-flower project idea made just for you.
      </p>

      <ul className="text-sm text-muted-foreground space-y-2 mb-10 max-w-md mx-auto text-left">
        <li className="flex items-start gap-2">
          <span className="text-foreground mt-0.5">·</span>
          <span>7 quick questions about your personality</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-foreground mt-0.5">·</span>
          <span>Your signature flower and what it represents</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-foreground mt-0.5">·</span>
          <span>Pressing tips and a personalized project idea</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-foreground mt-0.5">·</span>
          <span>Takes about 2 minutes</span>
        </li>
      </ul>

      <Button
        id="quiz-start-button"
        variant="hero"
        size="xl"
        onClick={onStart}
        className="text-base"
      >
        Discover My Flower
      </Button>
    </div>
  );
};

export default QuizIntro;
