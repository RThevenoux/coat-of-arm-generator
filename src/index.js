import generateVisual from './visual/visual-generator';
import generateBlazon from './blazon/blazon-generator';

// Dirty registration of vue JS component ---
import fillerPicker from './gui/fillerPicker';
import colorPicker from './gui/colorPicker';
import visualConfiguration from './gui/visualConfiguration';
//---

let defaultConfiguration = require("./defaultConfiguration.json");

new Vue({
  el: '#app',
  data: {
    model: 'none',
    visual: defaultConfiguration
  },
  computed: {
    blazon: function () {
      return generateBlazon(this.model);
    },
    image: function () {
      return generateVisual(this.model, this.visual);
    }
  }
});


