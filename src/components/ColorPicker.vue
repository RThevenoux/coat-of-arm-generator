<template>
  <select v-bind:value="value" @input="$emit('input', $event.target.value)">
    <option
      v-for="color in colorOptions"
      :value="color.id"
      :key="color.id"
      :style="'background: ' + color.background"
    >
      {{ color.label }}
    </option>
  </select>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getColorOptions } from "../service/ColorService";
import { ColorId } from "../model/misc";

@Component
export default class ColorPicker extends Vue {
  @Prop() value!: ColorId;

  private colorOptions = getColorOptions();
}
</script>

<style scoped></style>
