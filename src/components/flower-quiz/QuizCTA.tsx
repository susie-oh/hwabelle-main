import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { PRODUCT_PATH } from "@/lib/site";

interface QuizCTAProps {
  flowerSlug: string;
  flowerName: string;
  onAIDesignerClick?: () => void;
  onShopClick?: () => void;
}

const QuizCTA = ({ flowerSlug, flowerName, onAIDesignerClick, onShopClick }: QuizCTAProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        variant="hero"
        size="lg"
        className="gap-2 text-sm sm:text-base"
        asChild
        onClick={onAIDesignerClick}
      >
        <Link to={`/designer?flower=${flowerSlug}&source=flower-quiz`}>
          <Sparkles size={16} />
          Design My {flowerName} Project
        </Link>
      </Button>

      <Button
        variant="hero-outline"
        size="lg"
        className="gap-2 text-sm sm:text-base"
        asChild
        onClick={onShopClick}
      >
        <Link to={`${PRODUCT_PATH}?source=flower-quiz&flower=${flowerSlug}`}>
          Start Pressing My Flowers
          <ArrowRight size={16} />
        </Link>
      </Button>
    </div>
  );
};

export default QuizCTA;
