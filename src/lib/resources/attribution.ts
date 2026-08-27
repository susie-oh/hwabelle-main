export interface AttributionData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
}

export function getAttribution(): AttributionData {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const attribution: AttributionData = {};

  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");
  const utmContent = params.get("utm_content");
  const utmTerm = params.get("utm_term");

  if (utmSource) attribution.utm_source = utmSource;
  if (utmMedium) attribution.utm_medium = utmMedium;
  if (utmCampaign) attribution.utm_campaign = utmCampaign;
  if (utmContent) attribution.utm_content = utmContent;
  if (utmTerm) attribution.utm_term = utmTerm;

  if (document.referrer && document.referrer.length > 0) {
    attribution.referrer = document.referrer.slice(0, 500);
  }

  return attribution;
}
