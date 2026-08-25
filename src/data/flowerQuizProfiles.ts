export interface FlowerProfile {
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  personalitySummary: string;
  traits: string[];
  symbolism: string;
  pressingSuitability: "Easy" | "Moderate" | "Advanced";
  pressingTips: string[];
  projectIdea: {
    title: string;
    description: string;
  };
  aiDesignerPrompt: string;
}

export const FLOWER_PROFILES: Record<string, FlowerProfile> = {
  rose: {
    slug: "rose",
    name: "Rose",
    tagline: "Classic beauty with quiet depth.",
    shortDescription:
      "You carry yourself with a timeless warmth that draws people in. Like a rose, you balance softness with strength and bring beauty to the spaces you inhabit.",
    personalitySummary:
      "You value deep connections and meaningful gestures. People often come to you for advice because you listen with genuine care and respond with thoughtfulness. You're drawn to traditions that feel personal rather than performative, and you find beauty in the details others overlook. Whether you're hosting a gathering or writing a heartfelt note, you bring an effortless elegance to everything you touch.",
    traits: ["Romantic", "Loyal", "Elegant", "Nurturing", "Resilient"],
    symbolism:
      "Roses have symbolized love and devotion across cultures for thousands of years. Beyond romance, they represent gratitude, remembrance, and the quiet courage it takes to be vulnerable. Each color carries its own language — but all roses share a common thread of deep emotional significance.",
    pressingSuitability: "Moderate",
    pressingTips: [
      "Individual petals press more evenly than whole blooms",
      "Remove thick sepals and stems before pressing",
      "Press roses when they are just beginning to open for the best shape",
      "Layer petals between extra absorbent sheets to manage moisture",
    ],
    projectIdea: {
      title: "Rose Petal Love Letter",
      description:
        "Create a shadow-box display combining pressed rose petals arranged in a cascading pattern alongside a handwritten letter, wedding vow excerpt, or meaningful quote. Frame it in a deep box frame for a dimensional keepsake.",
    },
    aiDesignerPrompt:
      "Help me plan a pressed rose petal project. I want to create a romantic keepsake using dried rose petals — possibly a love letter display, wedding vow frame, or anniversary gift. Suggest layout ideas, petal arrangements, and complementary pressed greenery.",
  },

  lavender: {
    slug: "lavender",
    name: "Lavender",
    tagline: "Calm presence, creative spirit.",
    shortDescription:
      "You bring a grounding calm to every room you enter. Like lavender, you soothe without trying and inspire creativity through quiet intention.",
    personalitySummary:
      "You're the person people seek out when they need to feel settled. Your creative energy flows best in unhurried environments where you can think deeply and work at your own pace. You prefer substance over spectacle, and your ideas often reveal themselves slowly — but when they arrive, they're fully formed and beautiful. You find restoration in nature, simple rituals, and the satisfaction of making something with your hands.",
    traits: ["Calm", "Thoughtful", "Grounded", "Creative", "Intuitive"],
    symbolism:
      "Lavender represents serenity, devotion, and spiritual clarity. Historically used in healing and purification rituals, it symbolizes the power of gentleness — the idea that the most lasting impact often comes from the quietest presence.",
    pressingSuitability: "Easy",
    pressingTips: [
      "Lavender stems press beautifully when laid flat",
      "Harvest when buds are just beginning to open",
      "Press whole sprigs for the most natural appearance",
      "Lavender retains its scent well after pressing",
    ],
    projectIdea: {
      title: "Lavender Memory Frame",
      description:
        "Create a minimalist double-glass botanical frame combining pressed lavender stems with handwritten vows, a meaningful date, or a short personal message. The transparency of the glass lets light pass through the pressed flowers.",
    },
    aiDesignerPrompt:
      "Help me plan a pressed lavender project. I want to create a calm, minimalist botanical display using pressed lavender stems — possibly a floating frame, journal cover, or meditation space accent. Suggest arrangements and complementary elements.",
  },

  sunflower: {
    slug: "sunflower",
    name: "Sunflower",
    tagline: "Bold warmth that lifts everyone around you.",
    shortDescription:
      "You radiate positivity and show up fully wherever you go. Like a sunflower, you turn toward the light and help others find it too.",
    personalitySummary:
      "Your energy is contagious in the best way. You're the friend who organizes the trip, starts the conversation, and makes everyone feel included. You approach challenges with optimism rather than anxiety, and your enthusiasm is genuine — never forced. You believe in celebrating wins loudly, supporting people generously, and building things that bring joy. Creativity for you is expansive, colorful, and unapologetically bold.",
    traits: ["Optimistic", "Generous", "Confident", "Warm", "Adventurous"],
    symbolism:
      "Sunflowers symbolize adoration, loyalty, and vitality. Their heliotropic nature — turning to follow the sun — represents devotion and unwavering focus. They are associated with harvest abundance and the kind of warmth that sustains communities.",
    pressingSuitability: "Advanced",
    pressingTips: [
      "Press individual petals rather than the thick center disk",
      "Sunflower petals press flat and retain vivid color",
      "Use smaller varieties for easier whole-flower pressing",
      "Remove seeds and trim the thick center before pressing petals",
    ],
    projectIdea: {
      title: "Sunflower Burst Wall Art",
      description:
        "Arrange pressed sunflower petals in a radial burst pattern on a large art board, creating a sun-like display. Add pressed greenery at the base and a hand-lettered favorite quote or family motto in the center.",
    },
    aiDesignerPrompt:
      "Help me plan a pressed sunflower petal project. I want to create bold, cheerful wall art or a vibrant display using pressed sunflower petals — possibly arranged in a radial pattern. Suggest layout ideas, complementary flowers, and framing approaches.",
  },

  daisy: {
    slug: "daisy",
    name: "Daisy",
    tagline: "Effortless joy, honest heart.",
    shortDescription:
      "You move through life with a lightness that feels genuine and refreshing. Like a daisy, you're unpretentious, cheerful, and deeply sincere.",
    personalitySummary:
      "You don't need grand gestures to make an impression — your authenticity does the work for you. You value honesty over politeness, simplicity over complexity, and experiences over possessions. People are drawn to your sincerity because it feels rare and real. You're happiest outdoors, in good company, or working on something creative with your hands. For you, the best things in life are usually the simplest.",
    traits: ["Cheerful", "Sincere", "Playful", "Independent", "Grounded"],
    symbolism:
      "Daisies represent innocence, new beginnings, and purity of intention. In many traditions, they symbolize loyal love and the ability to keep a secret. The daisy's daily cycle of opening and closing with the sun connects it to renewal and fresh starts.",
    pressingSuitability: "Easy",
    pressingTips: [
      "Daisies press beautifully as whole flowers",
      "Press when fully open for the best flat result",
      "White petals may yellow slightly — use fresh, crisp blooms",
      "Small daisies are ideal for decorative details and borders",
    ],
    projectIdea: {
      title: "Daisy Chain Bookmark Collection",
      description:
        "Create a set of laminated bookmarks using pressed daisies arranged in a chain pattern along the length of each bookmark. Add a small tassel or ribbon and gift them as a set.",
    },
    aiDesignerPrompt:
      "Help me plan a pressed daisy project. I want to create cheerful, simple botanical crafts using pressed daisies — possibly bookmarks, greeting cards, or a nature journal cover. Suggest arrangements, layouts, and how to use daisies in a collection.",
  },

  cosmos: {
    slug: "cosmos",
    name: "Cosmos",
    tagline: "Free-spirited and endlessly curious.",
    shortDescription:
      "You see the world as one big creative experiment. Like cosmos flowers, you thrive in open spaces and bring effortless beauty wherever you land.",
    personalitySummary:
      "You're drawn to the unconventional and find inspiration in places others don't think to look. Routine bores you — you'd rather improvise, explore, and discover. You have a natural talent for making things look beautiful without overthinking them, and your creative instincts are remarkably good. You value freedom, spontaneity, and the kind of deep conversations that happen at 2 AM. Your energy is magnetic precisely because you never try to be anything other than yourself.",
    traits: ["Creative", "Spontaneous", "Curious", "Artistic", "Free-spirited"],
    symbolism:
      "Cosmos flowers represent order within beauty and the harmony of the natural world. Their name comes from the Greek word for ordered universe, and they symbolize balance, peace, and the idea that beauty often emerges from apparent wildness.",
    pressingSuitability: "Easy",
    pressingTips: [
      "Cosmos press easily and retain their delicate shape",
      "Press when flowers are fully open and dry",
      "Their thin petals dry quickly between sheets",
      "Colors hold well — especially pinks, purples, and whites",
    ],
    projectIdea: {
      title: "Cosmos Constellation Art",
      description:
        "Press a collection of cosmos flowers in varying sizes and colors, then arrange them on dark paper or fabric to mimic a starfield or constellation pattern. Label each flower-star with a meaningful word, date, or inside joke.",
    },
    aiDesignerPrompt:
      "Help me plan a pressed cosmos flower project. I want to create artistic, whimsical botanical art using pressed cosmos — possibly on dark backgrounds, in mixed-media collages, or as constellation-inspired art. Suggest creative arrangements and color combinations.",
  },

  violet: {
    slug: "violet",
    name: "Violet",
    tagline: "Quiet strength, deep feeling.",
    shortDescription:
      "You notice what others miss and feel things profoundly. Like a violet, you bloom beautifully in the spaces between the obvious.",
    personalitySummary:
      "You're an observer and a thinker — someone who processes the world deeply before responding to it. Your empathy runs deep, and you often understand people better than they understand themselves. You're drawn to poetry, meaningful art, and the kind of beauty that requires patience to appreciate. You don't need to be the loudest person in the room because your presence speaks for itself. The people closest to you know that your quiet exterior shelters one of the richest inner worlds they've encountered.",
    traits: ["Empathetic", "Perceptive", "Poetic", "Contemplative", "Loyal"],
    symbolism:
      "Violets symbolize faithfulness, modesty, and spiritual wisdom. In ancient Greece, they were associated with love and fertility. In Victorian flower language, giving someone violets meant 'I'll always be true.' They represent the beauty found in humility and the depth hidden in small things.",
    pressingSuitability: "Easy",
    pressingTips: [
      "Violets press perfectly flat with minimal preparation",
      "Their small size makes them ideal for detailed designs",
      "Press with leaves attached for a natural look",
      "Colors darken slightly when dried — plan for deeper purple tones",
    ],
    projectIdea: {
      title: "Violet Poetry Journal",
      description:
        "Create a handmade journal cover by arranging pressed violets with their leaves around a favorite poem or literary quote. Seal the arrangement under a transparent cover for a functional art piece you carry with you.",
    },
    aiDesignerPrompt:
      "Help me plan a pressed violet project. I want to create something intimate and literary using pressed violets — possibly a journal cover, poetry card, or small framed piece with text. Suggest pairings with other small pressed flowers and layout ideas.",
  },

  hydrangea: {
    slug: "hydrangea",
    name: "Hydrangea",
    tagline: "Abundant heart, gathered strength.",
    shortDescription:
      "You believe that more is more — in love, generosity, and effort. Like a hydrangea, your impact comes from the fullness you bring.",
    personalitySummary:
      "You're a natural gatherer of people, ideas, and experiences. You create abundance wherever you go, whether that means cooking for ten when three would suffice or mentoring someone just because you can. You value community, collaboration, and shared experiences over individual achievement. Your aesthetic leans toward the lush and layered — you appreciate richness in texture, color, and meaning. You understand that the most beautiful things are often made of many small parts working together.",
    traits: ["Generous", "Community-minded", "Abundant", "Organized", "Graceful"],
    symbolism:
      "Hydrangeas symbolize gratitude, grace, and abundance. Their large, clustered blooms represent unity and togetherness — the idea that individual parts create something greater than the whole. In Japanese culture, they are associated with heartfelt emotion and apology.",
    pressingSuitability: "Easy",
    pressingTips: [
      "Press individual florets rather than whole bloom clusters",
      "Hydrangea florets dry flat and retain papery texture beautifully",
      "Pick when colors are vibrant but blooms feel slightly dry",
      "Mix colors from the same bush for natural gradient effects",
    ],
    projectIdea: {
      title: "Hydrangea Gradient Wall Piece",
      description:
        "Collect hydrangea florets across a color gradient — from pale green to deep blue or pink — and arrange them in rows that transition smoothly from one shade to the next. Mount on linen or watercolor paper for a gallery-worthy botanical piece.",
    },
    aiDesignerPrompt:
      "Help me plan a pressed hydrangea project. I want to create a lush, layered botanical display using pressed hydrangea florets — possibly a gradient arrangement, wreath shape, or full-coverage art piece. Suggest color transitions and mounting approaches.",
  },

  peony: {
    slug: "peony",
    name: "Peony",
    tagline: "Luxurious spirit, magnetic presence.",
    shortDescription:
      "You bring richness and beauty to everything you do. Like a peony, your presence is lush, memorable, and impossible to overlook.",
    personalitySummary:
      "You have an eye for beauty and a talent for creating atmosphere. Whether you're designing a room, planning an event, or choosing a gift, you instinctively elevate the ordinary into something special. You appreciate quality over quantity and invest deeply in the things and people you care about. You're confident without being showy, and your taste is impeccable because it reflects genuine passion rather than trend-following. People remember how you made them feel — and it's always memorable.",
    traits: ["Luxurious", "Magnetic", "Passionate", "Tasteful", "Ambitious"],
    symbolism:
      "Peonies symbolize prosperity, good fortune, and romance. In Chinese culture, they are known as the 'king of flowers' and represent wealth and honor. In Western tradition, they are associated with happy marriages, compassion, and the kind of beauty that takes your breath away.",
    pressingSuitability: "Advanced",
    pressingTips: [
      "Peonies are thick — press individual petals for best results",
      "Remove the dense center and press outer petals separately",
      "Layer extra absorbent sheets and change them after 24 hours",
      "Press petals from different bloom stages for color variety",
    ],
    projectIdea: {
      title: "Peony Petal Luxe Frame",
      description:
        "Layer pressed peony petals in overlapping arrangements within a large gold or brass frame, creating a dimensional petal mosaic. Add a sprig of pressed eucalyptus or fern for contrast. Display as a statement piece in a living room or entryway.",
    },
    aiDesignerPrompt:
      "Help me plan a pressed peony petal project. I want to create something luxurious and statement-worthy using pressed peony petals — possibly a layered petal frame, a botanical collage, or an elegant display. Suggest layout ideas, complementary elements, and framing options.",
  },
};

export const VALID_FLOWER_SLUGS = Object.keys(FLOWER_PROFILES) as string[];

export const getFlowerProfile = (slug: string): FlowerProfile | undefined =>
  FLOWER_PROFILES[slug];
