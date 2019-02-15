Vue.component('simple-field-editor', {
  props: ["value"],
  methods: {
    update: function (event) {
      this.$emit("input", this.value);
    },
    select: function (event) {
      this.$emit('select', event);
    }
  },
  template: `
  <div>
    <filler-picker v-model=value.filler @select="select"></filler-picker>
    <div class="flex-container">
      <label>Border</label>
      <input type="checkbox" v-model="value.border.present"></input>
      <filler-picker v-model=value.border.filler @select="select" v-show="value.border.present"></filler-picker>
    </div>
    <multi-charge-picker v-model="value.charges" @input="update" @select="select"></multi-charge-picker>
  </div>
  `
});