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
      },
      vair: {
        color1: 'argent',
        color2: 'azur'
      },
      contrevair: {
        color1: 'argent',
        color2: 'azur'
      },
      vair_en_pal: {
        color1: 'argent',
        color2: 'azur'
      },
      vair_en_pointe: {
        color1: 'argent',
        color2: 'azur'
      },
    }
  },
  computed: {
    value: {
      get: function () {
        switch (this.type) {
          case "echiquete": return {
            type: "pattern",
            patternName: "echiquete",
            color1: this.echiquete.color1,
            color2: this.echiquete.color2
          }
          case "fusele": return {
            type: "pattern",
            patternName: "fusele",
            angle: this.fusele.angle,
            color1: this.fusele.color1,
            color2: this.fusele.color2
          }
          case "losange": return {
            type: "pattern",
            patternName: "losange",
            color1: this.losange.color1,
            color2: this.losange.color2
          }
          case "plein": return {
            type: "plein",
            color: this.plein.color,
          }
          case "vair": return {
            type: "pattern",
            patternName: "vair",
            color1: this.vair.color1,
            color2: this.vair.color2
          }
          case "contrevair": return {
            type: "pattern",
            patternName: "contrevair",
            color1: this.contrevair.color1,
            color2: this.contrevair.color2
          }
          case "vair_en_pal": return {
            type: "pattern",
            patternName: "vair_en_pal",
            color1: this.vair_en_pal.color1,
            color2: this.vair_en_pal.color2
          }
          case "vair_en_pointe": return {
            type: "pattern",
            patternName: "vair_en_pointe",
            color1: this.vair_en_pointe.color1,
            color2: this.vair_en_pointe.color2
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
      <div>
        <label>Vair</label>
        <input type="radio" v-model="type" value="vair" @change="update">
        <color-picker v-model="vair.color1" @input="update"></color-picker>
        <color-picker v-model="vair.color2" @input="update"></color-picker>
      </div>
      <div>
        <label>Contre-vair</label>
        <input type="radio" v-model="type" value="contrevair" @change="update">
        <color-picker v-model="contrevair.color1" @input="update"></color-picker>
        <color-picker v-model="contrevair.color2" @input="update"></color-picker>
      </div>
      <div>
        <label>Vair en pal</label>
        <input type="radio" v-model="type" value="vair_en_pal" @change="update">
        <color-picker v-model="vair_en_pal.color1" @input="update"></color-picker>
        <color-picker v-model="vair_en_pal.color2" @input="update"></color-picker>
      </div>
      <div>
        <label>Vair en pointe</label>
        <input type="radio" v-model="type" value="vair_en_pointe" @change="update">
        <color-picker v-model="vair_en_pointe.color1" @input="update"></color-picker>
        <color-picker v-model="vair_en_pointe.color2" @input="update"></color-picker>
      </div>
    </div>
    `
});