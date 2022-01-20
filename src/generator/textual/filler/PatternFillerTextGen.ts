import { FillerPattern } from "@/model/filler";
import { getColorAdjective } from "@/service/ColorService";
import { getAdjective } from "@/service/FrenchService";
import { getPatternTextualInfo } from "@/service/PatternService";
import { directionToLabel, NominalGroupBuilder } from "../util";
import { _matchColors } from "./util";

export function addFillerPattern(
  model: FillerPattern,
  builder: NominalGroupBuilder
): void {
  const labelInfo = getPatternTextualInfo(model.patternName);

  const result = _matchColors(labelInfo, model.color1, model.color2);
  const adjective = getAdjective(result.value);

  builder.addAdjective(adjective);
  if (model.angle == "bande" || model.angle == "barre") {
    builder.addText(directionToLabel(model.angle));
  }

  if (!result.matchColors) {
    // colors must be specified
    const color1 = getColorAdjective(model.color1);
    const color2 = getColorAdjective(model.color2);
    builder.addPatternAdjective("{0} et {1}", [color1, color2]);
  }
}
