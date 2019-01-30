import { initialViewModel as initialPartition, toModel as partitionToModel } from './partition-field-tool';

export { toModel, initialViewModel }

function toModel(viewModel) {
  return partitionToModel(viewModel);
}

function initialViewModel() {
  return initialPartition();
}