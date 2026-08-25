import { VALID_FLOWER_SLUGS } from "@/data/flowerQuizProfiles";
import { QUIZ_QUESTIONS } from "@/data/flowerQuizQuestions";

/**
 * Validate an email address (basic format check).
 */
export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length === 0 || trimmed.length > 320) return false;
  // Basic RFC-compatible pattern
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/**
 * Normalize an email for storage.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Check if a flower slug is valid.
 */
export function isValidFlowerSlug(slug: string): boolean {
  return VALID_FLOWER_SLUGS.includes(slug);
}

/**
 * Validate quiz answers object.
 * Returns true if all 7 questions have valid answer IDs.
 */
export function isValidAnswerSet(
  answers: Record<string, string>
): boolean {
  for (const question of QUIZ_QUESTIONS) {
    const selectedId = answers[question.id];
    if (!selectedId) return false;
    const validAnswer = question.answers.find((a) => a.id === selectedId);
    if (!validAnswer) return false;
  }
  return true;
}

/**
 * Validate a complete quiz submission payload.
 */
export function validateSubmission(data: {
  firstName?: string;
  email?: string;
  flowerResult?: string;
  answers?: Record<string, string>;
  marketingConsent?: boolean;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.flowerResult || !isValidFlowerSlug(data.flowerResult)) {
    errors.push("Invalid flower result.");
  }

  if (!data.answers || !isValidAnswerSet(data.answers)) {
    errors.push("Incomplete or invalid quiz answers.");
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push("Invalid email address.");
  }

  if (data.firstName && data.firstName.trim().length > 100) {
    errors.push("First name is too long.");
  }

  if (
    data.marketingConsent !== undefined &&
    typeof data.marketingConsent !== "boolean"
  ) {
    errors.push("Marketing consent must be a boolean.");
  }

  return { valid: errors.length === 0, errors };
}
