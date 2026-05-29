export const SITE_URL = "https://hwabelle.shop";
export const BRAND_NAME = "Hwabelle";
export const DEFAULT_TITLE =
  "Hwabelle Flower Press Kit | Preserve Meaningful Flowers at Home";
export const DEFAULT_DESCRIPTION =
  "Preserve wedding bouquets, garden flowers, wildflowers, and meaningful blooms with Hwabelle’s beginner-friendly acrylic flower press kit.";

export const PRODUCT = {
  id: "flower-press-kit",
  name: "Hwabelle Acrylic Flower Press Kit",
  shortName: "Acrylic Flower Press Kit",
  price: 0.50,
  currency: "USD",
  slug: "flower-press-kit",
  category: "Flower Press Kit / Botanical Craft Kit",
  description:
    "A beginner-friendly acrylic flower press kit for preserving wedding bouquets, garden flowers, wildflowers, and meaningful blooms at home.",
};

export const PRODUCT_PATH = `/product/${PRODUCT.slug}`;

export const defaultKeywords = [
  "flower press kit",
  "acrylic flower press kit",
  "flower pressing kit",
  "flower pressing kit for adults",
  "botanical press kit",
  "wedding bouquet preservation kit",
  "preserve wedding bouquet at home",
  "pressed flower keepsake",
  "flower press kit for beginners",
];

export const corePaths = {
  home: "/",
  shop: "/shop",
  product: PRODUCT_PATH,
  designer: "/designer",
  about: "/about",
  blog: "/blog",
  faq: "/faq",
  contact: "/contact",
  shipping: "/shipping",
  returns: "/returns",
  privacy: "/privacy",
  terms: "/terms",
  dataProtection: "/data-protection",
};

export const buildCanonicalUrl = (path: string) =>
  new URL(path, SITE_URL).toString();
