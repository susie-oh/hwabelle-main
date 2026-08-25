import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  current: number;
  total: number;
}

const QuizProgress = ({ current, total }: QuizProgressProps) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8" role="status" aria-label={`Question ${current} of ${total}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs tracking-widest uppercase text-muted-foreground">
          Question {current} of {total}
        </span>
        <span className="text-xs text-muted-foreground">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-1.5" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} />
    </div>
  );
};

export default QuizProgress;
