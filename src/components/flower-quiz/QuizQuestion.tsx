import { type QuizQuestion as QuizQuestionType } from "@/data/flowerQuizQuestions";
import QuizAnswerCard from "./QuizAnswerCard";
import QuizProgress from "./QuizProgress";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswer: (answerId: string) => void;
  onBack: () => void;
  showBack: boolean;
}

const QuizQuestion = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onBack,
  showBack,
}: QuizQuestionProps) => {
  return (
    <div className="max-w-2xl mx-auto py-8 md:py-12 px-4">
      <QuizProgress current={questionIndex + 1} total={totalQuestions} />

      <div className="mb-8">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
            aria-label="Go back to previous question"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
        )}

        <h2 className="font-serif text-2xl md:text-3xl leading-tight">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3" role="radiogroup" aria-label={question.question}>
        {question.answers.map((answer) => (
          <QuizAnswerCard
            key={answer.id}
            id={answer.id}
            text={answer.text}
            isSelected={selectedAnswer === answer.id}
            onSelect={() => onAnswer(answer.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
