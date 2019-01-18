Vue.component('multi-charge', {
  data: () => {
    return {
      value: []
    };
  },
  methods: {
    add: function () {
      let newCharge = {
        model: {
          type: "stripe",
          angle: "0",
          count: 1,
          color: 'gueules'
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
        <single-charge v-model="charge.model" @input="update"></single-charge>
        <button @click="remove(index)">(-)</button>
      </div>
      <button @click="add">(+)</button>
    </div>
    `
})