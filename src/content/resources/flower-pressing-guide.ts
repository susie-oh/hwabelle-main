export interface DryingScheduleItem {
  variety: string;
  moistureLevel: "Very Low" | "Low" | "Medium" | "Medium-High" | "High";
  pressingTime: string;
  blotterChangeRequired: string;
}

export interface TroubleshootingItem {
  issue: string;
  rootCause: string;
  solution: string;
}

export interface ResourceContent {
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
  dryingSchedule?: DryingScheduleItem[];
  troubleshooting?: TroubleshootingItem[];
}

export const flowerPressingGuideContent: ResourceContent = {
  id: "flower-pressing-guide",
  slug: "flower-pressing-guide",
  title: "The Beginner's Master Guide to Flower Pressing",
  subtitle: "How to Preserve Wedding Bouquets, Garden Blooms, and Sentimental Keepsakes in Crystal-Clear Acrylic",
  tagline: "The complete science of moisture extraction, pressure distribution, and archival botanical preservation.",
  description: "A comprehensive guide covering the science of plant moisture, avoiding browning and mold, mastering drying schedules, testing for complete dryness, and mounting flowers in UV-filtering floating frames.",
  badge: "Hwabelle Botanical Masterclass",
  author: "Hwabelle Botanical Design Studio",
  publishedAt: "2026-08-25T00:00:00.000Z",
  readTime: "8 min read",
  skillLevel: "Beginner",
  keyTakeaways: [
    "Moisture is the primary cause of browning — fast, even moisture evacuation prevents enzymatic oxidation",
    "Acrylic flower presses with 4-corner brass bolt clamping distribute 360-degree flat pressure without warping",
    "The 5-layer drying sandwich (cardstock + sponge + blotter + flowers + blotter + sponge + cardstock) cushions curves and wicks dampness",
    "The 48-Hour Blotter Swap Rule drastically reduces browning risk for high-moisture blooms like roses and ranunculus",
    "Always test for 100% dryness using the Touch Test (crisp parchment) and Tweezer Lift before framing",
  ],
  metaDescription: "Learn how to press flowers at home with Hwabelle's complete master guide. Master drying timelines, avoid browning, assemble the 5-layer press, and create lasting keepsakes.",
  seoKeywords: [
    "flower pressing guide",
    "how to press flowers for beginners",
    "how to preserve wedding bouquet",
    "acrylic flower press kit",
    "flower pressing drying times",
    "why do pressed flowers turn brown",
  ],
  dryingSchedule: [
    {
      variety: "Pansies, Violas, Johnny Jump-Ups",
      moistureLevel: "Low",
      pressingTime: "4 – 7 Days",
      blotterChangeRequired: "No",
    },
    {
      variety: "Delphinium, Larkspur, Cosmos",
      moistureLevel: "Low",
      pressingTime: "5 – 8 Days",
      blotterChangeRequired: "No",
    },
    {
      variety: "Baby's Breath, Lavender, Ferns",
      moistureLevel: "Very Low",
      pressingTime: "3 – 5 Days",
      blotterChangeRequired: "No",
    },
    {
      variety: "Hydrangeas (Individual Florets)",
      moistureLevel: "Medium",
      pressingTime: "7 – 10 Days",
      blotterChangeRequired: "Optional at Day 3",
    },
    {
      variety: "Ranunculus, Anemones, Daisies",
      moistureLevel: "Medium-High",
      pressingTime: "10 – 14 Days",
      blotterChangeRequired: "Yes (Change at Day 3 & Day 7)",
    },
    {
      variety: "Roses (Sliced or Petal-by-Petal)",
      moistureLevel: "High",
      pressingTime: "14 – 21 Days",
      blotterChangeRequired: "Yes (Change at Day 2, Day 5, Day 10)",
    },
    {
      variety: "Peonies, Dahlias (Dissected Petals)",
      moistureLevel: "High",
      pressingTime: "18 – 25 Days",
      blotterChangeRequired: "Yes (Change every 3 days)",
    },
  ],
  troubleshooting: [
    {
      issue: "Petals turned brown or translucent",
      rootCause: "Moisture trapped inside plant tissue or flower was harvested wet with dew/rain",
      solution: "Swap blotter sheets within the first 48 hours; only harvest in the morning after dew evaporates.",
    },
    {
      issue: "Petals stuck to blotting paper",
      rootCause: "High sugar, nectar, or moisture concentration in delicate petal tissue",
      solution: "Use parchment or wax paper liners between bloom and blotter sheet for sugary garden varieties.",
    },
    {
      issue: "Colors faded quickly after framing",
      rootCause: "Exposure to direct sunlight, radiant heat, or non-UV protected glass",
      solution: "Display finished art away from direct sun; use UV-resistant floating glass frames.",
    },
    {
      issue: "Petals wrinkled or curled unevenly",
      rootCause: "Uneven pressure distribution during clamping or warped wooden pressing boards",
      solution: "Use a corner-bolt acrylic press and hand-tighten in an X-pattern to maintain uniform pressure.",
    },
  ],
};
