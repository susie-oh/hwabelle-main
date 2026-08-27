import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  CANONICAL_RESOURCE_IDS,
  RESOURCE_REGISTRY,
  getResourceById,
  isValidResourceId,
} from "@/data/resourceRegistry";
import {
  isPathExcludedFromOffer,
  isOfferDismissed,
  setOfferDismissed,
  isResourceClaimed,
  setResourceClaimed,
} from "@/lib/resources/suppression";
import {
  trackResourcePopupView,
  trackResourcePopupDismiss,
  trackResourceFormStart,
  trackResourceClaimed,
  trackResourceDownload,
  trackBlogResourceClick,
  trackResourceProductClick,
} from "@/lib/resources/analytics";
import { initialBlogArticles } from "@/content/resources";

describe("Resource Registry & Content Models", () => {
  it("defines exactly the 3 canonical resources", () => {
    expect(CANONICAL_RESOURCE_IDS).toEqual([
      "flower-pressing-guide",
      "flower-selection-guide",
      "quick-start-guide",
    ]);
  });

  it("identifies flower-pressing-guide as the flagship lead magnet", () => {
    const flagship = getResourceById("flower-pressing-guide");
    expect(flagship).toBeDefined();
    expect(flagship?.isFlagship).toBe(true);
    expect(flagship?.title).toContain("Beginner's Master Guide to Flower Pressing");
  });

  it("validates resource IDs correctly", () => {
    expect(isValidResourceId("flower-pressing-guide")).toBe(true);
    expect(isValidResourceId("flower-selection-guide")).toBe(true);
    expect(isValidResourceId("quick-start-guide")).toBe(true);
    expect(isValidResourceId("unsupported-guide")).toBe(false);
  });

  it("contains all 6 initial high-intent blog articles", () => {
    expect(initialBlogArticles).toHaveLength(6);
    const slugs = initialBlogArticles.map((a) => a.slug);
    expect(slugs).toContain("how-to-press-flowers-for-beginners");
    expect(slugs).toContain("best-flowers-for-pressing");
    expect(slugs).toContain("how-to-press-roses");
    expect(slugs).toContain("why-do-pressed-flowers-turn-brown");
    expect(slugs).toContain("how-long-does-it-take-to-press-flowers");
    expect(slugs).toContain("acrylic-vs-wooden-flower-press");
  });
});

describe("Resource Offer Suppression Logic", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("excludes conversion and acquisition paths", () => {
    expect(isPathExcludedFromOffer("/cart")).toBe(true);
    expect(isPathExcludedFromOffer("/checkout")).toBe(true);
    expect(isPathExcludedFromOffer("/order-confirmation")).toBe(true);
    expect(isPathExcludedFromOffer("/free-flower-pressing-guide")).toBe(true);
    expect(isPathExcludedFromOffer("/blog")).toBe(false);
    expect(isPathExcludedFromOffer("/resources")).toBe(false);
    expect(isPathExcludedFromOffer("/product/flower-press-kit")).toBe(false);
  });

  it("handles 7-day dismissal suppression correctly", () => {
    expect(isOfferDismissed()).toBe(false);
    setOfferDismissed();
    expect(isOfferDismissed()).toBe(true);
  });

  it("supports independent per-resource claim suppression", () => {
    expect(isResourceClaimed("flower-pressing-guide")).toBe(false);
    expect(isResourceClaimed("flower-selection-guide")).toBe(false);

    setResourceClaimed("flower-pressing-guide");

    // Only flower-pressing-guide is claimed; others remain unclaimed for progressive lead nurturing
    expect(isResourceClaimed("flower-pressing-guide")).toBe(true);
    expect(isResourceClaimed("flower-selection-guide")).toBe(false);
  });
});

describe("GA4 Zero-PII Analytics Helpers", () => {
  beforeEach(() => {
    window.gtag = vi.fn();
  });

  it("dispatches resource_popup_view with zero PII", () => {
    trackResourcePopupView({
      resource_id: "flower-pressing-guide",
      page_path: "/blog/how-to-press-flowers-for-beginners",
      source_type: "popup",
      offer_trigger: "scroll",
    });

    expect(window.gtag).toHaveBeenCalledWith("event", "resource_popup_view", {
      resource_id: "flower-pressing-guide",
      page_path: "/blog/how-to-press-flowers-for-beginners",
      source_type: "popup",
      offer_trigger: "scroll",
    });
  });

  it("dispatches resource_claimed with zero PII", () => {
    trackResourceClaimed({
      resource_id: "flower-pressing-guide",
      page_path: "/free-flower-pressing-guide",
      source_type: "landing_page",
      offer_trigger: "landing_page",
      resource_position: "landing_page",
    });

    expect(window.gtag).toHaveBeenCalledWith("event", "resource_claimed", {
      resource_id: "flower-pressing-guide",
      page_path: "/free-flower-pressing-guide",
      source_type: "landing_page",
      offer_trigger: "landing_page",
      resource_position: "landing_page",
    });
  });

  it("dispatches resource_product_click correctly", () => {
    trackResourceProductClick({
      resource_id: "flower-pressing-guide",
      product_path: "/product/flower-press-kit",
      source_page: "/resources/flower-pressing-guide",
    });

    expect(window.gtag).toHaveBeenCalledWith("event", "resource_product_click", {
      resource_id: "flower-pressing-guide",
      product_path: "/product/flower-press-kit",
      source_page: "/resources/flower-pressing-guide",
    });
  });
});
