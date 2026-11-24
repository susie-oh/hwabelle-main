export interface BlogInlineVisual {
  src: string;
  alt: string;
  caption: string;
}

const STATIC_SLUG_VISUALS: Record<
  string,
  { cover: string; inline: string; caption: string }
> = {
  "how-to-press-flowers-for-beginners": {
    cover: "/blog-images/acrylic-press-flatlay.jpg",
    inline: "/blog-images/workbench-tweezers-action.jpg",
    caption: "Careful spacing and tweezers placement keep delicate petals flat before tightening the corner brass bolts.",
  },
  "best-flowers-for-pressing": {
    cover: "/blog-images/wild-meadow-herbarium.jpg",
    inline: "/blog-images/botanical-specimen-grid.jpg",
    caption: "Naturally flat single-layer blooms dry fastest, while dense multi-petal flowers benefit from petal-by-petal prep.",
  },
  "how-to-press-roses": {
    cover: "/blog-images/roses-and-eucalyptus.jpg",
    inline: "/blog-images/oak-frame-rose-art.jpg",
    caption: "Deconstructing thick garden roses petal-by-petal allows rapid moisture release and gallery-grade reconstruction.",
  },
  "why-do-pressed-flowers-turn-brown": {
    cover: "/blog-images/color-science-drying.jpg",
    inline: "/blog-images/pansies-and-cosmos.jpg",
    caption: "Rapid moisture evacuation with fresh absorbent blotting sheets prevents enzymatic browning and locks in natural pigment.",
  },
  "how-long-does-it-take-to-press-flowers": {
    cover: "/blog-images/workbench-tweezers-action.jpg",
    inline: "/blog-images/archival-flower-storage.jpg",
    caption: "Wait until petals pass the crisp parchment touch test before transferring specimens to frames or archival glassine.",
  },
  "acrylic-vs-wooden-flower-press": {
    cover: "/blog-images/acrylic-press-flatlay.jpg",
    inline: "/blog-images/oak-frame-rose-art.jpg",
    caption: "360-degree crystal-clear visibility lets you catch folded petals before clamping and monitor drying progress.",
  },
  "pressing-daisies-and-clover": {
    cover: "/blog-images/daisies-and-clover.jpg",
    inline: "/blog-images/wild-meadow-herbarium.jpg",
    caption: "Pressing daisies face-down on fresh blotting paper keeps white ray petals flat and golden center discs bright.",
  },
  "pressing-wild-violets-and-fern": {
    cover: "/blog-images/wild-violets-and-fern.jpg",
    inline: "/blog-images/mixed-media-journal.jpg",
    caption: "Woodland violets and delicate fern pinnae retain rich pigment when cushioned evenly between sponge and blotter layers.",
  },
  "pressing-tulips-and-small-wildflowers": {
    cover: "/blog-images/tulips-and-wildflowers.jpg",
    inline: "/blog-images/cherry-blossoms-spring.jpg",
    caption: "Halving fleshy spring tulip cups relieves trapped moisture while pairing effortlessly with airy meadow wildflowers.",
  },
  "pressing-pansies-and-cosmos": {
    cover: "/blog-images/pansies-and-cosmos.jpg",
    inline: "/blog-images/acrylic-press-flatlay.jpg",
    caption: "Velvety pansy faces and tissue-thin cosmos petals cure in days under balanced 4-corner acrylic clamping.",
  },
  "pressing-lavender-and-babys-breath": {
    cover: "/blog-images/lavender-and-babys-breath.jpg",
    inline: "/blog-images/archival-flower-storage.jpg",
    caption: "Trimming overlapping sprig stems ensures uniform contact across slender lavender spikes and airy baby's breath clusters.",
  },
  "pressing-calla-lilies-and-babys-breath": {
    cover: "/blog-images/calla-lilies-bridal.jpg",
    inline: "/blog-images/bridal-keepsake-frame.jpg",
    caption: "Shaving thick calla stems flat and swapping blotters at 48 hours preserves sculptural bridal silhouettes without yellowing.",
  },
  "pressing-roses-and-eucalyptus": {
    cover: "/blog-images/roses-and-eucalyptus.jpg",
    inline: "/blog-images/bridal-keepsake-frame.jpg",
    caption: "Pairing disassembled blush rose petals with flat silver-dollar eucalyptus creates timeless bridal keepsake layouts.",
  },
};

