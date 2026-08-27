import React from "react";
import { Link } from "react-router-dom";
import { ResourceMeta } from "@/data/resourceRegistry";
import { BookOpen, Sparkles, Clock, ArrowRight } from "lucide-react";
import { trackResourceFormStart } from "@/lib/resources/analytics";

interface ResourceCardProps {
  resource: ResourceMeta;
  onOpenOffer?: (resourceId: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onOpenOffer }) => {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40 relative overflow-hidden group">
      {resource.isFlagship && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
          Most Popular
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground">
          <Sparkles className="w-3 h-3 text-primary" />
          {resource.skillLevel}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" />
          {resource.readTime}
        </span>
      </div>

      <h3 className="font-serif text-xl font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
        {resource.title}
      </h3>

      <p className="text-xs text-muted-foreground leading-relaxed mb-5 line-clamp-3">
        {resource.description}
      </p>

      <div className="mb-6 space-y-1.5 flex-1">
        <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
          Key Takeaways:
        </p>
        <ul className="text-xs text-muted-foreground space-y-1">
          {resource.keyTakeaways.slice(0, 3).map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
              <span className="text-primary font-bold">✓</span>
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row items-center gap-2.5 mt-auto">
        <Link
          to={`/resources/${resource.slug}`}
          className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-secondary/70 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Read Online</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            trackResourceFormStart({
              resource_id: resource.id,
              page_path: window.location.pathname,
              source_type: "resource_card",
              resource_position: "resource_card",
            });
            if (onOpenOffer) {
              onOpenOffer(resource.id);
            }
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <span>Get Free Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ResourceCard;
