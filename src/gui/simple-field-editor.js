Vue.component('simple-field-editor', {
  data: function () {
    return {
      state: {
        isSelected: false
      }
    }
  },
  props:["value"],
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
    <multi-charge-picker v-model="value.charges" @input="update" @select="select"></multi-charge-picker>
  </div>
  `
});