import { initialViewModel, toModel } from './root-tool';

import generateVisual from '../visual/visual-generator';
import generateBlazon from '../blazon/blazon-generator';

// Dirty registration of vue JS component ---
import mainEditor from './root-editor';
import fillerEditor from './filler-editor';
import fillerPicker from './filler-picker';
import colorPicker from './colorPicker';
import visualConfiguration from './visual-configuration';
import field from './field-editor';
import simpleFiel from './simple-field-editor';
import partitionField from './partition-field-editor';
import singleCharge from './single-charge-picker';
import multiCharge from './multi-charge-picker';
// ---

let defaultConfiguration = require("./visual.json");

Vue.component('app', {
  data: function () {
    return {
      viewModel: initialViewModel(),
      visual: defaultConfiguration
    }
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
  },
  template: `
    <div class="flex-container">
      <div class="column50">
        <h1>Coat of Arm Generator</h1>
        <div>
          <h2>Definition</h2>
          <root-editor v-model="viewModel"></root-editor>
        </div>
      </div>

      <div class="column50">

        <div>
          <h2>Blazon</h2>
          <div>{{ blazon }}</div>
        </div>

        <div>
          <h2>Visual</h2>
          <div class="flex-container">
            <visual-configuration v-model="visual"></visual-configuration>
            <div v-html="image"></div>
          </div>
        </div>

      </div>
    </div>
  `
});