const TOPIC_POOLS: Array<{ re: RegExp; images: string[]; caption: string }> = [
  {
    re: /calla/i,
    images: ["/blog-images/calla-lilies-bridal.jpg", "/blog-images/bridal-keepsake-frame.jpg", "/blog-images/fresh-bridal-bouquet.jpg"],
    caption: "Careful stem preparation and early blotter swaps keep sculptural bridal blooms crisp and ivory-bright.",
  },
  {
    re: /wedding|bridal|special day/i,
    images: ["/blog-images/fresh-bridal-bouquet.jpg", "/blog-images/bridal-keepsake-frame.jpg", "/blog-images/oak-frame-rose-art.jpg", "/blog-images/roses-and-eucalyptus.jpg"],
    caption: "Preserving bouquet blooms within 24–48 hours of the celebration captures peak petal color for heirloom framing.",
  },
  {
    re: /pansy|pansies|cosmos/i,
    images: ["/blog-images/pansies-and-cosmos.jpg", "/blog-images/wild-meadow-herbarium.jpg", "/blog-images/botanical-specimen-grid.jpg"],
    caption: "Naturally flat single-layer petals press cleanly on acid-free blotting sheets with vivid pigment retention.",
  },
  {
    re: /daisy|daisies|clover|kid/i,
    images: ["/blog-images/daisies-and-clover.jpg", "/blog-images/mixed-media-journal.jpg", "/blog-images/wild-meadow-herbarium.jpg"],
    caption: "Small, flat meadow blooms and compact presses make botanical bookmark and nature journal projects effortless.",
  },
  {
    re: /violet|fern|woodland/i,
    images: ["/blog-images/wild-violets-and-fern.jpg", "/blog-images/wild-meadow-herbarium.jpg", "/blog-images/mixed-media-journal.jpg"],
    caption: "Delicate woodland fronds and violets press flat without bruising when layered between cushioned blotter boards.",
  },
  {
    re: /tulip/i,
    images: ["/blog-images/tulips-and-wildflowers.jpg", "/blog-images/cherry-blossoms-spring.jpg", "/blog-images/pansies-and-cosmos.jpg"],
    caption: "Halving or deconstructing cup-shaped spring bulbs prevents petal creasing and accelerates moisture wicking.",
  },
  {
    re: /lavender/i,
    images: ["/blog-images/lavender-and-babys-breath.jpg", "/blog-images/workbench-tweezers-action.jpg", "/blog-images/archival-flower-storage.jpg"],
    caption: "Pressing slender aromatic sprigs in a cool, dry room preserves both muted lilac tones and subtle botanical scent.",
  },
  {
    re: /cherry blossom|sakura/i,
    images: ["/blog-images/cherry-blossoms-spring.jpg", "/blog-images/tulips-and-wildflowers.jpg", "/blog-images/pansies-and-cosmos.jpg"],
    caption: "Same-day pressing on dry cellulose blotters protects fragile spring blossoms from browning at the petal edges.",
  },
  {
    re: /sunflower|large bloom/i,
    images: ["/blog-images/sunflowers-large-blooms.jpg", "/blog-images/wild-meadow-herbarium.jpg", "/blog-images/botanical-specimen-grid.jpg"],
    caption: "Separating ray petals from thick flower centers lets large summer blooms dry evenly and reconstruct cleanly.",
  },
  {
    re: /chrysanthemum|autumn|fall leaf|fall leaves/i,
    images: ["/blog-images/autumn-chrysanthemums-leaves.jpg", "/blog-images/sunflowers-large-blooms.jpg", "/blog-images/oak-frame-rose-art.jpg"],
    caption: "Warm autumn foliage and layered chrysanthemum petals bring rich seasonal texture to framed botanical compositions.",
  },
  {
    re: /beach|coastal|sea grass/i,
    images: ["/blog-images/coastal-beach-botanicals.jpg", "/blog-images/lavender-and-babys-breath.jpg", "/blog-images/minimalist-framed-sprig.jpg"],
    caption: "Gently blotting surface moisture before pressing keeps coastal grasses and seaside sprigs crisp and salt-free.",
  },
  {
    re: /evergreen|winter botanical/i,
    images: ["/blog-images/winter-evergreen-sprigs.jpg", "/blog-images/mindful-winter-pressing.jpg", "/blog-images/roses-and-eucalyptus.jpg"],
    caption: "Woody winter evergreens and eucalyptus leaves flatten cleanly under steady 4-corner brass bolt pressure.",
  },
  {
    re: /self-care|mindful|winter hobby|indoor|warm up winter|before winter/i,
    images: ["/blog-images/mindful-winter-pressing.jpg", "/blog-images/winter-evergreen-sprigs.jpg", "/blog-images/workbench-tweezers-action.jpg", "/blog-images/mixed-media-journal.jpg"],
    caption: "Slow, unhurried botanical arrangement offers a grounding creative ritual through the quieter winter months.",
  },
  {
    re: /holiday card|greeting card|festive/i,
    images: ["/blog-images/holiday-greeting-cards.jpg", "/blog-images/botanical-art-gifts.jpg", "/blog-images/winter-evergreen-sprigs.jpg"],
    caption: "Paper-thin pressed blooms adhered to deckle-edge cotton stationery create keepsake cards worth framing.",
  },
  {
    re: /phone case|resin|jewelry/i,
    images: ["/blog-images/resin-jewelry-phone-case.jpg", "/blog-images/pansies-and-cosmos.jpg", "/blog-images/botanical-art-gifts.jpg"],
    caption: "Always ensure botanicals are 100% parchment-dry before sealing in resin jewelry bezels or clear phone cases.",
  },
  {
    re: /mixed media|combine|combining/i,
    images: ["/blog-images/mixed-media-journal.jpg", "/blog-images/wild-meadow-herbarium.jpg", "/blog-images/workbench-tweezers-action.jpg"],
    caption: "Combining pressed botanicals with soft watercolor washes and linen paper adds natural depth to mixed-media layouts.",
  },
  {
    re: /sell|income|profit|business/i,
    images: ["/blog-images/artisan-botanical-studio.jpg", "/blog-images/oak-frame-rose-art.jpg", "/blog-images/bridal-keepsake-frame.jpg"],
    caption: "Archival acid-free backing, UV-protective glass, and thoughtful presentation elevate handmade botanical prints.",
  },
  {
    re: /gift/i,
    images: ["/blog-images/botanical-art-gifts.jpg", "/blog-images/holiday-greeting-cards.jpg", "/blog-images/oak-frame-rose-art.jpg"],
    caption: "Handcrafted botanical frames, silk-tassel bookmarks, and pressed-flower stationery turn garden blooms into lasting gifts.",
  },
  {
    re: /frame|framing/i,
    images: ["/blog-images/oak-frame-rose-art.jpg", "/blog-images/bridal-keepsake-frame.jpg", "/blog-images/minimalist-framed-sprig.jpg"],
    caption: "Double-glass floating frames and acid-free mat boards showcase delicate petal veining while blocking ambient humidity.",
  },
  {
    re: /store|storage|revive|dried.*bouquet|old arrangement/i,
    images: ["/blog-images/archival-flower-storage.jpg", "/blog-images/roses-and-eucalyptus.jpg", "/blog-images/lavender-and-babys-breath.jpg"],
    caption: "Sorting cured specimens into breathable glassine envelopes inside a dark, dry box preserves vibrancy between projects.",
  },
  {
    re: /color|fade|brown|mold|humid|science/i,
    images: ["/blog-images/color-science-drying.jpg", "/blog-images/pansies-and-cosmos.jpg", "/blog-images/acrylic-press-flatlay.jpg"],
    caption: "Fast moisture removal with absorbent blotter swaps and desiccant support protects delicate anthocyanin pigments.",
  },
  {
    re: /acrylic|microwave|paper|material|mistake|how long|timeline/i,
    images: ["/blog-images/acrylic-press-flatlay.jpg", "/blog-images/workbench-tweezers-action.jpg", "/blog-images/color-science-drying.jpg"],
    caption: "Clear scalloped acrylic plates and layered drying boards apply even pressure while letting you inspect alignment.",
  },
  {
    re: /rose/i,
    images: ["/blog-images/roses-and-eucalyptus.jpg", "/blog-images/oak-frame-rose-art.jpg", "/blog-images/bridal-keepsake-frame.jpg"],
    caption: "Pressing individual rose petals prevents trapped core moisture and yields smooth, velvety botanical specimens.",
  },
  {
    re: /spring|wildflower|roadside|calendar|seasonal/i,
    images: ["/blog-images/tulips-and-wildflowers.jpg", "/blog-images/wild-meadow-herbarium.jpg", "/blog-images/cherry-blossoms-spring.jpg", "/blog-images/daisies-and-clover.jpg"],
    caption: "Following seasonal bloom windows gives you a year-round palette of colors, leaf textures, and delicate silhouettes.",
  },
];

