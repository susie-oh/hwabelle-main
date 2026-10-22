/**
 * Welcome Discount Code Utility
 * Generates and validates unique, per-user 10% welcome discount codes.
 * Conforms to Hwabelle Welcome Offer Specification (stream.pptx).
 */

const USER_CODE_STORAGE_KEY = "hwabelle_user_welcome_code";
const POPUP_CLAIMED_KEY = "hwabelle_welcome_offer_claimed";
const POPUP_DISMISS_KEY = "hwabelle_welcome_offer_dismissed_until";

// Ambiguity-free uppercase alphanumeric characters (no 0/O, 1/I/L)
const CODE_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/**
 * Generates a fresh unique welcome discount code, e.g. "WELCOME-7K9PX"
 */
export function generateUniqueWelcomeCode(): string {
  let token = "";
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * CODE_CHARS.length);
    token += CODE_CHARS[randomIndex];
  }
  return `WELCOME-${token}`;
}

/**
 * Retrieves the persistent unique welcome discount code for this user/browser session,
 * or generates and saves a new one if none exists yet.
 */
export function getOrCreateUserWelcomeCode(): string {
  try {
    const existing = localStorage.getItem(USER_CODE_STORAGE_KEY);
    if (existing && isValidWelcomeDiscountCode(existing)) {
      return existing.trim().toUpperCase();
    }
    const freshCode = generateUniqueWelcomeCode();
    localStorage.setItem(USER_CODE_STORAGE_KEY, freshCode);
    return freshCode;
  } catch {
    // If localStorage is disabled/blocked, generate on the fly
    return generateUniqueWelcomeCode();
  }
}

/**
 * Static baseline codes that remain valid for promotions and backwards compatibility
 */
export const STATIC_VALID_DISCOUNTS: Record<string, number> = {
  WELCOME10: 10,
  BLOOM10: 10,
  HWABELLE10: 10,
};

/**
 * Validates whether a coupon code is a valid welcome discount code.
 * Accepts:
 * 1. Known static codes (WELCOME10, BLOOM10, HWABELLE10)
 * 2. Any dynamically issued unique code in the format WELCOME-XXXXX or HW10-XXXXX
 * 3. The current user's generated unique code stored in localStorage
 */
export function isValidWelcomeDiscountCode(code: string): boolean {
  if (!code) return false;
  const normalized = code.trim().toUpperCase();

  // 1. Static discount check
  if (STATIC_VALID_DISCOUNTS[normalized]) {
    return true;
  }

  // 2. Current user's assigned unique code
  try {
    const storedUserCode = localStorage.getItem(USER_CODE_STORAGE_KEY);
    if (storedUserCode && normalized === storedUserCode.trim().toUpperCase()) {
      return true;
    }
  } catch {
    // ignore storage error
  }

  // 3. Unique welcome code pattern match: WELCOME-XXXXX or WELCOMEXXXXX (4-8 chars)
  // Allows hyphen or contiguous, e.g. WELCOME-7K9PX, WELCOME-A3B9, HW10-7K9PX
  const welcomePattern = /^(WELCOME|HW10)(-?[2-9A-HJ-NP-Z0-9]{4,8})$/i;
  return welcomePattern.test(normalized);
}

/**
 * Returns discount percentage for a given code (10 for valid welcome codes, 0 otherwise)
 */
export function getWelcomeDiscountPercent(code: string): number {
  if (!code) return 0;
  const normalized = code.trim().toUpperCase();

  if (STATIC_VALID_DISCOUNTS[normalized]) {
    return STATIC_VALID_DISCOUNTS[normalized];
  }

  if (isValidWelcomeDiscountCode(normalized)) {
    return 10;
  }

  return 0;
}

export {
  USER_CODE_STORAGE_KEY,
  POPUP_CLAIMED_KEY,
  POPUP_DISMISS_KEY,
};
