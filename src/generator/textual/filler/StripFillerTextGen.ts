import { FillerStrip } from "@/model/filler";
import { Direction } from "@/model/misc";
import { getColorAdjective } from "@/service/ColorService";
import { getAdjective } from "@/service/FrenchService";
import { FrenchAdjective } from "@/service/textual.type";
import { NominalGroupBuilder } from "../util";

export function addFillerStrip(
  model: FillerStrip,
  nominalGroup: NominalGroupBuilder
): void {
  const stripAdjective = _stripAdjective(model.direction);

  const color1 = getColorAdjective(model.color1);
  const color2 = getColorAdjective(model.color2);
  nominalGroup
    .addAdjective(stripAdjective)
    .addPatternAdjective("{0} et {1}", [color1, color2]);

  if (model.count != 3) {
    const stripCount = model.count * 2;
    nominalGroup.addText(`de ${stripCount} pièces`);
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
