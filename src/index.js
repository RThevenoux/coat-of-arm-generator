import generateVisual from './visual/visual-generator';
import generateBlazon from './blazon/blazon-generator';

// Dirty registration of vue JS component ---
import mainEditor from './gui/main-editor';
import fillerPicker from './gui/filler-picker';
import colorPicker from './gui/colorPicker';
import visualConfiguration from './gui/visual-configuration';
import partitionEditor from './gui/field-editor';
import partitionningPicker from './gui/partitionning-picker';
import singleCharge from './gui/single-charge';
import multiCharge from './gui/multi-charge';
//---

import { initialValue } from './gui/partitionning-tool';

let defaultConfiguration = require("./defaultConfiguration.json");

new Vue({
  el: '#app',
  data: {
    viewModel: initialValue,
    visual: defaultConfiguration
  },
  computed: {
    model: function () {
      let model = toModel(this.viewModel);
      return model;
    },
    blazon: function () {
      return generateBlazon(this.model);
    },
    image: function () {
      return generateVisual(this.model, this.visual);
    }
  }
});

function toModel(viewModel) {
  let model = {
    type: viewModel.type,
    partitions: viewModel.partitions.map(partitionToModel)
  }

  return model;
}

function partitionToModel(viewModel) {
  let model = {
    filler: fillerToModel(viewModel.model.filler),
    charges: viewModel.model.charges
  };

  return {
    model: model
  };
}

function fillerToModel(viewModel) {

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


