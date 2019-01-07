import generateVisual from './visual/visual-generator';
import generateBlazon from './blazon/blazon-generator';

// Dirty registration of vue JS component ---
import fillerPicker from './gui/fillerPicker';
import colorPicker from './gui/colorPicker';
//---

var shapes = require("./shapes.json");
var palettes = require("./palettes.json");

new Vue({
  el: '#app',
  data: {
    model: 'none',
    visual: {
      options: {
        shapes: shapes,
        palettes: palettes
      },
      reflect: true,
      palette: 0,
      borderSize: 3,
      shape: "old-french"
    }
  },
  computed: {
    blazon: function () {
      return generateBlazon(this.model);
    },
    configuration: function () {
      return {
        shape: shapes[this.visual.shape],
        palette: palettes[this.visual.palette],
        borderSize: this.visual.borderSize,
        reflect: this.visual.reflect
      }
    },
    image: function () {
      return generateVisual(this.model, this.configuration);
    }
  }
});


