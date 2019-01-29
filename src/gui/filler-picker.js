Vue.component('filler-picker', {
  data: function () {
    return {
      state: {
        isSelected: false
      }
    }
  },
  props:['value'],
  methods: {
    click: function (event) {
      let emitEvent = {
        type: "filler-picker",
        source: {
          state: this.state,
          model: this.value
        }
      };
      this.$emit("select", emitEvent);
    }
  },
  template: `
    <div @click="click" v-bind:class="{ selected: state.isSelected }">
      [click me 2 {{value.type}}]
    </div>
    `
});