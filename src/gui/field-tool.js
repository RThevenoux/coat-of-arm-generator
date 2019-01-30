import { toModel as simpleToModel, initialViewModel as initialSimple } from './simple-field-tool';
import { toModel as partitionToModel, initialViewModel as initialPartition } from './partition-field-tool';

export { toModel, initialViewModel }

function toModel(viewModel) {
  if (viewModel.type == "simple") {
    return simpleToModel(viewModel.simple);
  } else {
    return partitionToModel(viewModel.partition);
  }
}

function initialViewModel() {
  return {
    type: "simple",
    simple: initialSimple(),
    partition: initialPartition()
  };
}