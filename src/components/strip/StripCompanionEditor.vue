<template>
  <div class="flex-container">
    <select v-model="value.size" @change="update" key="size">
      <option value="default">standard</option>
      <option value="reduced">réduit</option>
      <option value="minimal">filet</option>
      <option value="gemel">jumelles</option>
      <option value="triplet">tierces</option>
    </select>
    <input
      v-model.number="value.count"
      type="number"
      @input="update"
      key="count"
      size="2"
    />
    <FillerPicker
      v-model="value.filler"
      @input="update"
      key="strip-filler"
    ></FillerPicker>
    <button @click="$emit('switchDetails', $event.target.value)">v</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import FillerPicker from "../FillerPicker.vue";
import { StripEditorCoreModel } from "./StripModel";

@Component({
  components: {
    FillerPicker,
  },
})
export default class StripCompanionEditor extends Vue {
  @Prop() value!: StripEditorCoreModel;

  update(): void {
    if (
      this.value.outlineType == "gemel-potented" &&
      this.value.size !== "gemel"
    ) {
      this.value.outlineType = "straight";
    }

    this.$emit("input", this.value);
  }
}
</script>
