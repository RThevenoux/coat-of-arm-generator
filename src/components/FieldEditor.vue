<template>
  <div>
    <input type="radio" v-model="value.type" value="simple" />
    <label>Simple</label>
    <input type="radio" v-model="value.type" value="partition" />
    <label>Partition</label>

    <SimpleFieldEditor
      v-if="value.type === 'simple'"
      v-model="value.simple"
      @input="$emit('input', value)"
      @select="select"
    ></SimpleFieldEditor>

    <PartitionFieldEditor
      v-else-if="value.type === 'partition'"
      v-model="value.partition"
      @input="$emit('input', value)"
      @select="select"
    ></PartitionFieldEditor>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FieldEditorModel } from "./FieldEditorModel";
import { FillerPickerSelectedEvent } from "./FillerPickerSelected";
import SimpleFieldEditor from "./SimpleFieldEditor.vue";

@Component({
  components: {
    SimpleFieldEditor,
    PartitionFieldEditor: () => import("./PartitionFieldEditor.vue"),
  },
})
export default class FieldEditor extends Vue {
  @Prop() value!: FieldEditorModel;

  update(): void {
    this.$emit("input", this.value);
  }

  changeType(): void {
    this.update();
  }

  select(event: FillerPickerSelectedEvent): void {
    this.$emit("select", event);
  }
}
</script>

<style scoped></style>
