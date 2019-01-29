import { toLabel as fieldToLabel } from './field-labeller';

let partitions = require("./data/partitions.json");

export function toLabel(model) {
  let partitionDef = partitions[model.partitionType];
  if (!partitionDef) {
    return "unsupported partitionning '" + model.type + "'";
  }

  let count = partitionDef.match(/\{\}/g).length;
  for (let i = 0; i < count; i++) {
    let field = fieldToLabel(model.fields[i]);
    partitionDef = partitionDef.replace("{}", field);
  }
  return partitionDef;
}