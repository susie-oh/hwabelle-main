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
