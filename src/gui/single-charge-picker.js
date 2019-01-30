import getChargeOptions from './charge-provider';

Vue.component('single-charge-picker', {
  data: () => {
    return {
      chargeOptions: getChargeOptions().options,
    };
  },
  props:['value'],
  methods: {
    update: function (event) {
      this.$emit("input", this.value);
    },
    select: function (event) {
      this.$emit('select', event);
    }
  },
  template: `
    <div class="flex-container">
      <select v-model="value.type" @change="update">
        <option value="strip">Bandeau</option>
        <option value="cross">Croix</option>
        <option value="symbol">Symbole</option>
      </select>
      <div v-if="value.type === 'strip'" class="flex-container">
        <select v-model="value.strip.angle" @change="update" key="strip-angle">
          <option value="0">en fasce</option>
          <option value="45">en barre</option>
          <option value="90">en pal</option>
          <option value="135">en bande</option>
        </select>
        <input v-model.number="value.strip.count" type="number" @input="update" key="strip-number"></input>
        <filler-picker v-model="value.strip.filler" @input="update" key="strip-filler" @select="select"></filler-picker>
      </div>
      <div v-else-if="value.type === 'cross'" class="flex-container">
        <select v-model="value.cross.angle" @change="update" key="cross-angle">
          <option value="0">droite</option>
          <option value="45">sautoir</option>
        </select>
        <filler-picker v-model="value.cross.filler" @input="update" key="cross-filler" @select="select"></filler-picker>
      </div>
      <div v-else-if="value.type === 'symbol'" class="flex-container">
        <select v-model="value.symbol.chargeId" @change="update" key="symbol-charge">
          <option v-for="option in chargeOptions" :value="option.id">
            {{ option.label }}
          </option>
        </select>
        <filler-picker v-model="value.symbol.filler" @input="update" key="symbol-filler" @select="select"></filler-picker>
      </div>
    </div>
  `
})