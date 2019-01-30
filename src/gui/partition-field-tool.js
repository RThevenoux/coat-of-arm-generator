import { initialViewModel as initialField, toModel as fieldToModel } from './simple-field-tool';

let options = require('./data/partitions.json');
let partitionsOptions = {};
options.forEach(option => partitionsOptions[option.id] = option);

export { createPartition, partitionsOptions, initialViewModel, toModel }

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

function initialViewModel() {
  let optionId = options[0].id;
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
