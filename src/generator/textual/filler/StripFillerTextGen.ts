import { FillerStrip } from "@/model/filler";
import { Direction } from "@/model/misc";
import { getColorText } from "@/service/ColorService";
import { getAdjective } from "@/service/FrenchService";
import { FrenchAdjective } from "@/service/textual.type";
import { agreeAdjective } from "../util";

export function _strip(
  model: FillerStrip,
  masculine: boolean,
  plural: boolean
): string {
  const stripAdjective = _stripAdjective(model.direction);
  const agreedAdjective = agreeAdjective(stripAdjective, masculine, plural);

  const color1 = getColorText(model.color1);
  const color2 = getColorText(model.color2);

  if (model.count == 3) {
    return `${agreedAdjective} ${color1} et ${color2}`;
  } else {
    const stripCount = model.count * 2;
    return `${agreedAdjective} ${color1} et ${color2} de ${stripCount} pièces`;
  }
}

function _stripAdjective(direction: Direction): FrenchAdjective {
  switch (direction) {
    case "fasce":
      return getAdjective("fasce");
    case "barre":
      return getAdjective("barre");
    case "pal":
      return getAdjective("pale");
    case "bande":
      return getAdjective("bande");
  }
}
