import { getStripTextualInfo } from "@/service/ChargeService";
import { getOutlineTextualInfo } from "@/service/OutlineService";
import { ChargeStrip, OutlineId } from "../../model/charge";
import { countableChargeToLabel } from "./util";

export async function stripToLabel(strip: ChargeStrip): Promise<string> {
  const textId = getTextId(strip);

  const textInfo = await getStripTextualInfo(textId);

  const forcePlural = strip.size == "gemel" || strip.size == "triplet";
  const options = {
    contractedPrepositionIfPlural: true,
    forcePlural,
  };
  const main = countableChargeToLabel(textInfo, strip.count, options);

  if (strip.outline) {
    switch (strip.outline.type) {
      case "simple": {
        const masculine = textInfo.genre == "m";
        const plural = strip.count > 1 || forcePlural;
        const outlineAdjective = getSimpleOutlineAdjevtive(
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

function getTextId(strip: ChargeStrip): string {
  switch (strip.direction) {
    case "fasce":
      return _fasce(strip);
    case "barre":
      return _barre(strip);
    case "pal":
      return _pal(strip);
    case "bande":
      return _bande(strip);
    default:
      return "strip:" + strip.direction;
  }
}

function _fasce(strip: ChargeStrip): string {
  switch (strip.size) {
    case "gemel":
      return "jumelle";
    case "triplet":
      return "tierce";
    case "default": {
      if (strip.count < 5) {
        return "fasce";
      } else {
        return strip.count % 2 == 0 ? "burelle" : "trangle";
      }
    }
    case "reduced":
      if (strip.count == 1) {
        return "divise";
      } else {
        return strip.count % 2 == 0 ? "burelle" : "trangle";
      }
    case "minimal":
      return "filet";
  }
}

function _barre(strip: ChargeStrip): string {
  switch (strip.size) {
    case "gemel":
      return "jumelle_barre";
    case "triplet":
      return "tierce_barre";
    case "default":
      return strip.count < 5 ? "barre" : "traverse";
    case "reduced":
      return "traverse";
    case "minimal":
      return "filet_barre";
  }
}

function _pal(strip: ChargeStrip): string {
  switch (strip.size) {
    case "gemel":
      return "jumelle_pal";
    case "triplet":
      return "tierce_pal";
    case "default":
      return strip.count < 5 ? "pal" : "vergette";
    case "reduced":
      return "vergette";
    case "minimal":
      return "filet_pal";
  }
}

function _bande(strip: ChargeStrip): string {
  switch (strip.size) {
    case "gemel":
      return "jumelle_bande";
    case "triplet":
      return "tierce_bande";
    case "default":
      return strip.count < 5 ? "bande" : "cotice";
    case "reduced":
      return "cotice";
    case "minimal":
      return "baton";
  }
}

function getSimpleOutlineAdjevtive(
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
