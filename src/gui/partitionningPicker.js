import partitionDefaultValue from './partitionTool';

let options = require('./data/partitions.json');

let formattedOptions = {};
options.forEach(option => formattedOptions[option.id] = option);

function _initialValue() {
  let id = options[0].id;
  let count = formattedOptions[id].count;

  let array = [];
  for (let i = array.length; i < count; i++) {
    array.push(_initPartition(i));
  }

  return {
    type: id,
    partitions: array
  }
}

function _initPartition(id) {
  return {
    number: id,
    model: partitionDefaultValue()
  };
}

Vue.component('partitionnig-picker', {
  data: function () {
    return {
      options: formattedOptions,
      value: _initialValue(),
      fillerEditor: null
    }
  },
  methods: {
    updatePartitionning: function () {
      let count = this.options[this.value.type].count;
      let array = this.value.partitions;

      if (count > array.length) {
        for (let i = array.length; i < count; i++) {
          array.push(_initPartition(i));
        }
      } else {
        while (count < array.length) {
          array.pop();
        }
      }
      this.$emit('input', this.value);
    },
    select: function (event) {
      if (this.fillerEditor) {
        this.fillerEditor.state.isSelected = false;
      }
      this.fillerEditor = event.source;
      this.fillerEditor.state.isSelected = true;
    },
    updateFiller: function (event) {
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
      <partition-editor
        v-for="partition in value.partitions"
        v-model="partition.model"
        :key="partition.number"
        @input="$emit('input', value)"
        @select="select"
      >
      </partition-editor>
      <div>
        <h2>Filler Editor</h2>
        <div v-if="fillerEditor == null">
          <p>No selection yet. Click...</p>
        </div>
        <div v-else>
          <filler-picker v-model="fillerEditor.model.filler" @input="updateFiller"></filler-picker>
        </div>
      </div>
    </div>
    `
});