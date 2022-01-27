import { FillerPattern } from "@/model/filler";
import { getColorAdjective } from "@/service/ColorService";
import { getAdjective } from "@/service/FrenchService";
import { getPatternTextualInfo } from "@/service/PatternService";
import {
  getDisplayAdjective,
  getPositionAdjective,
  NominalGroupBuilder,
} from "../util";
import { _matchColors } from "./util";

export function addFillerPattern(
  model: FillerPattern,
  builder: NominalGroupBuilder
): void {
  const labelInfo = getPatternTextualInfo(model.patternName);

  const result = _matchColors(labelInfo, model.color1, model.color2);
  const adjective = getAdjective(result.value.adjective);

  builder.addAdjective(adjective);
  if (model.direction) {
    builder.addAdjective(getDisplayAdjective(model.direction));
  }
  if (result.value.display) {
    builder.addAdjective(getDisplayAdjective(result.value.display));
  }
  if (result.value.position) {
    builder.addAdjective(getPositionAdjective(result.value.position));
  }

  if (!result.matchColors) {
    // colors must be specified
    const color1 = getColorAdjective(model.color1);
    const color2 = getColorAdjective(model.color2);
    builder.addPatternAdjective("{0} et {1}", [color1, color2]);
  }
}
