import fs from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://hwabelle.shop";
const defaultImage = `${siteUrl}/favicon.png`;
const logoImage = `${siteUrl}/assets/hwabelle-logo.png`;

const BLOG_IMAGE_MAP = {
  "how-to-press-flowers-for-beginners": `${siteUrl}/blog-images/acrylic-press-flatlay.jpg`,
  "best-flowers-for-pressing": `${siteUrl}/blog-images/wild-meadow-herbarium.jpg`,
  "how-to-press-roses": `${siteUrl}/blog-images/roses-and-eucalyptus.jpg`,
  "why-do-pressed-flowers-turn-brown": `${siteUrl}/blog-images/color-science-drying.jpg`,
  "how-long-does-it-take-to-press-flowers": `${siteUrl}/blog-images/workbench-tweezers-action.jpg`,
  "acrylic-vs-wooden-flower-press": `${siteUrl}/blog-images/acrylic-press-flatlay.jpg`,
  "how-to-preserve-wedding-bouquet-at-home": `${siteUrl}/blog-images/fresh-bridal-bouquet.jpg`,
  "what-to-do-with-pressed-flowers": `${siteUrl}/blog-images/botanical-art-gifts.jpg`,
  "diy-wedding-bouquet-preservation-kit-guide": `${siteUrl}/blog-images/bridal-keepsake-frame.jpg`,
  "pressing-daisies-and-clover": `${siteUrl}/blog-images/daisies-and-clover.jpg`,
  "pressing-wild-violets-and-fern": `${siteUrl}/blog-images/wild-violets-and-fern.jpg`,
  "pressing-tulips-and-small-wildflowers": `${siteUrl}/blog-images/tulips-and-wildflowers.jpg`,
  "pressing-pansies-and-cosmos": `${siteUrl}/blog-images/pansies-and-cosmos.jpg`,
  "pressing-lavender-and-babys-breath": `${siteUrl}/blog-images/lavender-and-babys-breath.jpg`,
  "pressing-calla-lilies-and-babys-breath": `${siteUrl}/blog-images/calla-lilies-bridal.jpg`,
  "pressing-roses-and-eucalyptus": `${siteUrl}/blog-images/roses-and-eucalyptus.jpg`,
};

const faqHome = [
  {
    question: "Can I use this flower press kit for a wedding bouquet?",
    answer:
      "Yes. Hwabelle can help preserve selected blooms from a wedding bouquet, especially flatter flowers and petals that press well. For best results, start pressing as soon as possible while flowers are still fresh.",
  },
  {
    question: "Is this flower press kit beginner-friendly?",
    answer:
      "Yes. The kit is designed for beginners, crafters, gardeners, and adults who want a simple way to preserve flowers at home.",
  },
  {
    question: "What flowers are best for pressing?",
    answer:
      "Flatter blooms, petals, leaves, wildflowers, and thinner garden flowers usually press best. Thick flowers may need to be separated into petals or smaller sections.",
  },
  {
    question: "How long does flower pressing take?",
    answer:
      "Many flowers take one to three weeks depending on flower thickness, moisture, pressure, and drying conditions.",
  },
];

const productFaq = [
  {
    question: "Can I use this flower press kit for a wedding bouquet?",
    answer:
      "Yes. Hwabelle can help preserve selected blooms from a wedding bouquet, especially flatter flowers and petals that press well. For best results, start pressing as soon as possible while flowers are still fresh.",
  },
  {
    question: "Is this flower press kit beginner-friendly?",
    answer:
      "Yes. The kit is designed for beginners, crafters, gardeners, and adults who want a simple way to preserve flowers at home.",
  },
  {
    question: "What flowers are best for pressing?",
    answer:
      "Flatter blooms, petals, leaves, wildflowers, and thinner garden flowers usually press best. Thick flowers may need to be separated into petals or smaller sections.",
  },
  {
    question: "How long does flower pressing take?",
    answer:
      "Many flowers take one to three weeks depending on flower thickness, moisture, pressure, and drying conditions.",
  },
  {
    question: "What can I make with pressed flowers?",
    answer:
      "Pressed flowers can be used for frames, cards, bookmarks, wedding keepsakes, scrapbooks, and botanical art.",
  },
];

const faqSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: new URL(item.path, siteUrl).toString(),
  })),
});

const resourcePosts = [
  {
    slug: "how-to-press-flowers-for-beginners",
    title: "How to Press Flowers for Beginners: The Complete Step-by-Step Guide | Hwabelle",
    description:
      "A straightforward, beginner-friendly guide to harvesting flowers, assembling the 5-layer press, avoiding browning, and testing for complete dryness.",
    category: "Beginner Guide",
  },
  {
    slug: "best-flowers-for-pressing",
    title: "Best Flowers for Pressing: The Ultimate Botanical Selection Guide | Hwabelle",
    description:
      "Discover which flowers press into paper-thin botanical masterpieces with ease, and how to classify flowers by difficulty tiers from beginner to advanced.",
    category: "Flower Selection",
  },
  {
    slug: "how-to-press-roses",
    title: "How to Press Roses: The 2 Professional Dissection Methods | Hwabelle",
    description:
      "Learn how to preserve thick garden roses and wedding bouquet blooms without browning or mold using petal deconstruction and calyx halving techniques.",
    category: "Flower Selection",
  },
  {
    slug: "why-do-pressed-flowers-turn-brown",
    title: "Why Do Pressed Flowers Turn Brown? (And How to Prevent It) | Hwabelle",
    description:
      "Understand the botanical science behind enzymatic oxidation and learn the 5 proven techniques to keep your pressed flowers bright and vivid.",
    category: "Flower Pressing Basics",
  },
  {
    slug: "how-long-does-it-take-to-press-flowers",
    title: "How Long Does It Take to Press Flowers? Complete Species Drying Matrix | Hwabelle",
    description:
      "From delicate 3-day baby's breath to 3-week dissected peonies, learn exact drying timelines, blotter swap schedules, and how to test for 100% dryness.",
    category: "Flower Pressing Basics",
  },
  {
    slug: "acrylic-vs-wooden-flower-press",
    title: "Acrylic vs Wooden Flower Press: Which Is Better for Beginners? | Hwabelle",
    description:
      "A detailed comparison of visibility, pressure distribution, durability, and moisture resistance between modern acrylic and traditional wooden flower presses.",
    category: "Product Education",
  },
  {
    slug: "how-to-preserve-wedding-bouquet-at-home",
    title: "How to Preserve a Wedding Bouquet at Home | Hwabelle",
    description:
      "Learn how to preserve a wedding bouquet at home with pressing tips, timing advice, and keepsake ideas for sentimental blooms.",
    category: "Wedding Preservation",
  },
  {
    slug: "what-to-do-with-pressed-flowers",
    title: "What to Do With Pressed Flowers: Keepsake and Craft Ideas | Hwabelle",
    description:
      "Find ideas for what to do with pressed flowers, from frames and bookmarks to wedding keepsakes, cards, and botanical art.",
    category: "Craft Ideas",
  },
  {
    slug: "diy-wedding-bouquet-preservation-kit-guide",
    title: "DIY Wedding Bouquet Preservation Kit: The Complete Guide | Hwabelle",
    description:
      "Your ultimate guide to using a DIY wedding bouquet preservation kit. Learn which bridal flowers press best, how to setup your press, and layout tips.",
    category: "Wedding Preservation",
  },
  {
    slug: "pressing-daisies-and-clover",
    title: "How to Press Daisies and Clover: The Field-to-Keepsake Guide | Hwabelle",
    description:
      "Master the art of pressing fresh daisies without brown center disc oxidation, paired with delicate clover sprigs for crisp bookmarks, frames, and botanical stationery.",
    category: "Beginner Guide",
  },
  {
    slug: "pressing-wild-violets-and-fern",
    title: "How to Press Wild Violets and Ferns: The Woodland Keepsake Guide | Hwabelle",
    description:
      "Discover how to press delicate wild violet blooms and fragile fern fronds without bruising, pigment fading, or curled pinnae leaflets in a crystal-clear press.",
    category: "Beginner Guide",
  },
  {
    slug: "pressing-tulips-and-small-wildflowers",
    title: "How to Press Tulips and Small Wildflowers: The Tulip Edition | Hwabelle",
    description:
      "Master the art of flattening cup-shaped spring tulips without mold or petal creasing, combined with airy garden wildflowers for stunning seasonal wall art.",
    category: "Beginner Guide",
  },
  {
    slug: "pressing-pansies-and-cosmos",
    title: "How to Press Pansies and Cosmos: Preserving Faces & Feathery Textures | Hwabelle",
    description:
      "Learn how to press velvety pansy faces and delicate, feathery cosmos flowers without crushing intricate facial markings or tearing airy ray petals.",
    category: "Beginner Guide",
  },
  {
    slug: "pressing-lavender-and-babys-breath",
    title: "How to Press Lavender and Baby's Breath: Slender Stems & Airy Sprigs | Hwabelle",
    description:
      "Master the botanical techniques for pressing fragrant lavender spikes and airy baby's breath sprays without bud drop, browned calyxes, or tangled stem overlaps.",
    category: "Beginner Guide",
  },
  {
    slug: "pressing-calla-lilies-and-babys-breath",
    title: "How to Press Calla Lilies and Baby's Breath: Wedding Preservation Guide | Hwabelle",
    description:
      "Master the professional spathe flattening and calyx reduction techniques for preserving sculptural bridal calla lilies and airy baby's breath for wedding keepsakes.",
    category: "Wedding Preservation",
  },
  {
    slug: "pressing-roses-and-eucalyptus",
    title: "How to Press Roses and Eucalyptus: Whole Blooms, Split Roses & Flat Greenery | Hwabelle",
    description:
      "A gentle, experiment-first guide to pressing roses and eucalyptus together. Compare whole, split, and loose-petal roses, trim woody eucalyptus, and build a flat paper stack.",
    category: "Beginner Guide",
  },
];

