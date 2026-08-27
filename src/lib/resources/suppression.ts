const DISMISSAL_KEY = "hwabelle_resource_offer_dismissed_until";
const CLAIMED_PREFIX = "hwabelle_resource_claimed_";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const EXCLUDED_PATH_PREFIXES = [
  "/cart",
  "/checkout",
  "/order-confirmation",
  "/free-flower-pressing-guide",
];

export function isPathExcludedFromOffer(pathname: string): boolean {
  return EXCLUDED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isResourceClaimed(resourceId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(`${CLAIMED_PREFIX}${resourceId}`) === "true";
  } catch {
    return false;
  }
}

export function setResourceClaimed(resourceId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${CLAIMED_PREFIX}${resourceId}`, "true");
  } catch {
    // LocalStorage unavailable
  }
}

export function isOfferDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const rawUntil = localStorage.getItem(DISMISSAL_KEY);
    if (!rawUntil) return false;
    const dismissedUntil = parseInt(rawUntil, 10);
    if (isNaN(dismissedUntil)) return false;
    return Date.now() < dismissedUntil;
  } catch {
    return false;
  }
}

export function setOfferDismissed(): void {
  if (typeof window === "undefined") return;
  try {
    const expireAt = Date.now() + SEVEN_DAYS_MS;
    localStorage.setItem(DISMISSAL_KEY, expireAt.toString());
  } catch {
    // LocalStorage unavailable
  }
}
