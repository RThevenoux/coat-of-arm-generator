Vue.component('filler-picker', {
  data: function () {
    return {
      type: 'none',
      plein: {
        color: 'azur'
      },
      echiquete: {
        color1: 'azur',
        color2: 'or'
      },
      losange: {
        color1: 'gueules',
        color2: 'argent'
      },
      fusele: {
        color1: 'sinople',
        color2: 'argent',
        angle: 'barre'
      }
    }
  },
  computed: {
    value: {
      get: function () {
        switch (this.type) {
          case "echiquete": return {
            type: "echiquete",
            color1: this.echiquete.color1,
            color2: this.echiquete.color2
          }
          case "fusele": return {
            type: "fusele",
            angle: this.fusele.angle,
            color1: this.fusele.color1,
            color2: this.fusele.color2
          }
          case "losange": return {
            type: "losange",
            color1: this.losange.color1,
            color2: this.losange.color2
          }
          case "plein": return {
            type: "plein",
            color: this.plein.color,
          }
          default: return {
            type: this.type
          }
        }
      },
      set: function (newValue) {

      }
    }
  },
  methods: {
    update: function (event) {
      this.$emit("input", this.value);
    }
  },
  template: `
    <div>
      <div>
        <label>Plein</label>
        <input type="radio" v-model="type" value="plein" @change="update">
        <color-picker v-model="plein.color" @input="update"></color-picker>
      </div>

      <div>
        <label>Échiqueté</label>
        <input type="radio" v-model="type" value="echiquete" @change="update">
        <color-picker v-model="echiquete.color1" @input="update"></color-picker>
        <color-picker v-model="echiquete.color2" @input="update"></color-picker>
      </div>

      <div>
        <label>Losangé</label>
        <input type="radio" v-model="type" value="losange" @change="update">
        <color-picker v-model="losange.color1" @input="update"></color-picker>
        <color-picker v-model="losange.color2" @input="update"></color-picker>
      </div>
      <div>
        <label>Fuselé</label>
        <input type="radio" v-model="type" value="fusele" @change="update">
        <color-picker v-model="fusele.color1" @input="update"></color-picker>
        <color-picker v-model="fusele.color2" @input="update"></color-picker>
        <select v-model="fusele.angle" @change="update">
          <option value="defaut">défaut</option>
          <option value="bande">en bande</option>
          <option value="barre">en barre</option>
        </select>
      </div>
    </div>
    `
});

function getDescription(app) {
  switch (app.type) {
    case "echiquete": return {
      type: "echiquete",
      color1: app.echiquete.color1,
      color2: app.echiquete.color2
    }
    case "fusele": return {
      type: "fusele",
      angle: app.fusele.angle,
      color1: app.fusele.color1,
      color2: app.fusele.color2
    }
    case "losange": return {
      type: "losange",
      color1: app.losange.color1,
      color2: app.losange.color2
    }
    case "plein": return {
      type: "plein",
      color: app.plein.color,
    }
    default: return {
      type: app.type
    }
  }
}