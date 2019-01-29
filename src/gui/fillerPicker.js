import getChargeOptions from './charge-provider';

let chargeOptions = getChargeOptions();

Vue.component('filler-picker', {
  data: function () {
    return {
      chargeOptions: chargeOptions.options,
    }
  },
  props: ["value"],

  methods: {
    update: function (event) {
      this.$emit("input", this.value);
    }
  },
  template: `
    <div>
      <div>
        <input type="radio" v-model="value.type" value="plein" @change="update">
        <label>Plein</label>
        <color-picker v-model="value.pleinColor" @input="update"></color-picker>
      </div>

      <div class="flex-container" style="background-color:#D8D8D8">
        <input type="radio" v-model="value.type" value="pattern"   @change="update"></input>
        <p>Pavage</p>
        <div>
          <div>
            <input type="radio" v-model="value.patternName" value="echiquete" @change="update">
            <label>Échiqueté</label>
          </div>
          <div>
            <input type="radio" v-model="value.patternName" value="losange" @change="update">
            <label>Losangé</label>
          </div>
          <div>
            <input type="radio" v-model="value.patternName" value="triangle" @change="update">
            <label>Trianglé</label>
          </div>
          <div>
            <input type="radio" v-model="value.patternName" value="fusele" @change="update">
            <label>Fuselé</label>
            <select v-model="value.patternAngle" @change="update">
              <option value="defaut">défaut</option>
              <option value="bande">en bande</option>
              <option value="barre">en barre</option>
            </select>
          </div>
        </div>
        <div>
          <div>
            <input type="radio" v-model="value.patternName" value="vair" @change="update">
            <label>Vair</label>
          </div>
          <div>
            <input type="radio" v-model="value.patternName" value="contrevair" @change="update">
            <label>Contre-vair</label>
          </div>
          <div>
            <input type="radio" v-model="value.patternName" value="vair_en_pal" @change="update">
            <label>Vair en pal</label>
          </div>
          <div >
            <input type="radio" v-model="value.patternName" value="vair_en_pointe" @change="update">
            <label>Vair en pointe</label>
          </div>
        </div>
        <div>
          <div>
            <color-picker v-model="value.patternColor1" @input="update"></color-picker>
          </div>
          <div>
            <color-picker v-model="value.patternColor2" @input="update"></color-picker>
          </div>
        </div>
      </div>

      <div class="flex-container" style="background-color:#FFF">
        <p>Semé</p>
        
        <input type="radio" v-model="value.type" value="seme" @change="update">
        
        <select v-model="value.semeChargeId" @change="update">
          <option v-for="option in chargeOptions" :value="option.id">
            {{ option.label }}
          </option>
        </select>
        
        <label>Couleur champs</label>
        <color-picker v-model="value.semeFieldColor" @input="update"></color-picker>
       
        <label>Couleur meuble</label>
        <color-picker v-model="value.semeChargeColor" @input="update"></color-picker>
      </div>

      <div style="background-color:#D8D8D8">
        <input type="radio" v-model="value.type" value="strip" @change="update">
        <select v-model="value.stripAngle" @change="update">
          <option value="0">fascé</option>
          <option value="45">barré</option>
          <option value="90">palé</option>
          <option value="135">bandé</option>
        </select>
        <color-picker v-model="value.stripColor1" @input="update"></color-picker>
        <color-picker v-model="value.stripColor2" @input="update"></color-picker>
        <input v-model.number="value.stripCount" type="number" @input="update"></input>
      </div>

    </div>
    `
});