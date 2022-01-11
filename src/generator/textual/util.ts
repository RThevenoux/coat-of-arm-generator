import { TextualInfo } from "@/service/textual.type";

export function countableChargeToLabel(
  textInfo: TextualInfo,
  count: number,
  options?: {
    contractedPrepositionIfPlural?: boolean;
    forcePlural?: boolean;
  }
): string {
  if (count > 1) {
    if (options?.contractedPrepositionIfPlural) {
      return `aux ${count} ${textInfo.plural}`;
    } else {
      return `à ${count} ${textInfo.plural}`;
    }
  }

  if (options?.forcePlural) {
    return `aux ${textInfo.plural}`;
  }

  if (textInfo.elision) {
    return `à l'${textInfo.one}`;
  }

  if (textInfo.genre == "m") {
    return `au ${textInfo.one}`;
  }

  return `à la ${textInfo.one}`;
}
