import { buildCanonicalUrl, PRODUCT_PATH } from "@/lib/site";

export interface ResourcePost {
  slug: string;
  title: string;
  excerpt: string;
  metaDescription: string;
  publishedAt: string;
  authorName: string;
  category: string;
  seoKeywords: string[];
  content: string;
}

const productLink = buildCanonicalUrl(PRODUCT_PATH);
const designerLink = buildCanonicalUrl("/designer");

export const resourcePosts: ResourcePost[] = [
  {
    slug: "how-to-preserve-wedding-bouquet-at-home",
    title: "How to Preserve a Wedding Bouquet at Home",
    excerpt:
      "A practical guide to choosing bouquet blooms, pressing petals quickly, and turning wedding flowers into a lasting keepsake.",
    metaDescription:
      "Learn how to preserve a wedding bouquet at home with pressing tips, timing advice, and keepsake ideas for sentimental blooms.",
    publishedAt: "2026-05-20T09:00:00.000Z",
    authorName: "Hwabelle",
    category: "Wedding Preservation",
    seoKeywords: [
      "how to preserve wedding bouquet at home",
      "wedding bouquet preservation kit",
      "pressed flower keepsake",
    ],
    content: `If you want to preserve a wedding bouquet at home, the biggest advantage is speed. The sooner you start, the better your petals can hold their shape and color.

## Start with the flowers that press best

Not every bouquet flower should be pressed whole. Flatter flowers, petals, leaves, and smaller filler blooms usually give the cleanest results. Roses, peonies, and ranunculus can still work beautifully, but they often press better when separated into petals or smaller sections.

## Prepare your bouquet as soon as possible

1. Remove ribbon, pins, and any wet wrapping.
2. Separate fresh blooms from flowers that are already browning.
3. Trim stems and gently blot away surface moisture.
4. Set aside your best focal flowers, greenery, and sentimental accent blooms.

## Arrange flowers inside the press

Use absorbent paper between each layer and avoid stacking thick flowers directly on top of each other. Spread petals naturally so they keep a graceful shape. If you need a beginner-friendly setup, the [acrylic flower press kit](${productLink}) makes it easier to see spacing before you tighten the plates.

## Give the bouquet enough time to dry

Many bouquet flowers need one to three weeks, depending on thickness and moisture. Change absorbent layers when they feel damp, and store the press in a dry space away from direct humidity.

## Turn pressed flowers into a keepsake

Pressed bouquet flowers can become a frame, anniversary gift, scrapbook page, or small botanical art piece. If you want help choosing layouts or which flowers to save first, the [flower preservation design assistant](${designerLink}) can help you plan the keepsake before you start.

## FAQ

### Can I preserve an entire wedding bouquet in one press?

Usually you will get better results by selecting the most meaningful blooms and pressing them in sections rather than trying to flatten the entire bouquet at once.

### How quickly should I press wedding flowers?

As soon as possible while they are still fresh. The first 24 to 48 hours usually gives the best chance of preserving color and structure.
`,
  },
  {
    slug: "best-flowers-for-pressing",
    title: "Best Flowers for Pressing: Beginner Guide",
    excerpt:
      "See which flowers, petals, leaves, and garden picks press most easily, plus which thicker blooms need a different approach.",
    metaDescription:
      "Discover the best flowers for pressing, including beginner-friendly blooms, petals, leaves, and bouquet flowers that flatten beautifully.",
    publishedAt: "2026-05-20T09:15:00.000Z",
    authorName: "Hwabelle",
    category: "Beginner Guide",
    seoKeywords: [
      "best flowers for pressing",
      "flower press kit for beginners",
      "garden flower pressing",
    ],
    content: `Choosing the best flowers for pressing is one of the easiest ways to get better results fast. Thin blooms and flexible greenery usually flatten more evenly and dry with less browning.

## Best beginner flowers to press

- Pansies
- Daisies
- Violets
- Cosmos
- Queen Anne's lace
- Ferns
- Small wildflowers

These flowers tend to be naturally flatter, which makes them easier to press evenly.

## Flowers that still work with a little prep

Roses, peonies, carnations, and thicker garden flowers can still become beautiful keepsakes. Instead of pressing the bloom whole, separate petals, outer layers, or smaller sections first.

## What to avoid at first

Very juicy flowers, oversized blooms, or flowers with dense centers are more likely to brown or mold when beginners rush the process. Start with flatter blooms, then work up to more complex bouquet flowers.

## How to keep flowers looking their best

Press flowers while they are fresh, keep moisture under control, and avoid overcrowding layers. A clear [acrylic flower press kit](${productLink}) helps you check petal placement before you tighten the press.

## Build a keepsake plan

Once you know which flowers will press well, use the [flower preservation design assistant](${designerLink}) to map out a frame, card, bookmark, or sentimental bouquet keepsake.

## FAQ

### Are wildflowers good for pressing?

Yes. Many wildflowers press especially well because they are small, delicate, and naturally flatter than bouquet blooms.

### Can I press thick flowers whole?

Sometimes, but most thick flowers look better when separated into petals or smaller sections first.
`,
  },
  {
    slug: "acrylic-vs-wooden-flower-press",
    title: "Acrylic vs Wooden Flower Press: Which Is Better?",
    excerpt:
      "Compare visibility, ease of use, aesthetics, and beginner-friendliness when choosing an acrylic or wooden flower press.",
    metaDescription:
      "Compare acrylic and wooden flower presses to see which option is better for visibility, beginner use, and preserving meaningful flowers.",
    publishedAt: "2026-05-20T09:30:00.000Z",
    authorName: "Hwabelle",
    category: "Buying Guide",
    seoKeywords: [
      "acrylic flower press kit",
      "flower press kit",
      "botanical press kit",
    ],
    content: `Acrylic and wooden flower presses can both preserve flowers well, but they feel different to use.

## Why people choose acrylic presses

Acrylic presses make arrangement easier because you can see placement before tightening the hardware. That is especially helpful for beginners preserving bouquet petals, wildflowers, and layered keepsakes.

## Why some people choose wooden presses

Wooden presses have a traditional craft feel and can be a good fit for people who already know how they like to layer their flowers.

## Which is easier for beginners?

For many first-time pressers, acrylic has an advantage because visibility reduces guesswork. If you want a simple at-home setup, the [acrylic flower press kit](${productLink}) is designed to help you preserve meaningful flowers with more confidence.

## When design help matters

If you are deciding how to turn pressed flowers into a frame or bouquet keepsake, the [flower preservation design assistant](${designerLink}) can help you plan the next step after pressing.
`,
  },
  {
    slug: "flower-pressing-for-beginners",
    title: "Flower Pressing for Beginners: Simple Step-by-Step Guide",
    excerpt:
      "A straightforward beginner guide to picking flowers, layering the press, waiting for results, and avoiding common mistakes.",
    metaDescription:
      "Learn flower pressing for beginners with simple step-by-step instructions, practical tips, and easy ways to preserve flowers at home.",
    publishedAt: "2026-05-20T09:45:00.000Z",
    authorName: "Hwabelle",
    category: "Beginner Guide",
    seoKeywords: [
      "flower pressing for beginners",
      "how to press flowers",
      "flower pressing kit for adults",
    ],
    content: `Flower pressing for beginners gets much easier when you keep the process simple and give each bloom enough time to dry.

## Step 1: Pick flowers at the right moment

Choose flowers that look fresh and are not wilted, bruised, or holding too much moisture after rain.

## Step 2: Prep the flowers

Trim stems, pat away surface water, and separate thick blooms if needed.

## Step 3: Layer the press

Place flowers between absorbent sheets and leave space so petals do not overlap too heavily. A beginner-friendly [acrylic flower press kit](${productLink}) helps you check spacing clearly.

## Step 4: Tighten and wait

Apply even pressure and store the press in a dry area. Many flowers are ready within one to three weeks.

## Step 5: Create something meaningful

Once your flowers are dry, use the [flower preservation design assistant](${designerLink}) if you want help turning them into art, gifts, or wedding keepsakes.
`,
  },
  {
    slug: "what-to-do-with-pressed-flowers",
    title: "What to Do With Pressed Flowers: Keepsake and Craft Ideas",
    excerpt:
      "Pressed flowers can become frames, bookmarks, cards, wedding keepsakes, and botanical art that preserves meaningful moments.",
    metaDescription:
      "Find ideas for what to do with pressed flowers, from frames and bookmarks to wedding keepsakes, cards, and botanical art.",
    publishedAt: "2026-05-20T10:00:00.000Z",
    authorName: "Hwabelle",
    category: "Craft Ideas",
    seoKeywords: [
      "what to do with pressed flowers",
      "pressed flower keepsake",
      "DIY pressed flower art",
    ],
    content: `Pressed flowers can become more than a memory tucked into paper. They can turn into everyday reminders of a wedding day, garden season, memorial bouquet, or meaningful walk.

## Easy keepsake ideas

- Framed pressed flower art
- Greeting cards
- Bookmarks
- Scrapbook pages
- Wedding bouquet keepsakes
- Botanical collages

## Match the project to the flower

Small wildflowers work well in bookmarks and cards. Larger petals often look beautiful in floating frames or layered keepsake art.

## Start with flowers that press cleanly

If you are still building your process, the [acrylic flower press kit](${productLink}) can help you preserve petals and greenery neatly before you start crafting.

## Need layout help?

The [flower preservation design assistant](${designerLink}) is useful when you want ideas for arranging blooms by color, sentiment, or occasion.
`,
  },
];

export const resourcePostBySlug = Object.fromEntries(
  resourcePosts.map((post) => [post.slug, post]),
);
