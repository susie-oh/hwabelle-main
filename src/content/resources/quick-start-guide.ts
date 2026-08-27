export interface QuickStep {
  stepNumber: number;
  label: "CHOOSE" | "ARRANGE" | "PRESS" | "CREATE";
  title: string;
  summary: string;
  instructions: string[];
  deepLink: {
    title: string;
    path: string;
  };
}

export interface KitComponent {
  name: string;
  spec: string;
  function: string;
}

export interface ResourceContentC {
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
  steps: QuickStep[];
  kitAnatomy: KitComponent[];
}

export const quickStartGuideContent: ResourceContentC = {
  id: "quick-start-guide",
  slug: "quick-start-guide",
  title: "Press Flowers in 4 Simple Steps",
  subtitle: "The Official Hwabelle Quick-Start Visual Operating Guide",
  tagline: "The visual 4-step framework: CHOOSE → ARRANGE → PRESS → CREATE.",
  description: "A picture-book style visual guide to assembling your Hwabelle Acrylic Flower Press, layering your botanical specimens, applying torque evenly, and creating framed floral keepsakes.",
  badge: "Official User Manual & Quick Start",
  author: "Hwabelle Botanical Design Studio",
  publishedAt: "2026-08-25T00:00:00.000Z",
  readTime: "5 min read",
  skillLevel: "Beginner",
  keyTakeaways: [
    "CHOOSE: Select peak-bloom flowers with zero surface dew and clean 45-degree stem cuts",
    "ARRANGE: Layer in 5-ply stack (Cardstock + Sponge + Blotter + Flower + Blotter + Sponge + Cardstock)",
    "PRESS: Secure 4 corner brass bolts in an X-pattern until sponges compress firmly",
    "CREATE: Check after 48 hours for blotter swaps, cure for 1–3 weeks, and frame in UV glass",
  ],
  metaDescription: "The official Hwabelle quick-start guide to flower pressing in 4 simple steps: Choose, Arrange, Press, and Create. Visual layout instructions and kit anatomy.",
  seoKeywords: [
    "how to use flower press",
    "flower pressing in 4 steps",
    "hwabelle instruction manual",
    "how to layer a flower press",
    "acrylic flower press instructions",
  ],
  steps: [
    {
      stepNumber: 1,
      label: "CHOOSE",
      title: "Pick Healthy, Press-Friendly Blooms",
      summary: "Harvest peak flowers mid-morning after dew evaporates. Remove damaged outer petals and slice bulky calyxes.",
      instructions: [
        "Select flowers that have opened 80% to 100% with vibrant petal color",
        "Avoid blooms with water drops, insect bites, or shedding pollen",
        "Trim stems flush with floral snips, or slice thick roses down the center green receptacle",
      ],
      deepLink: {
        title: "Explore the Best Flowers for Pressing",
        path: "/blog/best-flowers-for-pressing",
      },
    },
    {
      stepNumber: 2,
      label: "ARRANGE",
      title: "Build the 5-Layer Drying Sandwich",
      summary: "Lay the acrylic base down, add cardstock, sponge, and blotter paper, then space your flowers neatly.",
      instructions: [
        "Place bottom acrylic plate on a flat table",
        "Add: Cardboard Dry Board → Sponge Cushion Pad → Absorbent Blotter Paper",
        "Arrange flowers face-down or in profile with at least 0.5 inches of space between blooms",
        "Cover with: Blotter Paper → Sponge Pad → Cardboard Dry Board",
      ],
      deepLink: {
        title: "Read How to Press Thick Roses & Petals",
        path: "/blog/how-to-press-roses",
      },
    },
    {
      stepNumber: 3,
      label: "PRESS",
      title: "Apply 360-Degree Symmetrical Pressure",
      summary: "Place the top crystal-clear plate, insert brass corner bolts, and tighten wing nuts evenly in an X-pattern.",
      instructions: [
        "Look through the top transparent acrylic plate to verify petals did not shift",
        "Tighten corner bolts in an X-pattern (top-left, bottom-right, top-right, bottom-left)",
        "Compress until sponge layers cushion firmly—do not overtighten to crush stems",
        "Store in a dark, dry closet; swap damp blotters after 48 hours for thick blooms",
      ],
      deepLink: {
        title: "Learn How Long Flowers Take to Dry",
        path: "/blog/how-long-does-it-take-to-press-flowers",
      },
    },
    {
      stepNumber: 4,
      label: "CREATE",
      title: "Mount & Frame Your Archival Keepsake",
      summary: "When flowers feel like crisp dry parchment, lift with tweezers and design your floating frame artwork.",
      instructions: [
        "Perform the Touch Test: ensure blooms feel like delicate, dry paper, not cool or supple",
        "Lift carefully with botanical tweezers",
        "Mount between UV-resistant glass panes using micro-dots of acid-free PVA glue",
        "Use the Hwabelle AI Designer for layout inspiration and keepsake planning",
      ],
      deepLink: {
        title: "Discover DIY Keepsake & Framing Ideas",
        path: "/blog/what-to-do-with-pressed-flowers",
      },
    },
  ],
  kitAnatomy: [
    {
      name: "Large Acrylic Press Plates",
      spec: "10\" × 10\" (Dual 6mm Clear Acrylic)",
      function: "Provides 360° transparent view and rigid, warp-free flat pressure for full bouquet layouts.",
    },
    {
      name: "Pocket Acrylic Press Plates",
      spec: "3\" × 3\" Portable Press",
      function: "Compact field press for garden walks, hiking, and travel foraging.",
    },
    {
      name: "Heavyweight Blotting Sheets",
      spec: "250gsm Pure Cellulose Blotting Paper",
      function: "Rapidly wicks moisture away from petal cellular walls to prevent browning.",
    },
    {
      name: "Sponge Compression Pads",
      spec: "High-Density Open-Cell Foam",
      function: "Cushions delicate petal curves and distributes uniform torque across varying petal thicknesses.",
    },
    {
      name: "Solid Brass Hardware",
      spec: "4 Corner Precision Bolts & Wing Nuts",
      function: "Ensures multi-point flat clamping pressure that never warps or loosens over time.",
    },
  ],
};
