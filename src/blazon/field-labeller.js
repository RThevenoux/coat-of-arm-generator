import { toLabel as simpleToLabel } from './simple-field-labeller';
import { toLabel as partitionToLabel } from './partition-field-labeller';

export function toLabel(model) {
  switch (model.type) {
    case "simple": return simpleToLabel(model);
    case "partition": return partitionToLabel(model);
    default: return "[invalid-type:" + model.type + "]";
  }
}