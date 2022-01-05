import { ColorId } from "../generator/model.type";
import { ColorOption } from "./ColorOption";

// Data
import data from "./data/color.json";

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

export function getColorText(colorId: ColorId): string {
  return blazon[colorId];
}
