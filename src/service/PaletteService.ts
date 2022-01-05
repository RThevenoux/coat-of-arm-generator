import { MyOption } from "./MyOptions.type";
import { PaletteData } from "./visual.type";

// Data
import data from "./data/palettes.json";

const visual: Record<string, PaletteData> = {};
const options: MyOption[] = [];

let defaultId: string | null = null;

for (const item of data) {
  visual[item.id] = item.values;
  options.push({
    id: item.id,
    label: item.label,
  });

  if (defaultId == null || item.default) {
    defaultId = item.id;
  }
}

export function getPalettes(): MyOption[] {
  return options;
}

export function getDefaultPaletteId(): string {
  if (defaultId == null) {
    return "No default palette :/";
  }

  return defaultId;
}

export function getPaletteData(paletteId: string): PaletteData {
  return visual[paletteId];
}
