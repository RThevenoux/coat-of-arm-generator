<template>
  <div>
    <FieldEditor v-model="value" @input="update"></FieldEditor>
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
import { FillerEditorModel } from "./FillerEditorModel";
import { EditorStoreListener } from "../store/EditorStoreListener";
import {
  addEditorStoreListener,
  getSelectedFillerModel,
} from "../store/EditorStore";

@Component({
  components: {
    FieldEditor,
    FillerEditor,
  },
})
export default class RootEditor extends Vue implements EditorStoreListener {
  @Prop() value!: FieldEditorModel;

  fillerModel: FillerEditorModel | null = null;

  created(): void {
    addEditorStoreListener(this);
  }

  public editorStoreUpdated(): void {
    const newModel = getSelectedFillerModel();
    this.fillerModel = newModel ? newModel : null;
  }

  update(): void {
    this.$emit("input", this.value);
  }
}
</script>
