import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const requiredFiles = ["public/robots.txt", "public/sitemap.xml", "public/llms.txt"];
const errors = [];

const exists = async (file) => {
  try {
    await fs.access(path.join(root, file));
    return true;
  } catch {
    return false;
  }
};

for (const file of requiredFiles) {
  if (!(await exists(file))) {
    errors.push(`Missing required file: ${file}`);
  }
}

const robots = await fs.readFile(path.join(root, "public/robots.txt"), "utf8");
if (!robots.includes("Sitemap: https://hwabelle.shop/sitemap.xml")) {
  errors.push("robots.txt does not reference https://hwabelle.shop/sitemap.xml");
}

const sitemap = await fs.readFile(path.join(root, "public/sitemap.xml"), "utf8");
const locMatches = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (locMatches.some((url) => !url.startsWith("https://hwabelle.shop"))) {
  errors.push("sitemap.xml contains non-hwabelle.shop URLs");
}
if (locMatches.some((url) => url.includes("/admin") || url.includes("/my-orders") || url.includes("/unlock") || url.includes("/order-confirmation"))) {
  errors.push("sitemap.xml contains URLs that should not be indexed");
}

const scanDir = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await scanDir(fullPath);
      continue;
    }
    if (!/\.(ts|tsx|js|jsx|html|xml|txt|json|mjs)$/.test(entry.name)) continue;
    const content = await fs.readFile(fullPath, "utf8");
    if (content.includes("hwabelle.com")) {
      errors.push(`Found old hwabelle.com reference in ${path.relative(root, fullPath)}`);
    }
    if (entry.name === "index.html" && fullPath.includes(`${path.sep}public${path.sep}`)) {
      const scripts = [...content.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
      for (const [idx, script] of scripts.entries()) {
        try {
          JSON.parse(script[1]);
        } catch (error) {
          errors.push(`Invalid JSON-LD in ${path.relative(root, fullPath)} script ${idx + 1}: ${error.message}`);
        }
      }
    }
  }
};

await scanDir(path.join(root, "src"));
await scanDir(path.join(root, "public"));

if (await exists("dist")) {
  const expectedDistRouteFiles = [
    "dist/shop/index.html",
    "dist/product/flower-press-kit/index.html",
    "dist/designer/index.html",
    "dist/about/index.html",
    "dist/blog/index.html",
  ];

  for (const file of expectedDistRouteFiles) {
    if (!(await exists(file))) {
      errors.push(`Missing built route fallback: ${file}`);
    }
  }

  // Validate built Product JSON-LD for Google Search Console Product Snippets & Merchant Listings
  const productHtmlPath = path.join(root, "dist/product/flower-press-kit/index.html");
  if (await exists("dist/product/flower-press-kit/index.html")) {
    const productHtml = await fs.readFile(productHtmlPath, "utf8");
    const jsonLdBlocks = [...productHtml.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) =>
      JSON.parse(m[1]),
    );
    const productNode = jsonLdBlocks.find((node) => node && node["@type"] === "Product");
    if (!productNode) {
      errors.push("Missing Product JSON-LD in dist/product/flower-press-kit/index.html");
    } else {
      if (!productNode.offers?.availability) errors.push("Product JSON-LD missing offers.availability");
      if (!productNode.offers?.shippingDetails) errors.push("Product JSON-LD missing offers.shippingDetails");
      if (!productNode.offers?.hasMerchantReturnPolicy) errors.push("Product JSON-LD missing offers.hasMerchantReturnPolicy");
      if (!productNode.aggregateRating) errors.push("Product JSON-LD missing aggregateRating");
      if (!Array.isArray(productNode.review) || productNode.review.length === 0) {
        errors.push("Product JSON-LD missing review array");
      }
    }
  }
}

if (errors.length) {
  console.error("SEO validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("SEO validation passed.");
