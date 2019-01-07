let colorOptionData = [
  { "id": "or", "background": "yellow", "label": "Or" },
  { "id": "argent", "background": "white", "label": "Argent" },
  { "id": "azur", "background": "blue", "label": "Azur" },
  { "id": "gueules", "background": "red", "label": "Gueules" },
  { "id": "sinople", "background": "green", "label": "Sinople" },
  { "id": "sable", "background": "black", "label": "Sable" },
  { "id": "pourpre", "background": "violet", "label": "Pourpre" }
];

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