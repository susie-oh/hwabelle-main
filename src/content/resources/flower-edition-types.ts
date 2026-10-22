export interface FlowerEditionStep {
  stepNumber: string;
  label: string;
  title: string;
  howTo: string;
  craftNote?: string;
}

export interface FlowerEditionContent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  editionBadge: string;
  palette: string[];
  beforeYouBegin: {
    title: string;
    points: { label: string; text: string }[];
  };
  steps: FlowerEditionStep[];
  finishAndProtect: {
    rules: { title: string; text: string }[];
    craftSuggestions: string[];
  };
  author: string;
  publishedAt: string;
  readTime: string;
  skillLevel: "Beginner" | "Intermediate" | "All Levels";
  keyTakeaways: string[];
  metaDescription: string;
  seoKeywords: string[];
  pdfUrl: string;
  pdfFileName: string;
  blogSlug: string;
}
