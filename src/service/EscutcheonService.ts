import { MyOption } from "./MyOptions.type";

// Data
import data from "./data/escutcheons.json";

const visual: Record<string, string> = {};
const options: MyOption[] = [];
let defaultId: string | null = null;

for (const item of data) {
  visual[item.id] = item.path;
  options.push({
    id: item.id,
    label: item.label,
  });

  if (defaultId == null || item.default) {
    defaultId = item.id;
  }
}

export function getEscutcheons(): MyOption[] {
  return options;
}

export function getDefaultEscutcheonId(): string {
  if (defaultId == null) {
    return "No default escutcheon";
  }
  return defaultId;
}

export function getEscutcheonPath(escutcheonId: string): string {
  return visual[escutcheonId];
}
