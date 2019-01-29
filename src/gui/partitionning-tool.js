import { initialViewModel as initialField, toModel as fieldToModel } from './field-tool';

let options = require('./data/partitions.json');
let partitionsOptions = {};
options.forEach(option => partitionsOptions[option.id] = option);

let initOptionId = options[0].id;
let initialValue = _createInitialValue(initOptionId);

export { createPartition, partitionsOptions, initialValue, toModel }

function toModel(viewModel) {
  if (viewModel.type == "plein") {
    let model = {
      type: "field",
      field: fieldToModel(viewModel.partitions[0])
    }
    return model;
  } else {
    let model = {
      type: "partition",
      partitionType: viewModel.type,
      fields: viewModel.partitions.map(subModel => {
        return {
          type: "field",
          field: fieldToModel(subModel)
        }
      })
    }
    return model;
  }
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
