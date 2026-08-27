import { flowerPressingGuideContent } from "@/content/resources/flower-pressing-guide";
import { flowerSelectionGuideContent } from "@/content/resources/flower-selection-guide";
import { quickStartGuideContent } from "@/content/resources/quick-start-guide";

export interface ResourceMeta {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  badge: string;
  author: string;
  publishedAt: string;
  readTime: string;
  skillLevel: "Beginner" | "Intermediate" | "All Levels";
  keyTakeaways: string[];
  metaDescription: string;
  seoKeywords: string[];
  productCTA: {
    title: string;
    description: string;
    buttonText: string;
    path: string;
  };
  downloadable: boolean;
  pdfUrl: string;
  pdfFileName: string;
  isFlagship: boolean;
}

export const CANONICAL_RESOURCE_IDS = [
  "flower-pressing-guide",
  "flower-selection-guide",
  "quick-start-guide",
] as const;

export type CanonicalResourceId = typeof CANONICAL_RESOURCE_IDS[number];

export const RESOURCE_REGISTRY: Record<CanonicalResourceId, ResourceMeta> = {
  "flower-pressing-guide": {
    id: "flower-pressing-guide",
    slug: "flower-pressing-guide",
    title: flowerPressingGuideContent.title,
    subtitle: flowerPressingGuideContent.subtitle,
    tagline: flowerPressingGuideContent.tagline,
    description: flowerPressingGuideContent.description,
    badge: flowerPressingGuideContent.badge,
    author: flowerPressingGuideContent.author,
    publishedAt: flowerPressingGuideContent.publishedAt,
    readTime: flowerPressingGuideContent.readTime,
    skillLevel: flowerPressingGuideContent.skillLevel,
    keyTakeaways: flowerPressingGuideContent.keyTakeaways,
    metaDescription: flowerPressingGuideContent.metaDescription,
    seoKeywords: flowerPressingGuideContent.seoKeywords,
    productCTA: {
      title: "Preserve with Professional Precision",
      description: "Get the complete Hwabelle Acrylic Flower Press Kit with 360° clear visibility and dual plate sizes.",
      buttonText: "Shop the Acrylic Flower Press Kit",
      path: "/product/flower-press-kit",
    },
    downloadable: true,
    pdfUrl: "/guides/hwabelle-flower-pressing-master-guide.pdf",
    pdfFileName: "Hwabelle-Flower-Pressing-Master-Guide.pdf",
    isFlagship: true,
  },
  "flower-selection-guide": {
    id: "flower-selection-guide",
    slug: "flower-selection-guide",
    title: flowerSelectionGuideContent.title,
    subtitle: flowerSelectionGuideContent.subtitle,
    tagline: flowerSelectionGuideContent.tagline,
    description: flowerSelectionGuideContent.description,
    badge: flowerSelectionGuideContent.badge,
    author: flowerSelectionGuideContent.author,
    publishedAt: flowerSelectionGuideContent.publishedAt,
    readTime: flowerSelectionGuideContent.readTime,
    skillLevel: flowerSelectionGuideContent.skillLevel,
    keyTakeaways: flowerSelectionGuideContent.keyTakeaways,
    metaDescription: flowerSelectionGuideContent.metaDescription,
    seoKeywords: flowerSelectionGuideContent.seoKeywords,
    productCTA: {
      title: "Ready to Press Your Foraged Blooms?",
      description: "Use our dual-plate acrylic press designed to handle both delicate petals and dissected wedding roses.",
      buttonText: "Explore the Flower Press Kit",
      path: "/product/flower-press-kit",
    },
    downloadable: true,
    pdfUrl: "/guides/hwabelle-flower-selection-and-prep-guide.pdf",
    pdfFileName: "Hwabelle-Flower-Selection-and-Prep-Guide.pdf",
    isFlagship: false,
  },
  "quick-start-guide": {
    id: "quick-start-guide",
    slug: "quick-start-guide",
    title: quickStartGuideContent.title,
    subtitle: quickStartGuideContent.subtitle,
    tagline: quickStartGuideContent.tagline,
    description: quickStartGuideContent.description,
    badge: quickStartGuideContent.badge,
    author: quickStartGuideContent.author,
    publishedAt: quickStartGuideContent.publishedAt,
    readTime: quickStartGuideContent.readTime,
    skillLevel: quickStartGuideContent.skillLevel,
    keyTakeaways: quickStartGuideContent.keyTakeaways,
    metaDescription: quickStartGuideContent.metaDescription,
    seoKeywords: quickStartGuideContent.seoKeywords,
    productCTA: {
      title: "Start Pressing in 4 Simple Steps",
      description: "Everything you need—from solid brass hardware to 250gsm blotting sheets—is included in the kit.",
      buttonText: "Get Your Complete Press Kit",
      path: "/product/flower-press-kit",
    },
    downloadable: true,
    pdfUrl: "/guides/hwabelle-official-quick-start-guide.pdf",
    pdfFileName: "Hwabelle-Official-Quick-Start-Guide.pdf",
    isFlagship: false,
  },
};

export const ALL_RESOURCES = Object.values(RESOURCE_REGISTRY);

export function getResourceById(id: string): ResourceMeta | undefined {
  return RESOURCE_REGISTRY[id as CanonicalResourceId];
}

export function isValidResourceId(id: string): id is CanonicalResourceId {
  return (CANONICAL_RESOURCE_IDS as readonly string[]).includes(id);
}