const routes = [
  {
    path: "/",
    title: "DIY Wedding Bouquet Preservation Kit & Flower Press | Hwabelle",
    description:
      "Preserve wedding bouquets, garden flowers, and meaningful blooms at home with Hwabelle’s DIY wedding bouquet preservation kit and acrylic flower press.",
    image: `${siteUrl}/assets/hero-pressed-arrangement.webp`,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Hwabelle",
        url: siteUrl,
        logo: logoImage,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Hwabelle",
        url: siteUrl,
      },
      breadcrumbSchema([{ name: "Home", path: "/" }]),
      faqSchema(faqHome),
    ],
  },
  {
    path: "/shop",
    title: "Shop Hwabelle Flower Press Kits | Botanical Press Kits for Adults",
    description:
      "Explore Hwabelle flower press kits designed for beginners, crafters, gardeners, artists, and anyone preserving meaningful flowers at home.",
    image: `${siteUrl}/assets/capture-moment.jpeg`,
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }])],
  },
  {
    path: "/product/flower-press-kit",
    title: "Acrylic Flower Press Kit for Adults | Hwabelle Flower Preservation Kit",
    description:
      "Shop Hwabelle’s acrylic flower press kit for adults and beginners. Preserve wedding bouquets, garden flowers, wildflowers, and meaningful blooms as lasting keepsakes.",
    image: `${siteUrl}/assets/capture-moment.jpeg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Shop", path: "/shop" },
        { name: "Hwabelle Acrylic Flower Press Kit", path: "/product/flower-press-kit" },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${siteUrl}/product/flower-press-kit#product`,
        name: "Hwabelle Acrylic Flower Press Kit",
        sku: "FPK-1-2026",
        description:
          "A beginner-friendly acrylic flower press kit for preserving wedding bouquets, garden flowers, wildflowers, and meaningful blooms at home.",
        category: "Flower Press Kit / Botanical Craft Kit",
        brand: { "@type": "Brand", name: "Hwabelle" },
        image: [
          `${siteUrl}/assets/capture-moment.jpeg`,
          `${siteUrl}/assets/step-by-step.jpeg`,
          `${siteUrl}/assets/comparison.jpeg`,
          `${siteUrl}/assets/digital-designer.jpeg`,
          `${siteUrl}/assets/kit-contents.jpeg`,
        ],
        offers: {
          "@type": "Offer",
          price: 39.99,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          url: `${siteUrl}/product/flower-press-kit`,
          seller: {
            "@type": "Organization",
            name: "Hwabelle",
            url: siteUrl,
          },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: {
              "@type": "MonetaryAmount",
              value: 0,
              currency: "USD",
            },
            shippingDestination: {
              "@type": "DefinedRegion",
              addressCountry: "US",
            },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: {
                "@type": "QuantitativeValue",
                minValue: 1,
                maxValue: 2,
                unitCode: "DAY",
              },
              transitTime: {
                "@type": "QuantitativeValue",
                minValue: 2,
                maxValue: 5,
                unitCode: "DAY",
              },
            },
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "US",
            returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
            merchantReturnDays: 30,
            returnMethod: "https://schema.org/ReturnByMail",
            returnFees: "https://schema.org/FreeReturn",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: 5,
          reviewCount: 5,
          bestRating: 5,
          worstRating: 1,
        },
        review: [
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Amazon Customer" },
            datePublished: "2026-05-20",
            name: "Best press I have used",
            reviewBody:
              "The best press I have used. The 11x11 size is perfect for handling full wedding bouquet roses and hydrangeas without having to cut them down. The thick acrylic plates do not warp and the layering system provides even pressure, yielding flat flowers with minimal browning and excellent color retention. Highly recommended.",
            reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5, worstRating: 1 },
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Amazon Customer" },
            datePublished: "2026-06-02",
            name: "Such A Special Keepsake!",
            reviewBody:
              "Purchased to preserve flowers and special memories. More giftable and pretty than expected; the acrylic style makes it feel modern compared to basic wood craft kits. Highly recommended for weddings, crafts, or any sentimental flowers.",
            reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5, worstRating: 1 },
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "GummyCats" },
            datePublished: "2026-05-28",
            name: "Elegant, cutesy set",
            reviewBody:
              "An elegant and cutesy kit that was easy to figure out. Came with acrylic boards, tweezers, scissors, a carrying bag, and plenty of paper. Fun activity that teaches patience. Amazing value for money.",
            reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5, worstRating: 1 },
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "Elena M." },
            datePublished: "2026-06-14",
            name: "Absolutely stunning kit",
            reviewBody:
              "Absolutely stunning kit. I bought this to press flowers from my anniversary bouquet. The scalloped edge on the acrylic plates is so elegant. The flowers dried very quickly using the thick blotting papers, keeping their vibrant red and purple colors. I love that it comes with a storage bag to keep everything organized.",
            reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5, worstRating: 1 },
          },
          {
            "@type": "Review",
            author: { "@type": "Person", name: "CraftyMom" },
            datePublished: "2026-06-08",
            name: "Perfect for bridal bouquets!",
            reviewBody:
              "Perfect for bridal bouquets! The 11x11 size is large enough to handle thick flowers like roses and hydrangeas. The instructions are very clear, and the results are amazing. No browning or molding at all.",
            reviewRating: { "@type": "Rating", ratingValue: 5, bestRating: 5, worstRating: 1 },
          },
        ],
      },
      faqSchema(productFaq),
    ],
  },
  {
    path: "/designer",
    title: "Hwabelle AI Designer | Flower Preservation Guidance",
    description:
      "Use the Hwabelle AI Designer for flower preservation guidance, wedding bouquet keepsake planning, flower selection tips, and beginner-friendly pressing checklists.",
    image: `${siteUrl}/assets/digital-designer.jpeg`,
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Hwabelle AI Designer", path: "/designer" }])],
  },
  {
    path: "/about",
    title: "About Hwabelle | Flower Preservation & Botanical Keepsakes",
    description:
      "Learn how Hwabelle helps people preserve meaningful flowers, wedding bouquets, garden blooms, and botanical memories with simple flower pressing tools.",
    image: `${siteUrl}/assets/capture-moment.jpeg`,
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])],
  },
  {
    path: "/blog",
    title: "Flower Pressing Resources | Hwabelle Guides",
    description:
      "Explore flower pressing guides from Hwabelle, including bouquet preservation, beginner tutorials, flower selection tips, and pressed flower craft ideas.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Resources", path: "/blog" }])],
  },
  {
    path: "/resources",
    title: "Flower Pressing Guides & Botanical Resources Library | Hwabelle",
    description:
      "Explore free authoritative flower pressing masterclasses, botanical harvesting field guides, drying schedules, and 4-step quick-start tutorials from Hwabelle.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Resources", path: "/resources" }])],
  },
  {
    path: "/community",
    title: "Hwabelle in Bloom | Community Pressed Flower Creations & Stories",
    description:
      "Wedding bouquets, garden finds, meaningful gifts, and works in progress — see what the Hwabelle community is creating, then share your own.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Hwabelle in Bloom Community Gallery",
        description: "Wedding bouquets, garden finds, and botanical keepsakes created by the Hwabelle community.",
        url: `${siteUrl}/community`,
      },
      breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Community", path: "/community" }]),
    ],
  },
  {
    path: "/community/submit",
    title: "Share Your Creation | Hwabelle in Bloom Community",
    description:
      "Submit your DIY pressed flower wedding bouquet, floral keepsake, or botanical craft project to be featured in the Hwabelle community gallery.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Community", path: "/community" },
        { name: "Share Creation", path: "/community/submit" },
      ]),
    ],
  },
  {
    path: "/resources/flower-pressing-guide",
    title: "The Beginner's Master Guide to Flower Pressing | Hwabelle Masterclass",
    description:
      "Learn how to press flowers at home with Hwabelle's complete master guide. Master drying timelines, avoid browning, assemble the 5-layer press, and create lasting keepsakes.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: "Beginner's Master Guide to Flower Pressing", path: "/resources/flower-pressing-guide" },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "The Beginner's Master Guide to Flower Pressing",
        description: "The complete science of moisture extraction, pressure distribution, drying timeline matrices, and archival framing.",
        author: { "@type": "Organization", name: "Hwabelle" },
        datePublished: "2026-08-25T00:00:00.000Z",
        image: `${siteUrl}/assets/blog-botanical-art.jpg`,
      },
    ],
  },
  {
    path: "/resources/flower-selection-guide",
    title: "The Botanical Selection & Harvesting Field Guide | Hwabelle",
    description:
      "The authoritative guide to selecting and preparing flowers for pressing. Discover flower tiers, 3D rose dissection methods, harvesting rules, and color retention tips.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: "Botanical Selection & Harvesting Field Guide", path: "/resources/flower-selection-guide" },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "The Botanical Selection & Harvesting Field Guide",
        description: "How to forage, pick, and prepare blooms for flawless pressed flower art.",
        author: { "@type": "Organization", name: "Hwabelle" },
        datePublished: "2026-08-25T00:00:00.000Z",
        image: `${siteUrl}/assets/blog-botanical-art.jpg`,
      },
    ],
  },
  {
    path: "/resources/quick-start-guide",
    title: "Press Flowers in 4 Simple Steps: Quick-Start Guide | Hwabelle",
    description:
      "The official Hwabelle quick-start guide to flower pressing in 4 simple steps: Choose, Arrange, Press, and Create. Visual layout instructions and kit anatomy.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: "Press Flowers in 4 Simple Steps", path: "/resources/quick-start-guide" },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "Press Flowers in 4 Simple Steps",
        description: "The official Hwabelle quick-start visual operating guide: CHOOSE -> ARRANGE -> PRESS -> CREATE.",
        author: { "@type": "Organization", name: "Hwabelle" },
        datePublished: "2026-08-25T00:00:00.000Z",
        image: `${siteUrl}/assets/blog-botanical-art.jpg`,
      },
    ],
  },
  {
    path: "/resources/pressing-daisies-and-clover",
    title: "Pressing Daisies and Clover Field Guide | Hwabelle",
    description:
      "A species-specific botanical field guide for daisies and clover. Master the technique of keeping white petals flat and sunny center discs crisp without browning.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: "Pressing Daisies and Clover", path: "/resources/pressing-daisies-and-clover" },
      ]),
    ],
  },
  {
    path: "/resources/pressing-wild-violets-and-fern",
    title: "Pressing Wild Violets and Fern Field Guide | Hwabelle",
    description:
      "A quiet field-to-keepsake guide for delicate wild violets and woodland fern fronds. Card-guided flattening and ethical foraging rhythms.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: "Pressing Wild Violets and Fern", path: "/resources/pressing-wild-violets-and-fern" },
      ]),
    ],
  },
  {
    path: "/resources/pressing-tulips-and-small-wildflowers",
    title: "Pressing Tulips and Small Wildflowers Field Guide | Hwabelle",
    description:
      "A thoughtful guide to arranging cup-shaped spring tulips and delicate garden wildflowers in the Hwabelle acrylic press.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: "Pressing Tulips and Small Wildflowers", path: "/resources/pressing-tulips-and-small-wildflowers" },
      ]),
    ],
  },
  {
    path: "/resources/pressing-pansies-and-cosmos",
    title: "Pressing Pansies and Cosmos Field Guide | Hwabelle",
    description:
      "Master preserving intricate pansy face markings and airy, feathery cosmos blooms with balanced 360-degree acrylic press pressure.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: "Pressing Pansies and Cosmos", path: "/resources/pressing-pansies-and-cosmos" },
      ]),
    ],
  },
  {
    path: "/resources/pressing-lavender-and-babys-breath",
    title: "Pressing Lavender and Baby's Breath Field Guide | Hwabelle",
    description:
      "A calm guide to preparing fresh lavender spikes and airy baby's breath clusters. Preserve slender texture and scent memory.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: "Pressing Lavender and Baby's Breath", path: "/resources/pressing-lavender-and-babys-breath" },
      ]),
    ],
  },
  {
    path: "/resources/pressing-calla-lilies-and-babys-breath",
    title: "Pressing Calla Lilies and Baby's Breath Wedding Field Guide | Hwabelle",
    description:
      "Professional spathe flattening and calyx reduction techniques for preserving sculptural bridal calla lilies and airy baby's breath.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: "Pressing Calla Lilies and Baby's Breath", path: "/resources/pressing-calla-lilies-and-babys-breath" },
      ]),
    ],
  },
  {
    path: "/resources/pressing-roses-and-eucalyptus",
    title: "Pressing Roses and Eucalyptus Field Guide (Free PDF) | Hwabelle",
    description:
      "Step-by-step guide to pressing whole, split, and loose-petal roses with flat eucalyptus sprigs in your 12x12 Hwabelle press.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: "Pressing Roses and Eucalyptus", path: "/resources/pressing-roses-and-eucalyptus" },
      ]),
    ],
  },
  {
    path: "/free-flower-pressing-guide",
    title: "Free Beginner's Guide to Flower Pressing (Instant PDF Download) | Hwabelle",
    description:
      "Download Hwabelle's free beginner's guide to flower pressing. Learn which flowers press best, drying schedules, avoiding browning, and keepsake ideas.",
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
    schema: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Free Flower Pressing Guide", path: "/free-flower-pressing-guide" },
      ]),
    ],
  },
  {
    path: "/flower-quiz",
    title: "Flower Personality Quiz: What's Your Flower? | Hwabelle",
    description:
      "Take a quick personality quiz to discover your signature flower, what it represents, pressing tips, and a personalized pressed-flower project idea.",
    image: `${siteUrl}/assets/hero-pressed-arrangement.webp`,
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find Your Flower", path: "/flower-quiz" }])],
  },
  ...resourcePosts.map((post) => {
    const postImage = BLOG_IMAGE_MAP[post.slug] || `${siteUrl}/blog-images/acrylic-press-flatlay.jpg`;
    return {
      path: `/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      image: postImage,
      schema: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/blog" },
          { name: post.title.replace(" | Hwabelle", ""), path: `/blog/${post.slug}` },
        ]),
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title.replace(" | Hwabelle", ""),
          description: post.description,
          author: { "@type": "Organization", name: "Hwabelle" },
          datePublished: "2026-05-20T09:00:00.000Z",
          image: postImage,
        },
      ],
    };
  }),
  {
    path: "/contact",
    title: "Contact Hwabelle | Flower Press Kit Support",
    description:
      "Contact Hwabelle for flower pressing questions, bouquet preservation help, product details, and customer support.",
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])],
  },
  {
    path: "/faq",
    title: "Flower Press Kit FAQ | Hwabelle",
    description:
      "Find answers about Hwabelle flower press kits, bouquet preservation, beginner flower pressing, and common support questions.",
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }])],
  },
  {
    path: "/shipping",
    title: "Shipping Information | Hwabelle",
    description:
      "Review Hwabelle shipping information, Amazon fulfillment details, delivery timing guidance, and order tracking information.",
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Shipping", path: "/shipping" }])],
  },
  {
    path: "/returns",
    title: "Returns Information | Hwabelle",
    description:
      "Read Hwabelle returns information, Amazon return steps, refund timing guidance, and how to handle damaged orders.",
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Returns", path: "/returns" }])],
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Hwabelle",
    description:
      "Read the Hwabelle privacy policy for information about data collection, order processing, shipping data, security, and customer privacy.",
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }])],
  },
  {
    path: "/terms",
    title: "Terms of Service | Hwabelle",
    description:
      "Review the Hwabelle terms of service for site usage, product information, ordering, fulfillment, returns, and legal terms.",
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Terms of Service", path: "/terms" }])],
  },
  {
    path: "/data-protection",
    title: "Data Protection Policy | Hwabelle",
    description:
      "Review Hwabelle’s data protection policy covering access controls, encryption, retention, incident response, and partner data handling.",
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Data Protection Policy", path: "/data-protection" }])],
  },
];

const routeHtml = (template, route) => {
  const canonical = new URL(route.path, siteUrl).toString();
  const image = route.image || defaultImage;
  const schemaTags = (route.schema || [])
    .map(
      (entry, index) =>
        `<script type="application/ld+json" data-hwabelle-seo="jsonld" data-hwabelle-schema-index="${index}">${JSON.stringify(entry)}</script>`,
    )
    .join("\n    ");

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${route.description}" />`,
    )
    .replace(
      /<meta name="robots" content="[^"]*" \/>/,
      `<meta name="robots" content="index,follow" />`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${canonical}" />`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${route.title}" />`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${route.description}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${canonical}" />`,
    )
    .replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${image}" />`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${route.title}" />`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${route.description}" />`,
    )
    .replace(
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${image}" />`,
    )
    .replace("</head>", `${schemaTags ? `    ${schemaTags}\n` : ""}</head>`);
};

const ensureCleanRouteDir = async (publicDir, routePath) => {
  const routeDir = path.join(publicDir, routePath.replace(/^\//, ""));
  await fs.mkdir(routeDir, { recursive: true });
  return routeDir;
};

const main = async () => {
  const root = process.cwd();
  const distDir = path.join(root, "dist");
  const template = await fs.readFile(path.join(distDir, "index.html"), "utf8");

  for (const route of routes) {
    if (route.path === "/") continue;
    const routeDir = await ensureCleanRouteDir(distDir, route.path);
    const html = routeHtml(template, route);
    await fs.writeFile(path.join(routeDir, "index.html"), html);
  }
};

await main();

