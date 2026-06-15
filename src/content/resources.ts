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

Pressed bouquet flowers can become a frame, anniversary gift, scrapbook page, or small botanical art piece. If you want help choosing layouts or which flowers to save first, the [Hwabelle AI Designer](${designerLink}) can help you plan the keepsake before you start.

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

Once you know which flowers will press well, use the [Hwabelle AI Designer](${designerLink}) to map out a frame, card, bookmark, or sentimental bouquet keepsake.

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

If you are deciding how to turn pressed flowers into a frame or bouquet keepsake, the [Hwabelle AI Designer](${designerLink}) can help you plan the next step after pressing.
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

Once your flowers are dry, use the [Hwabelle AI Designer](${designerLink}) if you want help turning them into art, gifts, or wedding keepsakes.
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

The [Hwabelle AI Designer](${designerLink}) is useful when you want ideas for arranging blooms by color, sentiment, or occasion.
`,
  },
  {
    slug: "diy-wedding-bouquet-preservation-kit-guide",
    title: "DIY Wedding Bouquet Preservation Kit: The Complete Guide",
    excerpt:
      "Everything you need to know about preserving your wedding bouquet using a DIY press kit, including flower care, layout designs, and step-by-step pressing.",
    metaDescription:
      "Your ultimate guide to using a DIY wedding bouquet preservation kit. Learn which bridal flowers press best, how to setup your press, and layout tips.",
    publishedAt: "2026-06-15T09:00:00.000Z",
    authorName: "Hwabelle",
    category: "Wedding Preservation",
    seoKeywords: [
      "diy wedding bouquet preservation kit",
      "wedding bouquet preservation",
      "how to press wedding flowers",
    ],
    content: `A wedding bouquet is one of the most sentimentally significant floral arrangements you will ever hold. Preserving it allows you to keep those memories alive. With a DIY wedding bouquet preservation kit, you can capture the beauty of your bridal flowers right at home.

This complete guide walks you through the steps to successfully press, dry, and arrange your wedding flowers into a lasting botanical keepsake.

## Why Choose a DIY Wedding Bouquet Preservation Kit?

Rather than sending your bouquet to a commercial preservation service—which can cost hundreds of dollars and take months—a DIY kit gives you full creative control. You can press the flowers yourself, check on their progress, and design your own framed keepsake.

An [acrylic flower press kit](${productLink}) is particularly useful because the transparent plates let you see exactly how the petals and leaves are lying before you apply pressure.

## The Preservation Timeline: Step-by-Step

### 1. Pre-Wedding Preparation
Before your wedding day, make sure your DIY preservation kit is assembled and ready. Store it in a dry place. Assign a trusted friend or bridesmaid to take care of the bouquet at the end of the reception so it doesn't get damaged or left without water.

### 2. Post-Wedding Selection (1-2 Days After)
Start as soon as possible. Choose the freshest flowers from the bouquet.
- **Best Candidates:** Flat flowers (like anemones, cosmos, and daisies), single petals from thick flowers (like roses and peonies), and delicate filler greenery (like eucalyptus, ferns, and baby's breath).
- **What to Avoid:** Wilted, bruised, or brown petals. Flowers that have been out of water for too long.

### 3. Setting Up the Press
Layer your selected blooms carefully between the absorbent sheets included in the press.
- Trim stems to your desired length or remove them completely to press only the flower head.
- For thick blooms like roses, gently pull off individual petals and press them separately, or cut the flower in half vertically if you want a flat profile.
- Do not let flowers overlap, as they may stick together or dry unevenly.

### 4. Tightening and Storing
Place the top plate on and tighten the hardware evenly. Store the press in a warm, dry room with good air circulation.

### 5. Drying Period (2-3 Weeks)
Leave the flowers in the press for at least two to three weeks. You can check their progress after the first week and replace the blotting papers if they feel noticeably damp.

## Arranging Your Pressed Bouquet Art

Once fully dried, your flowers will be thin, delicate, and paper-like. Now you can design your keepsake!
- **Floating Frames:** Arrange the pressed flowers between two sheets of glass in a wooden frame for a modern look.
- **Keepsake Layouts:** Arrange the flowers to recreate the shape of your original bouquet, or scatter them in a minimalist botanical grid.
- Use the [Hwabelle AI Designer](${designerLink}) for custom arrangement guidance and checklist reminders tailored to your specific bouquet flowers.

## FAQ

### Can thick flowers like roses be pressed?
Yes, but they should not be pressed whole. Separate them into individual petals or slice them in half vertically to reduce moisture and allow them to dry without molding.

### How do I prevent pressed flowers from browning?
Keep the press in a dry, dark place while drying, and ensure the blotting papers are clean and dry. Exposure to moisture and direct sunlight during drying are the main causes of browning.
`,
  },
];

export const resourcePostBySlug = Object.fromEntries(
  resourcePosts.map((post) => [post.slug, post]),
);
