import { initialViewModel as initialField, toModel as fieldToModel } from './field-tool';

let options = require('./data/partitions.json');
let partitionsOptions = {};
options.forEach(option => partitionsOptions[option.id] = option);

let initOptionId = options[0].id;
let initialValue = _createInitialValue(initOptionId);

export { createPartition, partitionsOptions, initialValue, toModel }

function toModel(viewModel) {
  let model = {
    type: viewModel.type,
    partitions: viewModel.partitions.map(fieldToModel)
  }
  return model;
}

function createPartition(id) {
  return {
    number: id,
    model: initialField()
  };
}

function _createInitialValue(optionId) {
  let count = partitionsOptions[optionId].count;
  let array = [];
  for (let i = array.length; i < count; i++) {
    let partition = createPartition(i);
    array.push(partition);
  }
  return {
    type: optionId,
    partitions: array
  };
}
