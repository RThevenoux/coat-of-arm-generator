import { createPartition, partitionsOptions } from './partition-field-tool'

Vue.component('partition-field-editor', {
  data: function () {
    return {
      options: partitionsOptions,
      fillerEditor: null
    }
  },
  props: ['value'],
  methods: {
    updatePartitionning: function () {
      let count = this.options[this.value.partitionType].count;
      let array = this.value.partitions;

      if (count > array.length) {
        for (let i = array.length; i < count; i++) {
          array.push(createPartition(i));
        }
      } else {
        while (count < array.length) {
          array.pop();
        }
      }
      this.$emit('input', this.value);
    },
    select: function (event) {
      this.$emit('select', event);
    }
  },
  template: `
    <div>
      <div>
        <label>Partition</label>
        <select v-model="value.partitionType" @change="updatePartitionning">
          <option v-for="option in options" :value="option.id">{{option.label}}</option>
        </select>
      </div>
      <div v-for="partition in value.partitions" class="flex-container">
        <p>{{ partition.number + 1 }}</p>
        <field-editor
          v-model="partition.model"
          :key="partition.number"
          @input="$emit('input', value)"
          @select="select"
        >
        </field-editor>
      </div>
    </div>
    `
});