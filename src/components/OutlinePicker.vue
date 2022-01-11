<template>
  <select v-bind:value="value" @change="$emit('input', $event.target.value)">
    <option v-for="option in options" :value="option.id" :key="option.id">
      {{ option.label }}
    </option>
  </select>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { OutlineId } from "../model/charge";
import { MyOption } from "../service/MyOptions.type";
import { getOutlineOptions } from "../service/OutlineService";
import { getStraightOption } from "./OutlineTool";

@Component
export default class OutlinePicker extends Vue {
  @Prop() value!: OutlineId;
  @Prop() addStraightOption?: boolean;

  private options: MyOption[] = [];

  mounted(): void {
    if (this.addStraightOption) {
      this.options = [getStraightOption(), ...getOutlineOptions()];
    } else {
      this.options = getOutlineOptions();
    }
  }
}
</script>

<style scoped></style>
