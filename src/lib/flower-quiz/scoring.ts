import { QUIZ_QUESTIONS, type QuizAnswer } from "@/data/flowerQuizQuestions";
import { VALID_FLOWER_SLUGS } from "@/data/flowerQuizProfiles";

export type AnswerMap = Record<string, string>;

/**
 * Calculate the flower quiz result from a map of questionId → answerId.
 * Returns the slug of the winning flower archetype.
 *
 * Scoring rules:
 * 1. Sum all weighted scores from selected answers.
 * 2. The flower with the highest total wins.
 * 3. Ties are broken alphabetically by slug (deterministic).
 */
export function calculateFlowerResult(answers: AnswerMap): string {
  const scores: Record<string, number> = {};

  // Initialize all flower scores to zero
  for (const slug of VALID_FLOWER_SLUGS) {
    scores[slug] = 0;
  }

  // Sum scores from each answer
  for (const question of QUIZ_QUESTIONS) {
    const selectedAnswerId = answers[question.id];
    if (!selectedAnswerId) continue;

    const selectedAnswer: QuizAnswer | undefined = question.answers.find(
      (a) => a.id === selectedAnswerId
    );
    if (!selectedAnswer) continue;

    for (const [flowerSlug, points] of Object.entries(selectedAnswer.scores)) {
      if (scores[flowerSlug] !== undefined) {
        scores[flowerSlug] += points;
      }
    }
  }

  // Find the winner (highest score, alphabetical tie-break)
  let winner = VALID_FLOWER_SLUGS[0];
  let highestScore = scores[winner] ?? 0;

  for (const slug of VALID_FLOWER_SLUGS) {
    const score = scores[slug] ?? 0;
    if (score > highestScore || (score === highestScore && slug < winner)) {
      winner = slug;
      highestScore = score;
    }
  }

  return winner;
}

/**
 * Get the complete score breakdown for debugging or display.
 */
export function calculateAllScores(
  answers: AnswerMap
): Record<string, number> {
  const scores: Record<string, number> = {};

  for (const slug of VALID_FLOWER_SLUGS) {
    scores[slug] = 0;
  }

  for (const question of QUIZ_QUESTIONS) {
    const selectedAnswerId = answers[question.id];
    if (!selectedAnswerId) continue;

    const selectedAnswer = question.answers.find(
      (a) => a.id === selectedAnswerId
    );
    if (!selectedAnswer) continue;

    for (const [flowerSlug, points] of Object.entries(selectedAnswer.scores)) {
      if (scores[flowerSlug] !== undefined) {
        scores[flowerSlug] += points;
      }
    }
  }

  return scores;
}
