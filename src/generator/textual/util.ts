import { Direction } from "@/model/misc";
import { PositionId } from "@/service/PatternService";
import { FrenchAdjective, FrenchNoun } from "@/service/textual.type";

export class NominalGroupBuilder {
  static fromNoun(
    noun: FrenchNoun,
    count?: number,
    options?: {
      contractedPrepositionIfPlural?: boolean;
      forcePlural?: boolean;
    }
  ): NominalGroupBuilder {
    const safeCount = count ? count : 1;
    const masculine = noun.genre == "m";
    const plural = safeCount > 1 || options?.forcePlural == true;
    const baseLabel = countableNounToLabel(noun, safeCount, options);
    return new NominalGroupBuilder(baseLabel, masculine, plural);
  }

  label: string;
  constructor(
    readonly baseLabel: string,
    readonly masculine: boolean,
    readonly plural: boolean
  ) {
    this.label = baseLabel;
  }

  public addText(text: string): NominalGroupBuilder {
    this.label = `${this.label} ${text}`;
    return this;
  }

  public addAdjective(adjective: FrenchAdjective): NominalGroupBuilder {
    const text = agreeAdjective(adjective, this.masculine, this.plural);
    this.addText(text);
    return this;
  }

  // Pattern exemple: "{0} et contre-{0}"
  public addPatternAdjective(
    pattern: string,
    adjectives: FrenchAdjective[]
  ): NominalGroupBuilder {
    let text = pattern;
    for (let i = 0; i < adjectives.length; i++) {
      const adjective = adjectives[i];
      const agreedAdjective = agreeAdjective(
        adjective,
        this.masculine,
        this.plural
      );
      text = text.replaceAll("{" + i + "}", agreedAdjective);
    }
    this.addText(text);
    return this;
  }
}

export type DisplayId = Direction | "croix" | "sautoir";

export function getDisplayAdjective(direction: DisplayId): FrenchAdjective {
  switch (direction) {
    case "bande":
      return { type: "invariant", invariant: "en bande" };
    case "barre":
      return { type: "invariant", invariant: "en barre" };
    case "fasce":
      return { type: "invariant", invariant: "en fasce" };
    case "pal":
      return { type: "invariant", invariant: "en pal" };
    case "croix":
      return { type: "invariant", invariant: "en croix" };
    case "sautoir":
      return { type: "invariant", invariant: "en sautoir" };
  }
}

export function getPositionAdjective(position: PositionId): FrenchAdjective {
  switch (position) {
    case "pointe":
      return { type: "invariant", invariant: "en pointe" };
    case "chef":
      return { type: "invariant", invariant: "en chef" };
    case "dextre":
      return { type: "invariant", invariant: "à dextre" };
    case "senestre":
      return { type: "invariant", invariant: "à senestre" };
    default:
      return { type: "invariant", invariant: "à [?]" };
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
