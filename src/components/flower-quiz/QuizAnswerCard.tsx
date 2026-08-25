interface QuizAnswerCardProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: () => void;
}

const QuizAnswerCard = ({ id, text, isSelected, onSelect }: QuizAnswerCardProps) => {
  return (
    <button
      id={`answer-${id}`}
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`
        w-full text-left p-5 md:p-6 rounded-xl border-2 transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        ${
          isSelected
            ? "border-foreground bg-foreground/5 shadow-sm"
            : "border-border hover:border-foreground/30 hover:bg-secondary/50"
        }
      `}
    >
      <span className="text-sm md:text-base leading-relaxed">{text}</span>
    </button>
  );
};

export default QuizAnswerCard;
