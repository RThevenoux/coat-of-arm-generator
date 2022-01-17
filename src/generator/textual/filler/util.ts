import { ColorId } from "@/model/misc";
import { LabelInfo } from "@/service/textual.type";

export function _matchColors<T>(
  custom: LabelInfo<T>,
  color1: ColorId,
  color2: ColorId
): { matchColors: boolean; value: T } {
  if (custom.type == "simple") {
    return { matchColors: false, value: custom.value };
  }

  // type == "switch"
  for (const aCase of custom.cases) {
    if (aCase.colors[0] == color1 && aCase.colors[1] == color2) {
      return { matchColors: true, value: aCase.value };
    }
  }

  return { matchColors: false, value: custom.else };
}
