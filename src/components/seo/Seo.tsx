import { useEffect } from "react";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_URL } from "@/lib/site";

type RobotsValue =
  | "index,follow"
  | "noindex,follow"
  | "index,nofollow"
  | "noindex,nofollow";

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "product" | "article";
  keywords?: string[];
  robots?: RobotsValue;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const META_ATTRS = [
  { attr: "name", value: "description" },
  { attr: "name", value: "keywords" },
  { attr: "name", value: "robots" },
  { attr: "property", value: "og:title" },
  { attr: "property", value: "og:description" },
  { attr: "property", value: "og:type" },
  { attr: "property", value: "og:url" },
  { attr: "property", value: "og:image" },
  { attr: "name", value: "twitter:card" },
  { attr: "name", value: "twitter:title" },
  { attr: "name", value: "twitter:description" },
  { attr: "name", value: "twitter:image" },
];

const ensureMeta = (selector: string, attr: string, value: string) => {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, value);
    document.head.appendChild(node);
  }
  return node;
};

const ensureLink = (rel: string) => {
  let node = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!node) {
    node = document.createElement("link");
    node.rel = rel;
    document.head.appendChild(node);
  }
  return node;
};

const upsertSchema = (schemas: Array<Record<string, unknown>>) => {
  document
    .head
    .querySelectorAll('script[data-hwabelle-seo="jsonld"]')
    .forEach((node) => node.remove());

  schemas.forEach((schema, index) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.hwabelleSeo = "jsonld";
    script.dataset.hwabelleSchemaIndex = String(index);
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  });
};

const Seo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = `${SITE_URL}/favicon.png`,
  type = "website",
  keywords = [],
  robots = "index,follow",
  schema,
}: SeoProps) => {
  useEffect(() => {
    const canonical = new URL(path, SITE_URL).toString();
    const resolvedTitle = title || DEFAULT_TITLE;
    const resolvedDescription = description || DEFAULT_DESCRIPTION;

    document.title = resolvedTitle;

    ensureMeta('meta[name="description"]', "name", "description").content =
      resolvedDescription;
    ensureMeta('meta[name="keywords"]', "name", "keywords").content =
      keywords.join(", ");
    ensureMeta('meta[name="robots"]', "name", "robots").content = robots;
    ensureMeta('meta[property="og:title"]', "property", "og:title").content =
      resolvedTitle;
    ensureMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
    ).content = resolvedDescription;
    ensureMeta('meta[property="og:type"]', "property", "og:type").content = type;
    ensureMeta('meta[property="og:url"]', "property", "og:url").content =
      canonical;
    ensureMeta('meta[property="og:image"]', "property", "og:image").content =
      image;
    ensureMeta('meta[name="twitter:card"]', "name", "twitter:card").content =
      "summary_large_image";
    ensureMeta('meta[name="twitter:title"]', "name", "twitter:title").content =
      resolvedTitle;
    ensureMeta(
      'meta[name="twitter:description"]',
      "name",
      "twitter:description",
    ).content = resolvedDescription;
    ensureMeta('meta[name="twitter:image"]', "name", "twitter:image").content =
      image;
    ensureLink("canonical").href = canonical;

    if (schema) {
      upsertSchema(Array.isArray(schema) ? schema : [schema]);
    } else {
      document
        .head
        .querySelectorAll('script[data-hwabelle-seo="jsonld"]')
        .forEach((node) => node.remove());
    }

    return () => {
      META_ATTRS.forEach(({ attr, value }) => {
        const node = document.head.querySelector(`meta[${attr}="${value}"]`);
        if (node) {
          node.remove();
        }
      });

      const canonicalLink = document.head.querySelector('link[rel="canonical"]');
      canonicalLink?.remove();
      document
        .head
        .querySelectorAll('script[data-hwabelle-seo="jsonld"]')
        .forEach((node) => node.remove());
      document.title = DEFAULT_TITLE;
      ensureMeta('meta[name="description"]', "name", "description").content =
        DEFAULT_DESCRIPTION;
      ensureMeta('meta[property="og:title"]', "property", "og:title").content =
        DEFAULT_TITLE;
      ensureMeta(
        'meta[property="og:description"]',
        "property",
        "og:description",
      ).content = DEFAULT_DESCRIPTION;
      ensureMeta('meta[property="og:type"]', "property", "og:type").content =
        "website";
      ensureMeta('meta[property="og:url"]', "property", "og:url").content =
        SITE_URL;
      ensureMeta('meta[property="og:image"]', "property", "og:image").content =
        `${SITE_URL}/favicon.png`;
      ensureMeta('meta[name="twitter:card"]', "name", "twitter:card").content =
        "summary_large_image";
      ensureMeta('meta[name="twitter:title"]', "name", "twitter:title").content =
        DEFAULT_TITLE;
      ensureMeta(
        'meta[name="twitter:description"]',
        "name",
        "twitter:description",
      ).content = DEFAULT_DESCRIPTION;
      ensureMeta('meta[name="twitter:image"]', "name", "twitter:image").content =
        `${SITE_URL}/favicon.png`;
      ensureMeta('meta[name="robots"]', "name", "robots").content = "index,follow";
      ensureMeta('meta[name="keywords"]', "name", "keywords").content = "";
      ensureLink("canonical").href = SITE_URL;
    };
  }, [description, image, keywords, path, robots, schema, title, type]);

  return null;
};

export default Seo;
