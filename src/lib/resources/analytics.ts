/**
 * Resource Funnel GA4 Analytics Helpers
 * STRICT PRIVACY REQUIREMENT: Zero PII (no email addresses, no names, no form values)
 */

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "set" | "js",
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export type ResourcePosition =
  | "popup"
  | "hero"
  | "inline"
  | "footer"
  | "resource_card"
  | "landing_page";

export type OfferTrigger =
  | "timer"
  | "scroll"
  | "second_page"
  | "inline_cta"
  | "landing_page"
  | "resource_hub";

function sendAnalyticsEvent(
  eventName: string,
  params: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined" || !window.gtag) return;

  // Filter out any undefined or null values
  const cleanParams: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      cleanParams[key] = value;
    }
  }

  try {
    window.gtag("event", eventName, cleanParams);
  } catch (err) {
    console.debug("[Analytics] Failed to send event:", eventName, err);
  }
}

export function trackResourcePopupView(data: {
  resource_id: string;
  page_path: string;
  source_type: string;
  offer_trigger: OfferTrigger;
}) {
  sendAnalyticsEvent("resource_popup_view", {
    resource_id: data.resource_id,
    page_path: data.page_path,
    source_type: data.source_type,
    offer_trigger: data.offer_trigger,
  });
}

export function trackResourcePopupDismiss(data: {
  resource_id: string;
  page_path: string;
  offer_trigger: OfferTrigger;
}) {
  sendAnalyticsEvent("resource_popup_dismiss", {
    resource_id: data.resource_id,
    page_path: data.page_path,
    offer_trigger: data.offer_trigger,
  });
}

export function trackResourceFormStart(data: {
  resource_id: string;
  page_path: string;
  source_type: string;
  resource_position: ResourcePosition;
}) {
  sendAnalyticsEvent("resource_form_start", {
    resource_id: data.resource_id,
    page_path: data.page_path,
    source_type: data.source_type,
    resource_position: data.resource_position,
  });
}

export function trackResourceClaimed(data: {
  resource_id: string;
  page_path: string;
  source_type: string;
  offer_trigger?: OfferTrigger;
  resource_position: ResourcePosition;
}) {
  sendAnalyticsEvent("resource_claimed", {
    resource_id: data.resource_id,
    page_path: data.page_path,
    source_type: data.source_type,
    offer_trigger: data.offer_trigger,
    resource_position: data.resource_position,
  });
}

export function trackResourceDownload(data: {
  resource_id: string;
  page_path: string;
}) {
  sendAnalyticsEvent("resource_download", {
    resource_id: data.resource_id,
    page_path: data.page_path,
  });
}

export function trackBlogResourceClick(data: {
  resource_id: string;
  article_slug: string;
  link_type: "inline" | "footer";
}) {
  sendAnalyticsEvent("blog_resource_click", {
    resource_id: data.resource_id,
    article_slug: data.article_slug,
    link_type: data.link_type,
  });
}

export function trackResourceProductClick(data: {
  resource_id: string;
  product_path: string;
  source_page: string;
}) {
  sendAnalyticsEvent("resource_product_click", {
    resource_id: data.resource_id,
    product_path: data.product_path,
    source_page: data.source_page,
  });
}
