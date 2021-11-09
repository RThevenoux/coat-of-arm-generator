import { getPartitionTextual } from "@/service/PartitionService";
import { FieldModel, MultiFieldModel } from "../model.type";
import { pleinFieldToLabel } from "./PleinFieldTextualGenerator";

export async function generateTextual(model: FieldModel): Promise<string> {
  const label = await fieldToLabel(model);
  return capitalizeFirstLetter(label);
}

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

async function fieldToLabel(model: FieldModel): Promise<string> {
  switch (model.type) {
    case "simple":
      return pleinFieldToLabel(model);
    case "partition":
      return partitionToLabel(model);
    default:
      return "[empty]";
  }
}

async function partitionToLabel(model: MultiFieldModel): Promise<string> {
  const partitionInfo = getPartitionTextual(model.partitionType);
  if (!partitionInfo) {
    return "unsupported partition: '" + model.partitionType + "'";
  }

  let formatted = partitionInfo.pattern;
  for (let i = 0; i < partitionInfo.slotCount; i++) {
    const fieldModel = model.fields[i];
    if (fieldModel) {
      const field = await fieldToLabel(fieldModel);
      formatted = formatted.replace("{}", field);
    }
  }
  return formatted;
}
