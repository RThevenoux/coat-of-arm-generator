Vue.component('partition-editor', {
  data: function () {
    return {
      value: {
        filler: "none",
        charges: []
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
    <filler-picker v-model="value.filler" @input="update"></filler-picker>
    <multi-charge v-model="value.charges" @input="update"></multi-charge>
  </div>
  `
});