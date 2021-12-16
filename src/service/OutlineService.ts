import { OutlineId } from "@/generator/model.type";
import { MyOption } from "./MyOptions.type";
import { OutlineVisualData } from "./OutlineData";

// Data
import data from "./data/outline.json";

const visuals: Record<string, OutlineVisualData> = {};
//const textuals: Record<string, LabelInfo> = {};
const options: MyOption[] = [];

for (const item of data) {
  visuals[item.id] = item.visual as OutlineVisualData;
  //textuals[item.id] = item.blazon as LabelInfo;

  options.push({ id: item.id, label: item.label });
}

export function getOutlineInfo(outlineId: OutlineId): OutlineVisualData {
  return visuals[outlineId];
}

export function getOutlineOptions(): MyOption[] {
  return options;
}
