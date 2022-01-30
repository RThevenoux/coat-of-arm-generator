import { AdjectiveId, LabelInfo } from "@/service/textual.type";
import { PatternVisualInfo } from "./visual.type";

// Data
import data from "./data/patterns.json";
import { DisplayId } from "@/generator/textual/util";

const visual: Record<string, PatternVisualInfo> = {};
const labelInfo: Record<string, LabelInfo<PatternCompoundAdjective>> = {};

export type PositionId = "chef" | "pointe" | "senestre" | "dextre";
export interface PatternCompoundAdjective {
  adjective: AdjectiveId;
  display?: DisplayId;
  position?: PositionId;
}

for (const item of data) {
  visual[item.id] = item.visual as PatternVisualInfo;
  labelInfo[item.id] = item.blazon as LabelInfo<PatternCompoundAdjective>;
}

export function getPatternTextualInfo(
  patternId: string
): LabelInfo<PatternCompoundAdjective> {
  return labelInfo[patternId];
}

export function getPatternVisualInfo(patternId: string): PatternVisualInfo {
  return visual[patternId];
}
