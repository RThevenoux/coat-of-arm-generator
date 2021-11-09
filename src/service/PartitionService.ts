import { PartitionTextualInfo } from "@/service/textual.type";
import { MyOption } from "./MyOptions.type";
import { PartitionVisualInfo } from "./visual.type";

// Data
import data from "./data/partitions.json";

const visual: Record<string, PartitionVisualInfo> = {};
const blazon: Record<string, PartitionTextualInfo> = {};
const options: MyOption[] = [];
const fieldCountInPartition: Record<string, number> = {};

for (const item of data) {
  blazon[item.id] = {
    slotCount: getSlotCount(item.blazon),
    pattern: item.blazon,
  };

  if (item.visual) {
    fieldCountInPartition[item.id] = item.visual.paths.length;
    visual[item.id] = item.visual;
  } else {
    fieldCountInPartition[item.id] = 1;
  }

  options.push({
    id: item.id,
    label: item.label,
  });
}

function getSlotCount(pattern: string): number {
  const matches = pattern.match(/\{\}/g);
  if (!matches) {
    return 0;
  }
  return matches.length;
}

export function getPartitionOptions(): MyOption[] {
  return options;
}

export function getFieldCountInPartition(partionId: string): number {
  return fieldCountInPartition[partionId];
}

export function getPartitionTextual(partionId: string): PartitionTextualInfo {
  return blazon[partionId];
}

export function getPartitionVisual(partitionId: string): PartitionVisualInfo {
  return visual[partitionId];
}
