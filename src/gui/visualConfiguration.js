let shapes = require("./shapes.json");
let palettes = require("./palettes.json");

Vue.component('visual-configuration', {
  data: () => {
    return {
      options: {
        shapes: shapes,
        palettes: palettes
      }
    };
  },
  props:[
    'value'
  ],
  template: `
  <div>
    <h3>Configuration</h3>
    <select v-model="value.shape" @change="update">
      <option v-for="shape in options.shapes" :value="shape.id">
        {{ shape.label }}
      </option>
    </select>

    <select v-model="value.palette" @change="update">
      <option v-for="palette in options.palettes" :value="palette.id">
        {{ palette.label }}
      </option>
    </select>

    <div>
      <input type="checkbox" v-model="value.reflect" @change="update">
      <label>Reflect effect</label>
    </div>

    <div>
      <label>Bordure écu</label>
      <input v-model.number="value.borderSize" type="number">
    </div>

    <div>
      <label>Bordure meubles</label>
      <input v-model.number="value.defaultStrokeSize" type="number">
    </div>

  </div>`,
  methods: {
    update: function (event) {
      this.$emit("input", this.value);
    }
  }
});