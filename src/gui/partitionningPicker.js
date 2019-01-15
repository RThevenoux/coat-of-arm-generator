Vue.component('partitionnig-picker', {
  data: function () {
    return {
      options: {
        "plain": { label: "Aucun", id: "plain", count: 1 },
        "parti": { label: "Parti", id: "parti", count: 2 },
        "coupe": { label: "Coupé", id: "coupe", count: 2 },
        "tierce_en_pal": {label: "Tiercé en pal", id: "tierce_en_pal", count: 3},
        "tierce_en_pairle": { label: "Tiercé en pairle", id: "tierce_en_pairle", count: 3 },
        "ecartele": { label: "Écartelé", id: "ecartele", count: 4 }
      },
      value: {
        type: "plain",
        partitions: [{ number: 0, model: "none" }]
      }
    }
  },
  methods: {
    updatePartitionning: function () {
      let count = this.options[this.value.type].count;
      let array = this.value.partitions;

      if (count > array.length) {
        for (let i = array.length; i < count; i++) {
          array.push({ number: i, model: "none" });
        }
      } else {
        while (count < array.length) {
          array.pop();
        }
      }
     this.$emit('input', this.value);
    }
  },
  template: `
    <div>
      <div>
      <label>Partition</label>
        <select v-model="value.type" @change="updatePartitionning">
          <option v-for="option in options" :value="option.id">{{option.label}}</option>
        </select>
      </div>
      <partition-editor v-for="partition in value.partitions" v-model="partition.model" :key="partition.number" @input="$emit('input', value)"></partition-editor>
    </div>
    `
});