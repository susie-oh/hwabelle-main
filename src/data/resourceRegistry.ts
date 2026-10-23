import { flowerPressingGuideContent } from "@/content/resources/flower-pressing-guide";
import { flowerSelectionGuideContent } from "@/content/resources/flower-selection-guide";
import { quickStartGuideContent } from "@/content/resources/quick-start-guide";
import { pressingDaisiesAndCloverGuideContent } from "@/content/resources/pressing-daisies-and-clover-guide";
import { pressingWildVioletsAndFernGuideContent } from "@/content/resources/pressing-wild-violets-and-fern-guide";
import { pressingTulipsAndSmallWildflowersGuideContent } from "@/content/resources/pressing-tulips-and-small-wildflowers-guide";
import { pressingPansiesAndCosmosGuideContent } from "@/content/resources/pressing-pansies-and-cosmos-guide";
import { pressingLavenderAndBabysBreathGuideContent } from "@/content/resources/pressing-lavender-and-babys-breath-guide";
import { pressingCallaLiliesAndBabysBreathGuideContent } from "@/content/resources/pressing-calla-lilies-and-babys-breath-guide";
import { pressingRosesAndEucalyptusGuideContent } from "@/content/resources/pressing-roses-and-eucalyptus-guide";

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
  category?: "Masterclass" | "Species Guide";
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
  blogSlug?: string;
}

