import React from "react";
import { ResourceMeta } from "@/data/resourceRegistry";
import ResourceCard from "./ResourceCard";

interface ResourceGridProps {
  resources: ResourceMeta[];
  onOpenOffer?: (resourceId: string) => void;
}

const ResourceGrid: React.FC<ResourceGridProps> = ({ resources, onOpenOffer }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          onOpenOffer={onOpenOffer}
        />
      ))}
    </div>
  );
};

export default ResourceGrid;
