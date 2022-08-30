<template>
  <div class="flex-container">
    <select v-model="value.angle" @change="update" key="angle">
      <option value="fasce">en fasce</option>
      <option value="barre">en barre</option>
      <option value="pal">en pal</option>
      <option value="bande">en bande</option>
    </select>
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
import { StripEditorModel } from "./StripModel";

@Component({
  components: {
    FillerPicker,
  },
})
export default class StripMainEditor extends Vue {
  @Prop() value!: StripEditorModel;

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
