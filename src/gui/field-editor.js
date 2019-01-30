Vue.component('field-editor', {
  props: ["value"],
  methods: {
    update: function (event) {
      this.$emit("input", this.value);
    },
    changeType: function (event) {
      this.update();
    },
    select: function (event) {
      this.$emit('select', event);
    }
  },
  template: `
    <div>
      <input type="radio" v-model="value.type" value="simple">
      <label>Simple</label>
      <input type="radio" v-model="value.type" value="partition">
      <label>Partition</label>
      
      <simple-field-editor
        v-if="value.type === 'simple'"
        v-model="value.simple"
        @input="$emit('input', value)"
        @select="select"
      ></simple-field-editor>
      
      <partition-field-editor
        v-else-if="value.type === 'partition'"
        v-model="value.partition"
        @input="$emit('input', value)"
        @select="select"
      ></partition-field-editor>

    </div>
    `
});