const DEFAULT_POOL = [
  "/blog-images/acrylic-press-flatlay.jpg",
  "/blog-images/wild-meadow-herbarium.jpg",
  "/blog-images/workbench-tweezers-action.jpg",
  "/blog-images/botanical-specimen-grid.jpg",
  "/blog-images/oak-frame-rose-art.jpg",
];

function hashSlug(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getStaticBlogCover(slug: string): string {
  return STATIC_SLUG_VISUALS[slug]?.cover || "/blog-images/acrylic-press-flatlay.jpg";
}

export function resolveBlogCoverImage(opts: {
  slug?: string;
  title?: string;
  featuredImageUrl?: string | null;
  keywords?: string[] | null;
}): string {
  if (opts.featuredImageUrl) return opts.featuredImageUrl;
  if (opts.slug && STATIC_SLUG_VISUALS[opts.slug]) {
    return STATIC_SLUG_VISUALS[opts.slug].cover;
  }
  const haystack = `${opts.title || ""} ${opts.slug || ""} ${(opts.keywords || []).join(" ")}`;
  for (const rule of TOPIC_POOLS) {
    if (rule.re.test(haystack)) {
      return rule.images[hashSlug(opts.slug || haystack) % rule.images.length];
    }
  }
  return DEFAULT_POOL[hashSlug(opts.slug || haystack) % DEFAULT_POOL.length];
}

export function resolveBlogInlineImage(opts: {
  slug?: string;
  title?: string;
  coverUrl?: string | null;
  keywords?: string[] | null;
}): BlogInlineVisual {
  if (opts.slug && STATIC_SLUG_VISUALS[opts.slug]) {
    const entry = STATIC_SLUG_VISUALS[opts.slug];
    return {
      src: entry.inline,
      alt: `${opts.title || "Botanical pressing guide"} — step-by-step detail`,
      caption: entry.caption,
    };
  }

  const haystack = `${opts.title || ""} ${opts.slug || ""} ${(opts.keywords || []).join(" ")}`;
  const coverBasename = (opts.coverUrl || "").split("/").pop() || "";

  for (const rule of TOPIC_POOLS) {
    if (rule.re.test(haystack)) {
      const distinct = rule.images.filter((img) => !img.endsWith(coverBasename));
      const pool = distinct.length > 0 ? distinct : DEFAULT_POOL.filter((img) => !img.endsWith(coverBasename));
      const chosen = pool[hashSlug((opts.slug || haystack) + ":inline") % pool.length];
      return {
        src: chosen,
        alt: `${opts.title || "Pressed flower guide"} botanical studio detail`,
        caption: rule.caption,
      };
    }
  }

  const fallbackPool = DEFAULT_POOL.filter((img) => !img.endsWith(coverBasename));
  return {
    src: fallbackPool[hashSlug((opts.slug || haystack) + ":inline") % fallbackPool.length],
    alt: `${opts.title || "Pressed flower guide"} botanical studio detail`,
    caption: "Even pressure and absorbent blotting layers preserve delicate flower structure and natural color.",
  };
}
