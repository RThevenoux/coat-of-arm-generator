import {
  AdjectiveId,
  FrenchAdjective,
  FrenchNoun,
  NounId,
} from "./textual.type";

import adjectivesData from "./data/french/adjectives.json";
import nounsData from "./data/french/nouns.json";

const adjectives: Record<AdjectiveId, FrenchAdjective> =
  adjectivesData as Record<AdjectiveId, FrenchAdjective>;
const nouns: Record<NounId, FrenchNoun> = nounsData as Record<
  NounId,
  FrenchNoun
>;

export function defaultAdjective(): FrenchAdjective {
  return {
    type: "irregular",
    masculine: { one: "[?é]", plural: "[?és]" },
    feminine: { one: "[?ée]", plural: "[?ées]" },
  };
}

export function defaultNoun(): FrenchNoun {
  return {
    one: "[?]",
    plural: "[?s]",
    genre: "m",
    elision: false,
  };
}

export function getAdjective(adjectiveId: AdjectiveId): FrenchAdjective {
  const adjective = adjectives[adjectiveId];

  if (!adjective) {
    console.warn(`Invalid adjectiveId:${adjectiveId}`);
    return defaultAdjective();
  } else {
    return adjective;
  }
}

export function getNoun(nounId: NounId): FrenchNoun {
  const noun = nouns[nounId];
  if (!noun) {
    console.warn(`Invalid nounId:${nounId}`);
    return defaultNoun();
  } else {
    return noun;
  }
}
