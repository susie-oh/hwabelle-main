import type { FlowerProfile } from "@/data/flowerQuizProfiles";

interface PressingGuideProps {
  profile: FlowerProfile;
}

const difficultyColors: Record<string, string> = {
  Easy: "text-emerald-600",
  Moderate: "text-amber-600",
  Advanced: "text-rose-600",
};

const PressingGuide = ({ profile }: PressingGuideProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-muted-foreground">Pressing Difficulty:</span>
        <span className={`text-sm font-medium ${difficultyColors[profile.pressingSuitability] || ""}`}>
          {profile.pressingSuitability}
        </span>
      </div>

      <ul className="space-y-2">
        {profile.pressingTips.map((tip, index) => (
          <li key={index} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <span className="text-foreground mt-0.5 shrink-0">·</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PressingGuide;
