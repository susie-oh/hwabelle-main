export interface SuitabilityTier {
  tier: string;
  name: string;
  dryingTime: string;
  description: string;
  examples: string[];
  tips: string;
}

export interface FoliageItem {
  type: string;
  varieties: string;
  note: string;
}

export interface ResourceContentB {
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
  suitabilityTiers: SuitabilityTier[];
  foliageGuide: FoliageItem[];
  foragerChecklist: string[];
}

export const flowerSelectionGuideContent: ResourceContentB = {
  id: "flower-selection-guide",
  slug: "flower-selection-guide",
  title: "The Botanical Selection & Harvesting Field Guide",
  subtitle: "How to Forage, Pick, and Prepare Blooms for Flawless Pressed Flower Art",
  tagline: "Which flowers to press, harvesting golden rules, and 3D floral dissection techniques.",
  description: "A practical field guide teaching you how to harvest flowers during the optimal morning sun window, categorize blooms into suitability tiers, dissect thick roses and peonies, and maintain vibrant botanical colors.",
  badge: "Hwabelle Botanical Field Manual",
  author: "Hwabelle Botanical Design Studio",
  publishedAt: "2026-08-25T00:00:00.000Z",
  readTime: "7 min read",
  skillLevel: "All Levels",
  keyTakeaways: [
    "Harvest in the Morning Sun Window (10:00 AM – 11:30 AM) after dew evaporates but before midday wilting",
    "Tier 1 blooms (Pansies, Violas, Cosmos, Delphinium) press naturally flat with single-layer petals in 3–7 days",
    "Tier 2 blooms (Hydrangeas, Ranunculus, Anemones) require floret separation or stamen removal",
    "Tier 3 dense blooms (Roses, Peonies, Dahlias) must be deconstructed into petals or vertically sliced along the calyx",
    "White flowers require daily blotter swaps for 72 hours to prevent amber discoloration",
  ],
  metaDescription: "The authoritative guide to selecting and preparing flowers for pressing. Discover flower tiers, 3D rose dissection methods, harvesting rules, and color retention tips.",
  seoKeywords: [
    "best flowers for pressing",
    "how to pick flowers to press",
    "flower pressing guide",
    "pressing wedding bouquet flowers",
    "botanical foraging tips",
    "how to press roses",
  ],
  suitabilityTiers: [
    {
      tier: "Tier 1",
      name: "Naturally Flat & Fast-Drying (Beginner Friendly)",
      dryingTime: "3 – 7 Days",
      description: "Flowers with thin single-petal layers and minimal green base material. Press whole face-down or in profile.",
      examples: ["Pansies & Violas", "Cosmos", "Delphinium & Larkspur", "Baby's Breath", "Fern Fronds"],
      tips: "Place face down on blotter sheets; minimal moisture management required.",
    },
    {
      tier: "Tier 2",
      name: "Moderate Petals & Medium Moisture (Intermediate)",
      dryingTime: "7 – 12 Days",
      description: "Blooms with multi-layered petals or pollen-dense center discs.",
      examples: ["Hydrangeas (Individual Florets)", "Ranunculus", "Anemones & Poppies", "Sweet Peas", "Daisies"],
      tips: "Snip individual florets from large clusters rather than pressing whole heads; blot under center discs.",
    },
    {
      tier: "Tier 3",
      name: "Dense & Bulky 3D Blooms (Dissection Required)",
      dryingTime: "14 – 21 Days",
      description: "Flowers with thick, fleshy receptacles and dozens of tightly packed petals.",
      examples: ["Roses (Garden & Tea)", "Peonies", "Dahlias", "Carnations", "Lisianthus"],
      tips: "Deconstruct into concentric petal rings or slice vertically down the green calyx with a craft blade.",
    },
  ],
  foliageGuide: [
    {
      type: "Delicate Ferns",
      varieties: "Maidenhair, Bracken, Boston Fern",
      note: "Place face down; dry rapidly in 3–5 days with strong architectural lines.",
    },
    {
      type: "Silver / Muted Greens",
      varieties: "Silver Dollar Eucalyptus, Dusty Miller",
      note: "Scrape thick stem bark with knife edge before pressing to release moisture.",
    },
    {
      type: "Aromatic Herbs",
      varieties: "Lavender sprigs, Rosemary, Thyme",
      note: "Retains subtle herbal fragrance and rigid structural texture after curing.",
    },
    {
      type: "Ornamental Grasses",
      varieties: "Bunny tails, Feather grass, Wheat heads",
      note: "Flatten gently between fingertips before clamping in the press.",
    },
  ],
  foragerChecklist: [
    "Harvested between 10:00 AM and 11:30 AM",
    "Zero moisture or dew droplets on petal surfaces",
    "Stems trimmed flush to base with a clean 45° angle cut",
    "Heavy flowers sliced in half or deconstructed into petals",
    "Spaced at least 0.5 inches apart on Hwabelle blotting sheets",
    "Bolted evenly in an X-pattern on the Hwabelle Acrylic Press",
    "Stored in a cool, dark, dry closet during pressing",
  ],
};
