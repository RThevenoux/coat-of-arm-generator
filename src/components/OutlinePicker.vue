<template>
  <select v-bind:value="value" @change="$emit('input', $event.target.value)">
    <option v-for="option in options" :value="option.id" :key="option.id">
      {{ option.label }}
    </option>
  </select>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { OutlineId } from "../generator/model.type";
import { getOutlineOptions } from "../service/OutlineService";

@Component
export default class OutlinePicker extends Vue {
  @Prop() value!: OutlineId;

  private options = getOutlineOptions();
}
</script>

<style scoped></style>
