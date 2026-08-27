import React from "react";
import { Link } from "react-router-dom";
import { QuickStep } from "@/content/resources/quick-start-guide";
import { ArrowRight } from "lucide-react";
import { trackBlogResourceClick } from "@/lib/resources/analytics";

interface QuickStartStepsProps {
  steps: QuickStep[];
}

const QuickStartSteps: React.FC<QuickStartStepsProps> = ({ steps }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      {steps.map((step) => (
        <div
          key={step.stepNumber}
          className="flex flex-col border border-border/70 rounded-xl p-5 bg-card/80 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground font-serif font-bold text-xs flex items-center justify-center">
              {step.stepNumber}
            </span>
            <span className="text-xs font-bold tracking-widest text-primary uppercase">
              {step.label}
            </span>
          </div>

          <h3 className="font-serif text-base font-semibold text-foreground mb-2">
            {step.title}
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            {step.summary}
          </p>

          <ul className="text-xs text-muted-foreground space-y-1.5 mb-5 flex-1">
            {step.instructions.map((inst, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-primary font-bold">·</span>
                <span>{inst}</span>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-border/40 mt-auto">
            <Link
              to={step.deepLink.path}
              onClick={() =>
                trackBlogResourceClick({
                  resource_id: "quick-start-guide",
                  article_slug: step.deepLink.path.replace("/blog/", ""),
                  link_type: "inline",
                })
              }
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors group"
            >
              <span>{step.deepLink.title}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStartSteps;
