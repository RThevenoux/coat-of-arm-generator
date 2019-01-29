import { initialViewModel as chargeViewModel } from './single-charge-tool'

Vue.component('multi-charge-picker', {
  data: () => {
    return {
      value: []
    };
  },
  methods: {
    add: function () {
      let newCharge = { model: chargeViewModel() };
      this.value.push(newCharge);
      this.update();
    },
    remove: function (index) {
      this.value.splice(index, 1);
      this.update();
    },
    update: function (event) {
      this.$emit("input", this.value);
    },
    select: function (event) {
      this.$emit('select', event);
    }
  },
  template: `
    <div>
      <div v-for="(charge, index) in value">
        <div class="flex-container">
          <button @click="remove(index)">(-)</button>
          <single-charge-picker v-model="charge.model" @input="update" @select="select"></single-charge-picker>
        </div>
      </div>
      <button @click="add">(+)</button>
    </div>
    `
})