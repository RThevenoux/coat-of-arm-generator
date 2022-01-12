import { getStripTextualInfo } from "@/service/ChargeService";
import { getOutlineTextualInfo } from "@/service/OutlineService";
import { ChargeStrip, OutlineId } from "@/model/charge";
import { countableChargeToLabel, directionToLabel } from "../util";
import { Direction } from "@/model/misc";

export async function stripToLabel(strip: ChargeStrip): Promise<string> {
  const textIdWrapper = getTextId(strip);
  const textInfo = await getStripTextualInfo(textIdWrapper.textId);

  const forcePlural = strip.size == "gemel" || strip.size == "triplet";
  const options = {
    contractedPrepositionIfPlural: true,
    forcePlural,
  };

  let main = countableChargeToLabel(textInfo, strip.count, options);
  if (textIdWrapper.direction) {
    main = `${main} ${directionToLabel(textIdWrapper.direction)}`;
  }

  if (strip.outline) {
    switch (strip.outline.type) {
      case "simple": {
        const masculine = textInfo.genre == "m";
        const plural = strip.count > 1 || forcePlural;
        const outlineAdjective = getSimpleOutlineAdjective(
          strip.outline.outlineId,
          masculine,
          plural
        );
        if (strip.outline.shifted) {
          return `${main} ${outlineAdjective} et contre-${outlineAdjective}`;
        } else {
          return `${main} ${outlineAdjective}`;
        }
      }
      case "double":
        return `${main} [double-outline]`;
      case "gemelPotented":
        return `${main} potencées et contre-potencées`;
      case "straight":
      default:
        return main;
    }
  } else {
    return main;
  }
}

function getTextId(strip: ChargeStrip): {
  textId: string;
  direction?: Direction;
} {
  if (strip.size == "gemel") {
    const textId = "jumelle";
    const direction = strip.direction == "fasce" ? undefined : strip.direction;
    return { textId, direction };
  }

  if (strip.size == "triplet") {
    const textId = "tierce";
    const direction = strip.direction == "fasce" ? undefined : strip.direction;
    return { textId, direction };
  }

  switch (strip.direction) {
    case "fasce":
      switch (strip.size) {
        case "default":
          if (strip.count < 5) {
            return { textId: "fasce" };
          } else {
            return { textId: strip.count % 2 == 0 ? "burelle" : "trangle" };
          }
        case "reduced":
          if (strip.count == 1) {
            return { textId: "divise" };
          } else {
            return { textId: strip.count % 2 == 0 ? "burelle" : "trangle" };
          }
        case "minimal":
          return { textId: "filet" };
      }
    // falls through unreachable
    case "barre":
      switch (strip.size) {
        case "default":
          return { textId: strip.count < 5 ? "barre" : "traverse" };
        case "reduced":
          return { textId: "traverse" };
        case "minimal":
          return { textId: "filet", direction: "barre" };
      }
    // falls through unreachable
    case "pal":
      switch (strip.size) {
        case "default":
          return { textId: strip.count < 5 ? "pal" : "vergette" };
        case "reduced":
          return { textId: "vergette" };
        case "minimal":
          return { textId: "filet", direction: "pal" };
      }
    // falls through unreachable
    case "bande":
      switch (strip.size) {
        case "default":
          return { textId: strip.count < 5 ? "bande" : "cotice" };
        case "reduced":
          return { textId: "cotice" };
        case "minimal":
          return { textId: "baton" };
      }
  }
}

function getSimpleOutlineAdjective(
  outlineId: OutlineId,
  masculine: boolean,
  plural: boolean
): string {
  const labels = getOutlineTextualInfo(outlineId);

  if (!labels) {
    console.warn("Invalid outlineId: " + outlineId);
    return "[?]";
  }

  return labels[masculine ? "masculine" : "feminine"][
    plural ? "plural" : "one"
  ];
}
