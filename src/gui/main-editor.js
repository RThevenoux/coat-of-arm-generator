Vue.component('main-editor', {
  data: function () {
    return {
      selectedState: null,
      fillerModel: null
    }
  },
  props: ['value'],
  methods: {
    select: function (event) {
      // Flip selected state of old and new picker
      if (this.selectedState) {
        this.selectedState.isSelected = false;
      }
      this.selectedState = event.source.state;
      this.selectedState.isSelected = true;

      // Change fillerModel from old to new
      this.fillerModel = event.source.model;
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
        <div v-if="fillerModel == null">
          <p>No selection yet. Click...</p>
        </div>
        <div v-else>
          <filler-editor v-model="fillerModel" @input="update"></filler-editor>
        </div>
      </div>
    </div>
  `
});