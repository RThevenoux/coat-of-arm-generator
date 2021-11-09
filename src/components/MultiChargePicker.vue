<template>
  <div>
    <div v-for="charge in value" :key="charge.id">
      <div class="flex-container">
        <button @click="remove(charge.id)">(-)</button>
        <SingleChargePicker
          v-model="charge.model"
          @input="update"
          @select="select"
        ></SingleChargePicker>
      </div>
    </div>
    <button @click="add">(+)</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { SingleChargePickerModel } from "./SingleChargePickerModel";
import { initialChargeModel } from "./EditorTool";
import SingleChargePicker from "./SingleChargePicker.vue";
import { FillerPickerSelectedEvent } from "./FillerPickerSelected";

@Component({
  components: {
    SingleChargePicker,
  },
})
export default class MultiChargePicker extends Vue {
  @Prop() value!: { id: number; model: SingleChargePickerModel }[];

  currentIndex = 0;

  private nextId(): number {
    return this.currentIndex++;
  }

  async add(): Promise<void> {
    const newCharge = {
      id: this.nextId(),
      model: await initialChargeModel(),
    };
    this.value.push(newCharge);
    this.update();
  }

  remove(idToRemove: number): void {
    let index = 0;
    while (index < this.value.length) {
      if (this.value[index].id == idToRemove) {
        this.value.splice(index, 1);
        this.update();
        return;
      } else {
        ++index;
      }
    }
  }

  update(): void {
    this.$emit("input", this.value);
  }

  select(event: FillerPickerSelectedEvent): void {
    this.$emit("select", event);
  }
}
</script>

<style scoped></style>
