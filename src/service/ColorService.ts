import { ColorId } from "../model/misc";
import { ColorOption } from "./ColorOption";

// Data
import data from "./data/color.json";
import { FrenchAdjective } from "./textual.type";

const blazon: Record<string, string> = {};
const colorOptions: ColorOption[] = [];

for (const item of data) {
  blazon[item.id] = item.blazon;

  colorOptions.push({
    id: item.id,
    label: item.picker.label,
    background: item.picker.background,
  });
}

export function getColorOptions(): ColorOption[] {
  return colorOptions;
}

export function getColorAdjective(colorId: ColorId): FrenchAdjective {
  return {
    type: "invariant",
    invariant: blazon[colorId],
  };
}
