Vue.component('multi-charge-picker', {
  data: () => {
    return {
      value: []
    };
  },
  methods: {
    add: function () {
      let newCharge = {
        model: {
          type: "strip",
          angle: "0",
          count: 1,
          filler: {
            type: "plein",
            color: "gueules"
          }
        }
      };
      this.value.push(newCharge);
      this.update();
    },
    remove: function (index) {
      this.value.splice(index, 1);
      this.update();
    },
    update: function (event) {
      this.$emit("input", this.value);
    }
  },
  template: `
    <div>
      <div v-for="(charge, index) in value">
        <div class="flex-container">
          <button @click="remove(index)">(-)</button>
          <single-charge-picker v-model="charge.model" @input="update"></single-charge-picker>
        </div>
      </div>
      <button @click="add">(+)</button>
    </div>
    `
})