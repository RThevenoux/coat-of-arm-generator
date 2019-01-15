let colorOptionData = require("./data/colors.json");

Vue.component('color-picker', {
  data: () => {
    return {
      colorOptions: colorOptionData
    };
  },
  props: ['value'],
  template: `
    <select v-bind:value="value" @input="$emit('input', $event.target.value)">
      <option v-for="color in colorOptions" :value="color.id" :style="'background: '+ color.background">
        {{ color.label }}
      </option>
    </select>
    `
})