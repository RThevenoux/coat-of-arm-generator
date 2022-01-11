import { OutlineId } from "@/model/charge";
import { MyOption } from "./MyOptions.type";
import { OutlineTextualData, OutlineVisualData } from "./OutlineData";

// Data
import data from "./data/outline.json";

const visuals: Record<string, OutlineVisualData> = {};
const textuals: Record<string, OutlineTextualData> = {};
const options: MyOption[] = [];

let defaultOutlineId: string | undefined = undefined;

for (const item of data) {
  visuals[item.id] = item.visual as OutlineVisualData;
  textuals[item.id] = item.textual as OutlineTextualData;
  if (item.defaultOutline || !defaultOutlineId) {
    defaultOutlineId = item.id;
  }

  options.push({ id: item.id, label: item.label });
}

export function getOutlineVisualInfo(outlineId: OutlineId): OutlineVisualData {
  return visuals[outlineId];
}

export function getDefaultOutlineId(): OutlineId {
  return defaultOutlineId as unknown as OutlineId;
}

export function getOutlineTextualInfo(
  outlineId: OutlineId
): OutlineTextualData | undefined {
  return textuals[outlineId];
}

export function getGemelPotentedVisualInfo(): OutlineVisualData {
  return {
    patternData: "M 0,0 h3.5 v-3 h-2 v-1 h5 v1 h-2 v 3 h3.5",
    scale: 1,
    reverseShifted: false,
  };
}

export function getOutlineOptions(): MyOption[] {
  return [...options];
}
