import { BRAND_NAME, SITE_URL } from "@/lib/site";

export const organizationSchema = (logoUrl: string, sameAs: string[] = []) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND_NAME,
  url: SITE_URL,
  logo: logoUrl,
  ...(sameAs.length ? { sameAs } : {}),
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND_NAME,
  url: SITE_URL,
});

export const breadcrumbSchema = (
  items: Array<{ name: string; path: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: new URL(item.path, SITE_URL).toString(),
  })),
});

export const faqSchema = (
  items: Array<{ question: string; answer: string }>,
) => ({
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

export const collectionPageSchema = (
  name = "Hwabelle in Bloom Community Gallery",
  description = "Wedding bouquets, garden flowers, and botanical keepsakes created by the Hwabelle community.",
  url = `${SITE_URL}/community`,
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url,
  publisher: {
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
  },
});

export const creativeWorkSchema = ({
  title,
  description,
  authorName,
  datePublished,
  image,
  url,
  genre,
}: {
  title: string;
  description: string;
  authorName: string;
  datePublished?: string;
  image?: string;
  url: string;
  genre?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: title,
  description,
  author: {
    "@type": "Person",
    name: authorName,
  },
  ...(datePublished ? { datePublished } : {}),
  ...(image ? { image } : {}),
  url,
  ...(genre ? { genre } : {}),
  publisher: {
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
  },
});
