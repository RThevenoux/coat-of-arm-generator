<template>
  <div>
    <FillerPicker v-model="value.filler" @select="select"></FillerPicker>
    <div class="flex-container">
      <label>Border</label>
      <input type="checkbox" v-model="value.border.present" />
      <FillerPicker
        v-model="value.border.filler"
        @select="select"
        v-show="value.border.present"
      ></FillerPicker>
    </div>
    <MultiChargePicker
      v-model="value.charges"
      @input="update"
      @select="select"
    ></MultiChargePicker>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { SimpleFieldEditorModel } from "./SimpleFieldEditorModel";
import SimpleFieldEditor from "./SimpleFieldEditor.vue";
import FillerPicker from "./FillerPicker.vue";
import MultiChargePicker from "./MultiChargePicker.vue";
import { FillerPickerSelectedEvent } from "./FillerPickerSelected";

@Component({
  components: {
    SimpleFieldEditor,
    FillerPicker,
    MultiChargePicker,
  },
})
export default class FieldEditor extends Vue {
  @Prop() value!: SimpleFieldEditorModel;

  update(): void {
    this.$emit("input", this.value);
  }
  select(event: FillerPickerSelectedEvent): void {
    this.$emit("select", event);
  }
}
</script>

<style scoped></style>
