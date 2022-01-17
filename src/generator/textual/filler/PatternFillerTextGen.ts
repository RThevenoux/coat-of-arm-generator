import { FillerPattern } from "@/model/filler";
import { getColorText } from "@/service/ColorService";
import { getAdjective } from "@/service/FrenchService";
import { getPatternTextualInfo } from "@/service/PatternService";
import { agreeAdjective, directionToLabel } from "../util";
import { _matchColors } from "./util";

export function _pattern(
  model: FillerPattern,
  masculine: boolean,
  plural: boolean
): string {
  const labelInfo = getPatternTextualInfo(model.patternName);

  const result = _matchColors(labelInfo, model.color1, model.color2);
  const adjective = getAdjective(result.value);
  const agreedAdjective = agreeAdjective(adjective, masculine, plural);
  const adjectiveWithDirection = _addDirection(model.angle, agreedAdjective);

  if (result.matchColors) {
    return adjectiveWithDirection;
  } else {
    return _addColors(model, adjectiveWithDirection);
  }
}

function _addColors(model: FillerPattern, adjective: string): string {
  const color1 = getColorText(model.color1);
  const color2 = getColorText(model.color2);

  return `${adjective} ${color1} et ${color2}`;
}

function _addDirection(
  direction: "bande" | "barre" | "defaut" | undefined,
  adjective: string
): string {
  if (direction == "bande" || direction == "barre") {
    const directionLabel = directionToLabel(direction);
    return `${adjective} ${directionLabel}`;
  } else {
    return adjective;
  }
}
