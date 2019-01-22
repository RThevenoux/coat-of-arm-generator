import getChargeOptions from './charge-provider';

let chargeOptions = getChargeOptions();

Vue.component('single-charge', {
  data: () => {
    return {
      type: "strip",
      strip: {
        angle: "0",
        count: 1,
        color: "gueules"
      },
      cross: {
        angle: "0",
        color: "gueules"
      },
      symbol: {
        chargeOptions: chargeOptions.options,
        chargeId: chargeOptions.defaultOptionId,
        color: "gueules"
      }
    };
  },
  computed: {
    value: {
      get: function () {
        switch (this.type) {
          case "strip": return {
            type: "strip",
            angle: this.strip.angle,
            count: this.strip.count,
            filler: {
              type: "plein",
              color: this.strip.color
            }
          }
          case "cross": return {
            type: "cross",
            count: 1,
            angle: this.cross.angle,
            filler: {
              type: "plein",
              color: this.cross.color
            }
          }
          case "symbol": return {
            type: "symbol",
            count: 1,
            chargeId: this.symbol.chargeId,
            filler: {
              type: "plein",
              color: this.symbol.color
            }
          }
        }
      }
    }
  },
  methods: {
    update: function (event) {
      this.$emit("input", this.value);
    }
  },
  template: `
    <div class="flex-container">
      <select v-model="type" @change="update">
        <option value="strip">Bandeau</option>
        <option value="cross">Croix</option>
        <option value="symbol">Symbole</option>
      </select>
      <div v-if="type === 'strip'">
        <select v-model="strip.angle" @change="update" key="strip-angle">
          <option value="0">en fasce</option>
          <option value="45">en barre</option>
          <option value="90">en pal</option>
          <option value="135">en bande</option>
        </select>
        <input v-model.number="strip.count" type="number" @input="update" key="strip-number"></input>
        <color-picker v-model="strip.color" @input="update" key="strip-color"></color-picker>
      </div>
      <div v-else-if="type === 'cross'">
        <select v-model="cross.angle" @change="update" key="cross-angle">
          <option value="0">droite</option>
          <option value="45">sautoir</option>
        </select>
        <color-picker v-model="cross.color" @input="update" key="cross-color"></color-picker>
      </div>
      <div v-else-if="type === 'symbol'">
        <select v-model="symbol.chargeId" @change="update" key="symbol-charge">
          <option v-for="option in symbol.chargeOptions" :value="option.id">
            {{ option.label }}
          </option>
        </select>
        <color-picker v-model="symbol.color" @input="update" key="symbol-color"></color-picker>
      </div>
    </div>
  `
})