import { CommunityCardData } from "@/components/community/CommunityCard";

import bridalKeepsakeFrame from "@/assets/community/bridal-keepsake-frame.jpg";
import wildMeadowPressed from "@/assets/community/wild-meadow-pressed.jpg";
import flowerPressingAction from "@/assets/community/flower-pressing-action.jpg";
import freshBridalBouquet from "@/assets/community/fresh-bridal-bouquet.jpg";

export interface CommunitySeedCreation extends CommunityCardData {
  related_resource_slug?: string;
  related_product_url?: string;
  seo_title?: string;
  seo_description?: string;
  has_video?: boolean;
}

export const COMMUNITY_SEED_CREATIONS: CommunitySeedCreation[] = [
  {
    id: "seed-01-bridal-bouquet",
    slug: "june-bridal-bouquet-keepsake",
    project_title: "June Bridal Bouquet Keepsake: English Garden Roses & Ferns",
    public_display_name: "Hwabelle Studio",
    approved_social_handle: "@hwabelle",
    category: "weddings",
    stage: "before_after",
    flowers_used: "Ivory Garden Roses, White Ranunculus, Baby's Breath, Italian Ruscus",
    edited_story:
      "Preserving a bridal bouquet requires separating dense flower heads into delicate petal layers before pressing. We layered these ivory garden roses between our cotton blotting sheets on day one following the ceremony.\n\nAfter two and a half weeks under steady, even tension in the acrylic press, the blooms dried completely flat with their natural creamy undertones perfectly intact. We arranged them in a minimalist brass double-glass floating frame alongside a snippet of the wedding ribbon.",
    source_type: "team_created",
    verified_hwabelle_customer: true,
    og_image_path: bridalKeepsakeFrame,
    published_at: "2026-08-28T14:00:00.000Z",
    related_resource_slug: "flower-pressing-guide",
    seo_title: "June Bridal Bouquet Keepsake | Hwabelle in Bloom",
    seo_description: "See how we pressed and preserved fresh bridal bouquet roses into a framed botanical heirloom using the Hwabelle flower press.",
    media: [
      {
        id: "m-01-before",
        public_storage_path: freshBridalBouquet,
        media_type: "image",
        alt_text: "Fresh bridal bouquet with ivory roses resting on linen table before pressing",
        caption: "Fresh Bridal Bouquet (Day 1)",
        is_primary: false,
        sort_order: 0,
      },
      {
        id: "m-01-after",
        public_storage_path: bridalKeepsakeFrame,
        media_type: "image",
        alt_text: "Framed pressed wedding bouquet keepsake inside double-glass brass frame",
        caption: "Pressed Keepsake Frame (Day 21)",
        is_primary: true,
        sort_order: 1,
      },
    ],
  },
  {
    id: "seed-02-wild-meadow",
    slug: "wild-summer-meadow-frame",
    project_title: "Wild Summer Meadow Frame: Cosmos, Cornflowers & Foraged Ferns",
    public_display_name: "Hwabelle Studio",
    approved_social_handle: "@hwabelle",
    category: "garden_flowers",
    stage: "finished",
    flowers_used: "Pink Cosmos, Blue Cornflowers, Goldenrod, Wild Fern Fronds",
    edited_story:
      "Foraged on a quiet sunny morning after the morning dew had fully evaporated. Wildflowers like cosmos and cornflowers have naturally thin, papery petals that press effortlessly in just 10–14 days.\n\nWe composed this whimsical radial meadow layout on archival watercolor paper, layering the deep blue cornflower florets against the soft pastel pink cosmos petals.",
    source_type: "team_created",
    verified_hwabelle_customer: true,
    og_image_path: wildMeadowPressed,
    published_at: "2026-08-29T10:30:00.000Z",
    related_resource_slug: "flower-selection-guide",
    seo_title: "Wild Summer Meadow Pressed Flower Frame | Hwabelle in Bloom",
    seo_description: "Botanical inspiration: Preserved summer cosmos, cornflowers, and ferns arranged on watercolor art board.",
    media: [
      {
        id: "m-02-main",
        public_storage_path: wildMeadowPressed,
        media_type: "image",
        alt_text: "Collection of pressed summer wildflowers mounted on deckled cotton paper",
        caption: "Wild meadow arrangement on handmade cotton paper",
        is_primary: true,
        sort_order: 0,
      },
    ],
  },
  {
    id: "seed-03-layering-hydrangeas",
    slug: "layering-hydrangeas-eucalyptus-in-progress",
    project_title: "Layering in Progress: Heirloom Hydrangeas & Silver Dollar Eucalyptus",
    public_display_name: "Hwabelle Studio",
    approved_social_handle: "@hwabelle",
    category: "in_progress",
    stage: "in_progress",
    flowers_used: "Blue Hydrangea Florets, Silver Dollar Eucalyptus, Lavender Sprigs",
    edited_story:
      "Here is a behind-the-scenes look at how we prep hydrangea clusters before tightening the press plates. Instead of pressing the entire dense flower head at once, we snip individual florets and lay them face-down with ample spacing between each stem.\n\nAdding eucalyptus leaves provides lovely contrast and aromatic freshness throughout the drying cycle.",
    source_type: "team_created",
    verified_hwabelle_customer: true,
    og_image_path: flowerPressingAction,
    published_at: "2026-08-30T16:15:00.000Z",
    related_resource_slug: "flower-pressing-guide",
    seo_title: "Layering Hydrangeas & Eucalyptus | Hwabelle in Bloom",
    seo_description: "Step-by-step behind the scenes of layering hydrangea florets and eucalyptus in the Hwabelle flower press.",
    media: [
      {
        id: "m-03-main",
        public_storage_path: flowerPressingAction,
        media_type: "image",
        alt_text: "Arranging botanical stems, hydrangea petals and eucalyptus between press layers",
        caption: "Layering individual florets and greenery between blotting sheets",
        is_primary: true,
        sort_order: 0,
      },
    ],
  },
];
