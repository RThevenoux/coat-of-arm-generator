import { initialViewModel as initialFiller, toModel as fillerToModel } from './filler-tool';
import { toModel as chargeToModel } from './single-charge-tool';

export { initialViewModel, toModel }

function initialViewModel() {
  return {
    filler: initialFiller(),
    border: {
      filler: initialFiller(),
      present: false
    },
    charges: []
  }
}

function toModel(viewModel) {
  let border = null;
  if (viewModel.border.present) {
    border = {
      filler: fillerToModel(viewModel.border.filler)
    }
  }

  let model = {
    type: "simple",
    filler: fillerToModel(viewModel.filler),
    charges: viewModel.charges.map(item => chargeToModel(item.model)),
    border: border
  };
  return model;
}

