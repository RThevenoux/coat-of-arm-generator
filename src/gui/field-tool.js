import { initialViewModel as initialFiller, toModel as fillerToModel } from './filler-tool';

export { initialViewModel, toModel }

function initialViewModel() {
  return {
    filler: initialFiller(),
    charges: []
  }
}

function toModel(viewModel) {
  let model = {
    filler: fillerToModel(viewModel.model.filler),
    charges: viewModel.model.charges
  };
  return model;
}

