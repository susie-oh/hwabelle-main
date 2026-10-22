import { FlowerEditionContent } from "./flower-edition-types";
import { pressingDaisiesAndCloverGuideContent } from "./pressing-daisies-and-clover-guide";
import { pressingWildVioletsAndFernGuideContent } from "./pressing-wild-violets-and-fern-guide";
import { pressingTulipsAndSmallWildflowersGuideContent } from "./pressing-tulips-and-small-wildflowers-guide";
import { pressingPansiesAndCosmosGuideContent } from "./pressing-pansies-and-cosmos-guide";
import { pressingLavenderAndBabysBreathGuideContent } from "./pressing-lavender-and-babys-breath-guide";
import { pressingCallaLiliesAndBabysBreathGuideContent } from "./pressing-calla-lilies-and-babys-breath-guide";

export const FLOWER_EDITIONS: Record<string, FlowerEditionContent> = {
  "pressing-daisies-and-clover": pressingDaisiesAndCloverGuideContent,
  "pressing-wild-violets-and-fern": pressingWildVioletsAndFernGuideContent,
  "pressing-tulips-and-small-wildflowers": pressingTulipsAndSmallWildflowersGuideContent,
  "pressing-pansies-and-cosmos": pressingPansiesAndCosmosGuideContent,
  "pressing-lavender-and-babys-breath": pressingLavenderAndBabysBreathGuideContent,
  "pressing-calla-lilies-and-babys-breath": pressingCallaLiliesAndBabysBreathGuideContent,
};

export function getFlowerEdition(id: string): FlowerEditionContent | undefined {
  return FLOWER_EDITIONS[id];
}
