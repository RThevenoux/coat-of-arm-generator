Vue.component('single-charge', {
  data: () => {
    
    return {
      value: {
        type: "stripe",
        angle: "0",
        count: 1,
        filler : {
          type: "plein",
          color: "gueules"
        }
      }
    };
  },
  methods: {
    update: function (event) {
      this.$emit("input", this.value);
    }
  },
  template: `
    <div class="flex-container">
      <select v-model="value.angle" @change="update">
        <option value="0">en fasce</option>
        <option value="45">en barre</option>
        <option value="90">en pal</option>
        <option value="135">en bande</option>
      </select>
      <input v-model.number="value.count" type="number" @input="update"></input>
      <color-picker v-model="value.filler.color" @input="update"></color-picker>
    </div>
  `
})