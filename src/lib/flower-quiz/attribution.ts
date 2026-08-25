export interface QuizAttribution {
  source: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referrer: string;
}

/**
 * Capture UTM parameters and referrer from the current URL.
 * Call once on quiz load and persist throughout the session.
 */
export function captureAttribution(): QuizAttribution {
  const params = new URLSearchParams(window.location.search);

  return {
    source: params.get("source"),
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmContent: params.get("utm_content"),
    utmTerm: params.get("utm_term"),
    referrer: document.referrer || "",
  };
}
