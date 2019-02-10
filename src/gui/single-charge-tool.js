import { initialViewModel as initialFiller} from './filler-tool'
import getChargeOptions from './charge-provider';
import {toModel as fillerToModel} from './filler-tool';

export { initialViewModel, toModel }

function initialViewModel() {
  return {
    type: "strip",
    strip: {
      angle: "0",
      count: 1,
      filler: initialFiller()
    },
    cross: {
      angle: "0",
      filler: initialFiller()
    },
    symbol: {
      chargeId: getChargeOptions().defaultOptionId,
      count: 1,
      filler: initialFiller()
    }
  };
}

function toModel(viewModel) {
  switch (viewModel.type) {
    case "strip": return {
      type: "strip",
      angle: viewModel.strip.angle,
      count: viewModel.strip.count,
      filler: fillerToModel(viewModel.strip.filler)
    }
    case "cross": return {
      type: "cross",
      count: 1,
      angle: viewModel.cross.angle,
      filler: fillerToModel(viewModel.cross.filler)
    }
    case "symbol": return {
      type: "symbol",
      count: viewModel.symbol.count,
      chargeId: viewModel.symbol.chargeId,
      filler: fillerToModel(viewModel.symbol.filler)
    }
  }
}