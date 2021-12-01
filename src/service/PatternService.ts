import { LabelInfo } from "@/service/textual.type";
import { PatternVisualInfo } from "./visual.type";

// Data
import data from "./data/patterns.json";

const visual: Record<string, PatternVisualInfo> = {};
const labelInfo: Record<string, LabelInfo> = {};

for (const item of data) {
  visual[item.id] = item.visual as PatternVisualInfo;
  labelInfo[item.id] = item.blazon as LabelInfo;
}

export function getPatternTextualInfo(patternId: string): LabelInfo {
  return labelInfo[patternId];
}

export function getPatternVisualInfo(patternId: string): PatternVisualInfo {
  return visual[patternId];
}
