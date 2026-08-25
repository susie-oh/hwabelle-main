import { describe, it, expect } from "vitest";
import {
  calculateFlowerResult,
  calculateAllScores,
} from "../scoring";
import {
  isValidEmail,
  isValidFlowerSlug,
  isValidAnswerSet,
  validateSubmission,
  normalizeEmail,
} from "../validation";
import { QUIZ_QUESTIONS } from "@/data/flowerQuizQuestions";
import { VALID_FLOWER_SLUGS } from "@/data/flowerQuizProfiles";

// Helper: create an answer map that maximizes a specific flower's score
function createAnswersForFlower(targetFlower: string): Record<string, string> {
  const answers: Record<string, string> = {};

  for (const question of QUIZ_QUESTIONS) {
    // Find the answer that gives the most points to the target flower
    let bestAnswer = question.answers[0];
    let bestScore = 0;

    for (const answer of question.answers) {
      const score = answer.scores[targetFlower] || 0;
      if (score > bestScore) {
        bestScore = score;
        bestAnswer = answer;
      }
    }

    answers[question.id] = bestAnswer.id;
  }

  return answers;
}

describe("Scoring Engine", () => {
  it("produces a valid flower slug", () => {
    const answers: Record<string, string> = {};
    for (const q of QUIZ_QUESTIONS) {
      answers[q.id] = q.answers[0].id;
    }
    const result = calculateFlowerResult(answers);
    expect(VALID_FLOWER_SLUGS).toContain(result);
  });

  it("is deterministic — same answers produce same result", () => {
    const answers: Record<string, string> = {};
    for (const q of QUIZ_QUESTIONS) {
      answers[q.id] = q.answers[1].id;
    }
    const result1 = calculateFlowerResult(answers);
    const result2 = calculateFlowerResult(answers);
    const result3 = calculateFlowerResult(answers);
    expect(result1).toBe(result2);
    expect(result2).toBe(result3);
  });

  it("every flower can be the result with optimized answers", () => {
    const reachable = new Set<string>();

    for (const flower of VALID_FLOWER_SLUGS) {
      const answers = createAnswersForFlower(flower);
      const result = calculateFlowerResult(answers);
      reachable.add(result);
    }

    // Every flower should be reachable
    for (const flower of VALID_FLOWER_SLUGS) {
      expect(reachable.has(flower)).toBe(true);
    }
  });

  it("ties are broken alphabetically", () => {
    // Create answers that give equal scores to multiple flowers
    // When all answers are the first option, check the tie-break
    const answers: Record<string, string> = {};
    for (const q of QUIZ_QUESTIONS) {
      answers[q.id] = q.answers[0].id;
    }
    const scores = calculateAllScores(answers);
    const result = calculateFlowerResult(answers);

    // If there's a tie, the alphabetically first flower should win
    const maxScore = Math.max(...Object.values(scores));
    const tiedFlowers = VALID_FLOWER_SLUGS.filter(
      (f) => scores[f] === maxScore
    );

    if (tiedFlowers.length > 1) {
      const alphabeticalFirst = tiedFlowers.sort()[0];
      expect(result).toBe(alphabeticalFirst);
    } else {
      expect(result).toBe(tiedFlowers[0]);
    }
  });

  it("handles empty answers gracefully", () => {
    const result = calculateFlowerResult({});
    // With zero scores, should return alphabetically first flower
    expect(VALID_FLOWER_SLUGS).toContain(result);
  });

  it("handles partial answers", () => {
    const answers: Record<string, string> = {
      [QUIZ_QUESTIONS[0].id]: QUIZ_QUESTIONS[0].answers[0].id,
    };
    const result = calculateFlowerResult(answers);
    expect(VALID_FLOWER_SLUGS).toContain(result);
  });

  it("calculateAllScores returns scores for all flowers", () => {
    const answers: Record<string, string> = {};
    for (const q of QUIZ_QUESTIONS) {
      answers[q.id] = q.answers[0].id;
    }
    const scores = calculateAllScores(answers);

    for (const flower of VALID_FLOWER_SLUGS) {
      expect(typeof scores[flower]).toBe("number");
      expect(scores[flower]).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("Validation", () => {
  describe("isValidEmail", () => {
    it("accepts valid emails", () => {
      expect(isValidEmail("user@example.com")).toBe(true);
      expect(isValidEmail("first.last@domain.co.uk")).toBe(true);
      expect(isValidEmail("user+tag@example.com")).toBe(true);
    });

    it("rejects invalid emails", () => {
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("notanemail")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("user@")).toBe(false);
      expect(isValidEmail("user @domain.com")).toBe(false);
    });

    it("rejects overly long emails", () => {
      const longEmail = "a".repeat(310) + "@example.com";
      expect(isValidEmail(longEmail)).toBe(false);
    });
  });

  describe("normalizeEmail", () => {
    it("trims and lowercases", () => {
      expect(normalizeEmail("  User@Example.COM  ")).toBe("user@example.com");
    });
  });

  describe("isValidFlowerSlug", () => {
    it("accepts valid slugs", () => {
      for (const slug of VALID_FLOWER_SLUGS) {
        expect(isValidFlowerSlug(slug)).toBe(true);
      }
    });

    it("rejects invalid slugs", () => {
      expect(isValidFlowerSlug("tulip")).toBe(false);
      expect(isValidFlowerSlug("")).toBe(false);
      expect(isValidFlowerSlug("ROSE")).toBe(false);
    });
  });

  describe("isValidAnswerSet", () => {
    it("accepts complete valid answers", () => {
      const answers: Record<string, string> = {};
      for (const q of QUIZ_QUESTIONS) {
        answers[q.id] = q.answers[0].id;
      }
      expect(isValidAnswerSet(answers)).toBe(true);
    });

    it("rejects incomplete answers", () => {
      expect(isValidAnswerSet({})).toBe(false);
      expect(
        isValidAnswerSet({
          [QUIZ_QUESTIONS[0].id]: QUIZ_QUESTIONS[0].answers[0].id,
        })
      ).toBe(false);
    });

    it("rejects invalid answer IDs", () => {
      const answers: Record<string, string> = {};
      for (const q of QUIZ_QUESTIONS) {
        answers[q.id] = "invalid-answer-id";
      }
      expect(isValidAnswerSet(answers)).toBe(false);
    });
  });

  describe("validateSubmission", () => {
    const validSubmission = () => {
      const answers: Record<string, string> = {};
      for (const q of QUIZ_QUESTIONS) {
        answers[q.id] = q.answers[0].id;
      }
      return {
        firstName: "Jane",
        email: "jane@example.com",
        flowerResult: "lavender",
        answers,
        marketingConsent: false,
      };
    };

    it("accepts a valid submission", () => {
      const result = validateSubmission(validSubmission());
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("rejects invalid flower result", () => {
      const result = validateSubmission({
        ...validSubmission(),
        flowerResult: "tulip",
      });
      expect(result.valid).toBe(false);
    });

    it("rejects missing flower result", () => {
      const result = validateSubmission({
        ...validSubmission(),
        flowerResult: undefined,
      });
      expect(result.valid).toBe(false);
    });

    it("rejects invalid email", () => {
      const result = validateSubmission({
        ...validSubmission(),
        email: "notanemail",
      });
      expect(result.valid).toBe(false);
    });

    it("accepts submission without email", () => {
      const result = validateSubmission({
        ...validSubmission(),
        email: undefined,
      });
      expect(result.valid).toBe(true);
    });

    it("marketing consent defaults to false concept", () => {
      const sub = validSubmission();
      expect(sub.marketingConsent).toBe(false);
    });

    it("rejects overly long first name", () => {
      const result = validateSubmission({
        ...validSubmission(),
        firstName: "a".repeat(101),
      });
      expect(result.valid).toBe(false);
    });
  });
});
