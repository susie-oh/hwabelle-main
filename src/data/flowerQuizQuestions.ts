export interface QuizAnswer {
  id: string;
  text: string;
  scores: Partial<Record<string, number>>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: [QuizAnswer, QuizAnswer, QuizAnswer, QuizAnswer];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "How would you spend a free afternoon with nothing planned?",
    answers: [
      {
        id: "q1a",
        text: "Curling up with a book or journaling somewhere quiet",
        scores: { lavender: 3, violet: 2, rose: 1 },
      },
      {
        id: "q1b",
        text: "Exploring a new neighborhood, market, or trail",
        scores: { cosmos: 3, sunflower: 2, daisy: 1 },
      },
      {
        id: "q1c",
        text: "Inviting friends over for a long lunch or coffee",
        scores: { hydrangea: 3, rose: 2, sunflower: 1 },
      },
      {
        id: "q1d",
        text: "Working on a thoughtful, intimate creative project",
        scores: { violet: 3, peony: 2, lavender: 1 },
      },
    ],
  },
  {
    id: "q2",
    question: "How would your closest friends describe you?",
    answers: [
      {
        id: "q2a",
        text: "Warm, devoted, and dependable — I'm the one they always call",
        scores: { rose: 3, hydrangea: 2, daisy: 1 },
      },
      {
        id: "q2b",
        text: "Creative, spontaneous, and a little unpredictable in the best way",
        scores: { cosmos: 3, peony: 2, sunflower: 1 },
      },
      {
        id: "q2c",
        text: "Thoughtful, observant, and deeply empathetic",
        scores: { violet: 3, lavender: 2, rose: 1 },
      },
      {
        id: "q2d",
        text: "Upbeat, generous, and full of radiant energy",
        scores: { sunflower: 3, daisy: 2, hydrangea: 1 },
      },
    ],
  },
  {
    id: "q3",
    question: "Which environment makes you feel most alive?",
    answers: [
      {
        id: "q3a",
        text: "A cozy, softly lit sanctuary with soothing herbal aromas",
        scores: { lavender: 3, violet: 2, rose: 1 },
      },
      {
        id: "q3b",
        text: "An open meadow, wildflower field, or sunny park bench",
        scores: { daisy: 3, cosmos: 2, sunflower: 1 },
      },
      {
        id: "q3c",
        text: "A beautifully curated space filled with lush art, textures, and blooms",
        scores: { peony: 3, hydrangea: 2, rose: 1 },
      },
      {
        id: "q3d",
        text: "A lively outdoor gathering with golden sunshine and music",
        scores: { sunflower: 3, hydrangea: 2, daisy: 1 },
      },
    ],
  },
  {
    id: "q4",
    question: "What do you value most in your relationships?",
    answers: [
      {
        id: "q4a",
        text: "Loyalty, emotional depth, and enduring romantic devotion",
        scores: { rose: 3, violet: 2, lavender: 1 },
      },
      {
        id: "q4b",
        text: "Shared adventures, boundless optimism, and lifting each other up",
        scores: { sunflower: 3, cosmos: 2, daisy: 1 },
      },
      {
        id: "q4c",
        text: "Mutual support, shared community, and generous hospitality",
        scores: { hydrangea: 3, peony: 2, rose: 1 },
      },
      {
        id: "q4d",
        text: "Simple honesty, playful joy, and freedom to just be ourselves",
        scores: { daisy: 3, lavender: 2, cosmos: 1 },
      },
    ],
  },
  {
    id: "q5",
    question: "When you create something, what matters most to you?",
    answers: [
      {
        id: "q5a",
        text: "That it feels luxurious, elegant, and breathtakingly composed",
        scores: { peony: 3, rose: 2, hydrangea: 1 },
      },
      {
        id: "q5b",
        text: "That it breaks convention and captures a free-spirited vision",
        scores: { cosmos: 3, violet: 2, lavender: 1 },
      },
      {
        id: "q5c",
        text: "That it is cheerful, unpretentious, and brings effortless smile",
        scores: { daisy: 3, lavender: 2, sunflower: 1 },
      },
      {
        id: "q5d",
        text: "That it holds quiet emotional depth and personal, intimate meaning",
        scores: { violet: 3, rose: 2, lavender: 1 },
      },
    ],
  },
  {
    id: "q6",
    question: "How do you typically respond to unexpected change?",
    answers: [
      {
        id: "q6a",
        text: "I pause, breathe deeply, and find my inner calm and perspective",
        scores: { lavender: 3, violet: 2, daisy: 1 },
      },
      {
        id: "q6b",
        text: "I embrace resilience with grace and care for those around me",
        scores: { rose: 3, hydrangea: 2, peony: 1 },
      },
      {
        id: "q6c",
        text: "I gather people together and find collective strength in community",
        scores: { hydrangea: 3, peony: 2, sunflower: 1 },
      },
      {
        id: "q6d",
        text: "I go with the gentle flow — optimistic that sunny days lie ahead",
        scores: { daisy: 3, sunflower: 2, cosmos: 1 },
      },
    ],
  },
  {
    id: "q7",
    question: "Which aesthetic feels most true to your spirit?",
    answers: [
      {
        id: "q7a",
        text: "Poetic, contemplative, and subtly mysterious with deep tones",
        scores: { violet: 3, lavender: 2, peony: 1 },
      },
      {
        id: "q7b",
        text: "Opulent, romantic, and richly layered with timeless drama",
        scores: { peony: 3, rose: 2, hydrangea: 1 },
      },
      {
        id: "q7c",
        text: "Bright, radiant, and full of golden warmth and exuberance",
        scores: { sunflower: 3, cosmos: 2, daisy: 1 },
      },
      {
        id: "q7d",
        text: "Classic, graceful, and emotionally enduring with delicate beauty",
        scores: { rose: 3, hydrangea: 2, lavender: 1 },
      },
    ],
  },
];
