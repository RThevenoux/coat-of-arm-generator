import { initialViewModel as initialFiller, toModel as fillerToModel } from './filler-tool';
import { toModel as chargeToModel } from './single-charge-tool';

export { initialViewModel, toModel }

function initialViewModel() {
  return {
    filler: initialFiller(),
    charges: []
  }
}

function toModel(viewModel) {
  let model = {
    type: "simple",
    filler: fillerToModel(viewModel.filler),
    charges: viewModel.charges.map(item => chargeToModel(item.model))
  };
  return model;
}

