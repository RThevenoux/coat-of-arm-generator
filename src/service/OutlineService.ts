import { OutlineId } from "@/model/charge";
import { MyOption } from "./MyOptions.type";
import { AdjectiveId, FrenchAdjective } from "./textual.type";
import { OutlineVisualInfo } from "./visual.type";

// Data
import data from "./data/outline.json";
import { defaultAdjective, getAdjective } from "./FrenchService";
import { PositionId } from "./PatternService";

type OutlineAdjectives = {
  default: AdjectiveId;
  chef?: AdjectiveId;
  pointe?: AdjectiveId;
  senestre?: AdjectiveId;
  dextre?: AdjectiveId;
};

const visuals: Record<string, OutlineVisualInfo> = {};
const adjectives: Record<string, OutlineAdjectives> = {};
const options: MyOption[] = [];

let defaultOutlineId: string | undefined = undefined;

for (const item of data) {
  visuals[item.id] = item.visual as OutlineVisualInfo;
  adjectives[item.id] = item.adjective;
  if (item.defaultOutline || !defaultOutlineId) {
    defaultOutlineId = item.id;
  }

  options.push({ id: item.id, label: item.label });
}

export function getOutlineVisualInfo(outlineId: OutlineId): OutlineVisualInfo {
  return visuals[outlineId];
}

export function getDefaultOutlineId(): OutlineId {
  return defaultOutlineId as unknown as OutlineId;
}

export function getSimpleOutlineAdjective(
  outlineId: OutlineId
): FrenchAdjective {
  const adjectiveDef = adjectives[outlineId];
  if (!adjectiveDef) {
    console.log(`No adjective associate with oultine: ${outlineId}`);
    return defaultAdjective();
  }

  return getAdjective(adjectiveDef.default);
}

export function getPositionnedOutlineAdjective(
  outlineId: OutlineId,
  position: PositionId
): { adjective: FrenchAdjective; addPosition: boolean } {
  const adjectiveDef = adjectives[outlineId];
  if (!adjectiveDef) {
    console.log(`No adjective associate with oultine: ${outlineId}`);
    return { adjective: defaultAdjective(), addPosition: true };
  }

  const customAdjectiveId = adjectiveDef[position];
  if (!customAdjectiveId) {
    return { adjective: getAdjective(adjectiveDef.default), addPosition: true };
  } else {
    return { adjective: getAdjective(customAdjectiveId), addPosition: false };
  }
}

export function getGemelPotentedVisualInfo(): OutlineVisualInfo {
  return {
    patternData: "M 0,0 h3.5 v-3 h-2 v-1 h5 v1 h-2 v 3 h3.5",
    scale: 1,
    reverseShifted: false,
  };
}

export function getOutlineOptions(): MyOption[] {
  return [...options];
}
