import React from "react";
import { SuitabilityTier } from "@/content/resources/flower-selection-guide";

interface FlowerSuitabilityMatrixProps {
  tiers: SuitabilityTier[];
}

const FlowerSuitabilityMatrix: React.FC<FlowerSuitabilityMatrixProps> = ({ tiers }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
      {tiers.map((t, idx) => (
        <div
          key={idx}
          className="flex flex-col border border-border/70 rounded-xl p-5 bg-card/70 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary">
              {t.tier}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {t.dryingTime}
            </span>
          </div>

          <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
            {t.name}
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            {t.description}
          </p>

          <div className="mt-auto pt-3 border-t border-border/40">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-1.5">
              Examples:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              {t.examples.map((ex, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-primary font-bold">·</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlowerSuitabilityMatrix;
