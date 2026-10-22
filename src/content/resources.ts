import { howToPressFlowersForBeginners } from "./blog/how-to-press-flowers-for-beginners";
import { bestFlowersForPressing } from "./blog/best-flowers-for-pressing";
import { howToPressRoses } from "./blog/how-to-press-roses";
import { whyDoPressedFlowersTurnBrown } from "./blog/why-do-pressed-flowers-turn-brown";
import { howLongDoesItTakeToPressFlowers } from "./blog/how-long-does-it-take-to-press-flowers";
import { acrylicVsWoodenFlowerPress } from "./blog/acrylic-vs-wooden-flower-press";
import { pressingDaisiesAndClover } from "./blog/pressing-daisies-and-clover";
import { pressingWildVioletsAndFern } from "./blog/pressing-wild-violets-and-fern";
import { pressingTulipsAndSmallWildflowers } from "./blog/pressing-tulips-and-small-wildflowers";
import { pressingPansiesAndCosmos } from "./blog/pressing-pansies-and-cosmos";
import { pressingLavenderAndBabysBreath } from "./blog/pressing-lavender-and-babys-breath";
import { pressingCallaLiliesAndBabysBreath } from "./blog/pressing-calla-lilies-and-babys-breath";

export interface ResourcePost {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  publishedAt: string;
  authorName: string;
  category: string;
  readTime?: string;
  seoKeywords: string[];
  content: string;
}

export const initialBlogArticles: ResourcePost[] = [
  howToPressFlowersForBeginners,
  bestFlowersForPressing,
  howToPressRoses,
  whyDoPressedFlowersTurnBrown,
  howLongDoesItTakeToPressFlowers,
  acrylicVsWoodenFlowerPress,
  pressingDaisiesAndClover,
  pressingWildVioletsAndFern,
  pressingTulipsAndSmallWildflowers,
  pressingPansiesAndCosmos,
  pressingLavenderAndBabysBreath,
  pressingCallaLiliesAndBabysBreath,
];

// Combine static articles
export const resourcePosts: ResourcePost[] = initialBlogArticles;

export const resourcePostBySlug = Object.fromEntries(
  resourcePosts.map((post) => [post.slug, post]),
);
