Vue.component('field-editor', {
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
    click: function (event) {
      let emitEvent = {
        type: "field-editor",
        source: {
          state: this.state,
          model: this.value
        }
      };
      this.$emit("select", emitEvent);
    }
  },
  template: `
  <div>
    <div @click="click" v-bind:class="{ selected: state.isSelected }">
      [click me]
    </div>
    <multi-charge v-model="value.charges" @input="update"></multi-charge>
  </div>
  `
});