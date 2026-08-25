interface FlowerTraitsProps {
  traits: string[];
}

const FlowerTraits = ({ traits }: FlowerTraitsProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      {traits.map((trait) => (
        <span
          key={trait}
          className="px-4 py-2 text-sm tracking-wide border border-border rounded-full bg-secondary/50"
        >
          {trait}
        </span>
      ))}
    </div>
  );
};

export default FlowerTraits;
