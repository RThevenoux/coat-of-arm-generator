import { Direction } from "@/model/misc";
import { FrenchAdjective, FrenchNoun } from "@/service/textual.type";

export interface NominalGroup {
  label: string;
  masculine: boolean;
  plural: boolean;
}

export class NominalGroupBuilder {
  label: string;
  readonly masculine: boolean;
  readonly plural: boolean;

  constructor(
    noun: FrenchNoun,
    count: number,
    options?: {
      contractedPrepositionIfPlural?: boolean;
      forcePlural?: boolean;
    }
  ) {
    this.masculine = noun.genre == "m";
    this.plural = count > 1 || options?.forcePlural == true;

    this.label = countableNounToLabel(noun, count, options);
  }

  public addText(text: string): void {
    this.label = `${this.label} ${text}`;
  }

  public addAdjective(adjective: FrenchAdjective): void {
    const text = agreeAdjective(adjective, this.masculine, this.plural);
    this.addText(text);
  }

  // Pattern exemple: "{0} et contre-{0}"
  public addPatternAdjective(
    pattern: string,
    adjectives: FrenchAdjective[]
  ): void {
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
  }

  public build(): NominalGroup {
    return {
      label: this.label,
      masculine: this.masculine,
      plural: this.plural,
    };
  }
}

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
