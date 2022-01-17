import { Direction } from "@/model/misc";
import { FrenchAdjective, FrenchNoun } from "@/service/textual.type";

export function directionToLabel(direction: Direction): string {
  switch (direction) {
    case "bande":
      return "en bande";
    case "barre":
      return "en barre";
    case "fasce":
      return "en fasce";
    case "pal":
      return "en pal";
  }
}

export function uncountableNounToLabel(noun: FrenchNoun): string {
  if (noun.elision) {
    return `d'${noun.plural}`;
  } else {
    return `de ${noun.plural}`;
  }
}

export function countableNounToLabel(
  noun: FrenchNoun,
  count: number,
  options?: {
    contractedPrepositionIfPlural?: boolean;
    forcePlural?: boolean;
  }
): string {
  if (count > 1) {
    if (options?.contractedPrepositionIfPlural) {
      return `aux ${count} ${noun.plural}`;
    } else {
      return `à ${count} ${noun.plural}`;
    }
  }

  if (options?.forcePlural) {
    return `aux ${noun.plural}`;
  }

  if (noun.elision) {
    return `à l'${noun.one}`;
  }

  if (noun.genre == "m") {
    return `au ${noun.one}`;
  }

  return `à la ${noun.one}`;
}

export function agreeAdjective(
  adjective: FrenchAdjective,
  masculine: boolean,
  plural: boolean
): string {
  if (adjective.type == "invariant") {
    return adjective.invariant;
  }

  if (adjective.type == "regular") {
    const base = adjective.base;
    return base + (masculine ? "" : "e") + (plural ? "s" : "");
  }

  // type == "irregular"
  const genred = masculine ? adjective.masculine : adjective.feminine;
  return plural ? genred.plural : genred.one;
}