export const CANONICAL_RESOURCE_IDS = [
  "flower-pressing-guide",
  "flower-selection-guide",
  "quick-start-guide",
  "pressing-daisies-and-clover",
  "pressing-wild-violets-and-fern",
  "pressing-tulips-and-small-wildflowers",
  "pressing-pansies-and-cosmos",
  "pressing-lavender-and-babys-breath",
  "pressing-calla-lilies-and-babys-breath",
  "pressing-roses-and-eucalyptus",
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
    category: "Masterclass",
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
    blogSlug: "how-to-press-flowers-for-beginners",
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
    category: "Masterclass",
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
    blogSlug: "best-flowers-for-pressing",
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
    category: "Masterclass",
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
    blogSlug: "how-to-press-flowers-for-beginners",
  },
  "pressing-daisies-and-clover": {
    id: "pressing-daisies-and-clover",
    slug: "pressing-daisies-and-clover",
    title: pressingDaisiesAndCloverGuideContent.title,
    subtitle: pressingDaisiesAndCloverGuideContent.subtitle,
    tagline: pressingDaisiesAndCloverGuideContent.tagline,
    description: pressingDaisiesAndCloverGuideContent.description,
    badge: pressingDaisiesAndCloverGuideContent.editionBadge,
    author: pressingDaisiesAndCloverGuideContent.author,
    publishedAt: pressingDaisiesAndCloverGuideContent.publishedAt,
    readTime: pressingDaisiesAndCloverGuideContent.readTime,
    skillLevel: pressingDaisiesAndCloverGuideContent.skillLevel,
    category: "Species Guide",
    keyTakeaways: pressingDaisiesAndCloverGuideContent.keyTakeaways,
    metaDescription: pressingDaisiesAndCloverGuideContent.metaDescription,
    seoKeywords: pressingDaisiesAndCloverGuideContent.seoKeywords,
    productCTA: {
      title: "Press Delicate Daisies with Crisp Centers",
      description: "Hwabelle's crystal-clear acrylic plates let you visually inspect delicate daisy petals before clamping.",
      buttonText: "Shop the Acrylic Press Kit",
      path: "/product/flower-press-kit",
    },
    downloadable: true,
    pdfUrl: pressingDaisiesAndCloverGuideContent.pdfUrl,
    pdfFileName: pressingDaisiesAndCloverGuideContent.pdfFileName,
    isFlagship: false,
    blogSlug: pressingDaisiesAndCloverGuideContent.blogSlug,
  },
  "pressing-wild-violets-and-fern": {
    id: "pressing-wild-violets-and-fern",
    slug: "pressing-wild-violets-and-fern",
    title: pressingWildVioletsAndFernGuideContent.title,
    subtitle: pressingWildVioletsAndFernGuideContent.subtitle,
    tagline: pressingWildVioletsAndFernGuideContent.tagline,
    description: pressingWildVioletsAndFernGuideContent.description,
    badge: pressingWildVioletsAndFernGuideContent.editionBadge,
    author: pressingWildVioletsAndFernGuideContent.author,
    publishedAt: pressingWildVioletsAndFernGuideContent.publishedAt,
    readTime: pressingWildVioletsAndFernGuideContent.readTime,
    skillLevel: pressingWildVioletsAndFernGuideContent.skillLevel,
    category: "Species Guide",
    keyTakeaways: pressingWildVioletsAndFernGuideContent.keyTakeaways,
    metaDescription: pressingWildVioletsAndFernGuideContent.metaDescription,
    seoKeywords: pressingWildVioletsAndFernGuideContent.seoKeywords,
    productCTA: {
      title: "Preserve Fragile Woodland Botanicals",
      description: "High-density sponge pads mold around delicate violet spurs and fern leaflets without crushing.",
      buttonText: "Get the Hwabelle Flower Press",
      path: "/product/flower-press-kit",
    },
    downloadable: true,
    pdfUrl: pressingWildVioletsAndFernGuideContent.pdfUrl,
    pdfFileName: pressingWildVioletsAndFernGuideContent.pdfFileName,
    isFlagship: false,
    blogSlug: pressingWildVioletsAndFernGuideContent.blogSlug,
  },
  "pressing-tulips-and-small-wildflowers": {
    id: "pressing-tulips-and-small-wildflowers",
    slug: "pressing-tulips-and-small-wildflowers",
    title: pressingTulipsAndSmallWildflowersGuideContent.title,
    subtitle: pressingTulipsAndSmallWildflowersGuideContent.subtitle,
    tagline: pressingTulipsAndSmallWildflowersGuideContent.tagline,
    description: pressingTulipsAndSmallWildflowersGuideContent.description,
    badge: pressingTulipsAndSmallWildflowersGuideContent.editionBadge,
    author: pressingTulipsAndSmallWildflowersGuideContent.author,
    publishedAt: pressingTulipsAndSmallWildflowersGuideContent.publishedAt,
    readTime: pressingTulipsAndSmallWildflowersGuideContent.readTime,
    skillLevel: pressingTulipsAndSmallWildflowersGuideContent.skillLevel,
    category: "Species Guide",
    keyTakeaways: pressingTulipsAndSmallWildflowersGuideContent.keyTakeaways,
    metaDescription: pressingTulipsAndSmallWildflowersGuideContent.metaDescription,
    seoKeywords: pressingTulipsAndSmallWildflowersGuideContent.seoKeywords,
    productCTA: {
      title: "Master High-Moisture Bulb Blooms",
      description: "Corner brass bolt clamping provides the symmetrical, non-warping torque needed for fleshy spring tulips.",
      buttonText: "Explore the Press Kit",
      path: "/product/flower-press-kit",
    },
    downloadable: true,
    pdfUrl: pressingTulipsAndSmallWildflowersGuideContent.pdfUrl,
    pdfFileName: pressingTulipsAndSmallWildflowersGuideContent.pdfFileName,
    isFlagship: false,
    blogSlug: pressingTulipsAndSmallWildflowersGuideContent.blogSlug,
  },
  "pressing-pansies-and-cosmos": {
    id: "pressing-pansies-and-cosmos",
    slug: "pressing-pansies-and-cosmos",
    title: pressingPansiesAndCosmosGuideContent.title,
    subtitle: pressingPansiesAndCosmosGuideContent.subtitle,
    tagline: pressingPansiesAndCosmosGuideContent.tagline,
    description: pressingPansiesAndCosmosGuideContent.description,
    badge: pressingPansiesAndCosmosGuideContent.editionBadge,
    author: pressingPansiesAndCosmosGuideContent.author,
    publishedAt: pressingPansiesAndCosmosGuideContent.publishedAt,
    readTime: pressingPansiesAndCosmosGuideContent.readTime,
    skillLevel: pressingPansiesAndCosmosGuideContent.skillLevel,
    category: "Species Guide",
    keyTakeaways: pressingPansiesAndCosmosGuideContent.keyTakeaways,
    metaDescription: pressingPansiesAndCosmosGuideContent.metaDescription,
    seoKeywords: pressingPansiesAndCosmosGuideContent.seoKeywords,
    productCTA: {
      title: "Capture Vibrant Garden Faces",
      description: "Our 12x12 inch large format press gives you ample space to press multiple pansy faces and feathery cosmos at once.",
      buttonText: "Shop Hwabelle Press Kit",
      path: "/product/flower-press-kit",
    },
    downloadable: true,
    pdfUrl: pressingPansiesAndCosmosGuideContent.pdfUrl,
    pdfFileName: pressingPansiesAndCosmosGuideContent.pdfFileName,
    isFlagship: false,
    blogSlug: pressingPansiesAndCosmosGuideContent.blogSlug,
  },
  "pressing-lavender-and-babys-breath": {
    id: "pressing-lavender-and-babys-breath",
    slug: "pressing-lavender-and-babys-breath",
    title: pressingLavenderAndBabysBreathGuideContent.title,
    subtitle: pressingLavenderAndBabysBreathGuideContent.subtitle,
    tagline: pressingLavenderAndBabysBreathGuideContent.tagline,
    description: pressingLavenderAndBabysBreathGuideContent.description,
    badge: pressingLavenderAndBabysBreathGuideContent.editionBadge,
    author: pressingLavenderAndBabysBreathGuideContent.author,
    publishedAt: pressingLavenderAndBabysBreathGuideContent.publishedAt,
    readTime: pressingLavenderAndBabysBreathGuideContent.readTime,
    skillLevel: pressingLavenderAndBabysBreathGuideContent.skillLevel,
    category: "Species Guide",
    keyTakeaways: pressingLavenderAndBabysBreathGuideContent.keyTakeaways,
    metaDescription: pressingLavenderAndBabysBreathGuideContent.metaDescription,
    seoKeywords: pressingLavenderAndBabysBreathGuideContent.seoKeywords,
    productCTA: {
      title: "Preserve Scent Memory & Fine Sprigs",
      description: "Cushion fragile baby's breath florets and lavender whorls with Hwabelle's multi-tier sponge drying system.",
      buttonText: "View the Complete Kit",
      path: "/product/flower-press-kit",
    },
    downloadable: true,
    pdfUrl: pressingLavenderAndBabysBreathGuideContent.pdfUrl,
    pdfFileName: pressingLavenderAndBabysBreathGuideContent.pdfFileName,
    isFlagship: false,
    blogSlug: pressingLavenderAndBabysBreathGuideContent.blogSlug,
  },
  "pressing-calla-lilies-and-babys-breath": {
    id: "pressing-calla-lilies-and-babys-breath",
    slug: "pressing-calla-lilies-and-babys-breath",
    title: pressingCallaLiliesAndBabysBreathGuideContent.title,
    subtitle: pressingCallaLiliesAndBabysBreathGuideContent.subtitle,
    tagline: pressingCallaLiliesAndBabysBreathGuideContent.tagline,
    description: pressingCallaLiliesAndBabysBreathGuideContent.description,
    badge: pressingCallaLiliesAndBabysBreathGuideContent.editionBadge,
    author: pressingCallaLiliesAndBabysBreathGuideContent.author,
    publishedAt: pressingCallaLiliesAndBabysBreathGuideContent.publishedAt,
    readTime: pressingCallaLiliesAndBabysBreathGuideContent.readTime,
    skillLevel: pressingCallaLiliesAndBabysBreathGuideContent.skillLevel,
    category: "Species Guide",
    keyTakeaways: pressingCallaLiliesAndBabysBreathGuideContent.keyTakeaways,
    metaDescription: pressingCallaLiliesAndBabysBreathGuideContent.metaDescription,
    seoKeywords: pressingCallaLiliesAndBabysBreathGuideContent.seoKeywords,
    productCTA: {
      title: "Preserve Your Wedding Bouquet Forever",
      description: "Our heavy-duty 8mm acrylic plates provide the robust flat pressure required to flatten sculptural bridal calla lilies.",
      buttonText: "Shop the Bridal Flower Press",
      path: "/product/flower-press-kit",
    },
    downloadable: true,
    pdfUrl: pressingCallaLiliesAndBabysBreathGuideContent.pdfUrl,
    pdfFileName: pressingCallaLiliesAndBabysBreathGuideContent.pdfFileName,
    isFlagship: false,
    blogSlug: pressingCallaLiliesAndBabysBreathGuideContent.blogSlug,
  },
  "pressing-roses-and-eucalyptus": {
    id: "pressing-roses-and-eucalyptus",
    slug: "pressing-roses-and-eucalyptus",
    title: pressingRosesAndEucalyptusGuideContent.title,
    subtitle: pressingRosesAndEucalyptusGuideContent.subtitle,
    tagline: pressingRosesAndEucalyptusGuideContent.tagline,
    description: pressingRosesAndEucalyptusGuideContent.description,
    badge: pressingRosesAndEucalyptusGuideContent.editionBadge,
    author: pressingRosesAndEucalyptusGuideContent.author,
    publishedAt: pressingRosesAndEucalyptusGuideContent.publishedAt,
    readTime: pressingRosesAndEucalyptusGuideContent.readTime,
    skillLevel: pressingRosesAndEucalyptusGuideContent.skillLevel,
    category: "Species Guide",
    keyTakeaways: pressingRosesAndEucalyptusGuideContent.keyTakeaways,
    metaDescription: pressingRosesAndEucalyptusGuideContent.metaDescription,
    seoKeywords: pressingRosesAndEucalyptusGuideContent.seoKeywords,
    productCTA: {
      title: "Press Roses You Can See Before You Close",
      description: "Clear 12x12 acrylic plates let you check every rose petal and eucalyptus leaf is flat before tightening the four corner knobs.",
      buttonText: "Shop the Acrylic Press Kit",
      path: "/product/flower-press-kit",
    },
    downloadable: true,
    pdfUrl: pressingRosesAndEucalyptusGuideContent.pdfUrl,
    pdfFileName: pressingRosesAndEucalyptusGuideContent.pdfFileName,
    isFlagship: false,
    blogSlug: pressingRosesAndEucalyptusGuideContent.blogSlug,
  },
};

export const ALL_RESOURCES = Object.values(RESOURCE_REGISTRY);

export function getResourceById(id: string): ResourceMeta | undefined {
  return RESOURCE_REGISTRY[id as CanonicalResourceId];
}

export function isValidResourceId(id: string): id is CanonicalResourceId {
  return (CANONICAL_RESOURCE_IDS as readonly string[]).includes(id);
}
