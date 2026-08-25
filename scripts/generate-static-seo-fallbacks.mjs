import fs from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://hwabelle.shop";
const defaultImage = `${siteUrl}/favicon.png`;
const logoImage = `${siteUrl}/assets/hwabelle-logo.png`;

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
    slug: "how-to-preserve-wedding-bouquet-at-home",
    title: "How to Preserve a Wedding Bouquet at Home | Hwabelle",
    description:
      "Learn how to preserve a wedding bouquet at home with pressing tips, timing advice, and keepsake ideas for sentimental blooms.",
    category: "Wedding Preservation",
  },
  {
    slug: "best-flowers-for-pressing",
    title: "Best Flowers for Pressing: Beginner Guide | Hwabelle",
    description:
      "Discover the best flowers for pressing, including beginner-friendly blooms, petals, leaves, and bouquet flowers that flatten beautifully.",
    category: "Beginner Guide",
  },
  {
    slug: "acrylic-vs-wooden-flower-press",
    title: "Acrylic vs Wooden Flower Press: Which Is Better? | Hwabelle",
    description:
      "Compare acrylic and wooden flower presses to see which option is better for visibility, beginner use, and preserving meaningful flowers.",
    category: "Buying Guide",
  },
  {
    slug: "flower-pressing-for-beginners",
    title: "Flower Pressing for Beginners: Simple Step-by-Step Guide | Hwabelle",
    description:
      "Learn flower pressing for beginners with simple step-by-step instructions, practical tips, and easy ways to preserve flowers at home.",
    category: "Beginner Guide",
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
        name: "Hwabelle Acrylic Flower Press Kit",
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
          price: 34.99,
          priceCurrency: "USD",
          url: `${siteUrl}/product/flower-press-kit`,
        },
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
    path: "/flower-quiz",
    title: "Flower Personality Quiz: What's Your Flower? | Hwabelle",
    description:
      "Take a quick personality quiz to discover your signature flower, what it represents, pressing tips, and a personalized pressed-flower project idea.",
    image: `${siteUrl}/assets/hero-pressed-arrangement.webp`,
    schema: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Find Your Flower", path: "/flower-quiz" }])],
  },
  ...resourcePosts.map((post) => ({
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    image: `${siteUrl}/assets/blog-botanical-art.jpg`,
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
        image: `${siteUrl}/assets/blog-botanical-art.jpg`,
      },
    ],
  })),
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

