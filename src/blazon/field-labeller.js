import { toLabel as fieldToLabel } from './simple-field-labeller';
import { toLabel as partitionToLabel } from './partition-field-labeller';

export function toLabel(model) {
  switch (model.type) {
    case "field": return fieldToLabel(model.field);
    case "partition": return partitionToLabel(model);
    default: return "[invalid-type:" + model.type + "]";
  }
}