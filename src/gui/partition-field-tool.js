import { initialViewModel as initialField, toModel as fieldToModel } from './field-tool';

let options = require('./data/partitions.json');
let partitionsOptions = {};
options.forEach(option => partitionsOptions[option.id] = option);

export { createPartition, partitionsOptions, initialViewModel, toModel }

function toModel(viewModel) {
  let model = {
    type: "partition",
    partitionType: viewModel.partitionType,
    fields: viewModel.partitions.map(subModel => fieldToModel(subModel.model))
  }
  return model;
}

function createPartition(id) {
  return {
    number: id,
    model: initialField()
  };
}

function initialViewModel() {
  return {
    partitionType: "none",
    partitions: []
  };
}
