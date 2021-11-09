<template>
  <div>
    <FieldEditor v-model="value" @input="update" @select="select">
    </FieldEditor>
    <div>
      <h2>Filler Editor</h2>
      <div v-if="fillerModel == null">
        <p>No selection yet. Click...</p>
      </div>
      <div v-else>
        <FillerEditor v-model="fillerModel" @input="update"></FillerEditor>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FieldEditor from "./FieldEditor.vue";
import FillerEditor from "./FillerEditor.vue";
import { FieldEditorModel } from "./FieldEditorModel";
import { FillerPickerState } from "./FillerPickerModel";
import { FillerEditorModel } from "./FillerEditorModel";
import { FillerPickerSelectedEvent } from "./FillerPickerSelected";

@Component({
  components: {
    FieldEditor,
    FillerEditor,
  },
})
export default class RootEditor extends Vue {
  @Prop() value!: FieldEditorModel;

  selectedState: FillerPickerState | null = null;
  fillerModel: FillerEditorModel | null = null;

  select(event: FillerPickerSelectedEvent): void {
    // Flip selected state of old and new picker
    if (this.selectedState) {
      this.selectedState.isSelected = false;
    }
    this.selectedState = event.source.state;
    this.selectedState.isSelected = true;

    // Change fillerModel from old to new
    this.fillerModel = event.source.model;
  }

  update(): void {
    this.$emit("input", this.value);
  }
}
</script>
