import getChargeOptions from './charge-provider';

export { initialViewModel, toModel }

function initialViewModel() {
  return {
    pleinColor: 'azur',
    patternColor1: 'azur',
    patternColor2: 'or',
    patternAngle: 'bande',
    patternName: 'echiquete',
    semeChargeId: getChargeOptions().defaultOptionId,
    semeFieldColor: 'azur',
    semeChargeColor: 'or',
    stripAngle: "0",
    stripColor1: 'azur',
    stripColor2: 'or',
    stripCount: 3
  }
}

function toModel(viewModel) {
  switch (viewModel.type) {
    case "plein":
      return {
        type: "plein",
        color: viewModel.pleinColor
      }
    case "seme":
      return {
        type: "seme",
        chargeId: viewModel.semeChargeId,
        chargeColor: viewModel.semeChargeColor,
        fieldColor: viewModel.semeFieldColor
      }
    case "strip":
      return {
        type: "strip",
        angle: viewModel.stripAngle,
        count: viewModel.stripCount,
        color1: viewModel.stripColor1,
        color2: viewModel.stripColor2
      }
    case "pattern": {
      let model = {
        type: "pattern",
        patternName: viewModel.patternName,
        color1: viewModel.patternColor1,
        color2: viewModel.patternColor2,
      }
      if (viewModel.patternName == "fusele") {
        model.angle = viewModel.patternAngle;
      }

      return model;
    }
    default: {
      return {
        type: "invalid"
      }
    }
  }
}