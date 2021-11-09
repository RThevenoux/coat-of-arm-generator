<template>
  <div @click="click" v-bind:class="{ selected: state.isSelected }">
    [Edit-filler {{ value.type }}]
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FillerEditorModel } from "./FillerEditorModel";
import { FillerPickerState } from "./FillerPickerModel";
import { FillerPickerSelectedEvent } from "./FillerPickerSelected";

@Component
export default class FieldEditor extends Vue {
  @Prop() value!: FillerEditorModel;

  state: FillerPickerState = {
    isSelected: false,
  };

  click(): void {
    const emitEvent: FillerPickerSelectedEvent = {
      type: "filler-picker",
      source: {
        state: this.state,
        model: this.value,
      },
    };
    this.$emit("select", emitEvent);
  }
}
</script>

<style scoped>
.selected {
  background-color: lightskyblue;
}
</style>
