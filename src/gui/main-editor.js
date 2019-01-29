Vue.component('main-editor', {
  data: function () {
    return {
      fillerEditor: null
    }
  },
  props: ['value'],
  methods: {
    select: function (event) {
      if (this.fillerEditor) {
        this.fillerEditor.state.isSelected = false;
        this.fillerEditor = null;
      }
      this.fillerEditor = event.source;
      this.fillerEditor.state.isSelected = true;
    },
    update: function (event) {
      this.$emit("input", this.value);
    }
  },
  template: `
    <div>
      <partitionning-picker
        v-model="value"
        @input="update"
        @select="select"
      >
      </partitionning-picker>
      <div>
        <h2>Filler Editor</h2>
        <div v-if="fillerEditor == null">
          <p>No selection yet. Click...</p>
        </div>
        <div v-else>
          <filler-picker v-model="fillerEditor.model.filler" @input="update"></filler-picker>
        </div>
      </div>
    </div>
  `
});