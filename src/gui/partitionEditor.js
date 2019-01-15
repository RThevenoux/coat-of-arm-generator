Vue.component('partition-editor', {
  data: function () {
    return {
      value: {
        filler: "none",
        charges: []
      }
    }
  },
  template: `
  <div>
    <filler-picker v-model="value.filler" @input="$emit('input', value)"></filler-picker>
    <p>Charge not develloped yet</p>
  </div>
  `
});