import { initialViewModel as initialField, toModel as fieldToModel } from './field-tool';

export { toModel, initialViewModel }

function toModel(viewModel) {
  return fieldToModel(viewModel);
}

function initialViewModel() {
  return initialField();
}