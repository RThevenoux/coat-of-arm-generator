<template>
  <div class="flex-container">
    <select v-model="value.type" @change="update">
      <option value="strip">Bandeau</option>
      <option value="cross">Croix</option>
      <option value="symbol">Symbole</option>
    </select>
    <div v-if="value.type === 'strip'" class="flex-container">
      <select v-model="value.strip.angle" @change="update" key="strip-angle">
        <option value="0">en fasce</option>
        <option value="45">en barre</option>
        <option value="90">en pal</option>
        <option value="135">en bande</option>
      </select>
      <input
        v-model.number="value.strip.count"
        type="number"
        @input="update"
        key="strip-number"
      />
      <FillerPicker
        v-model="value.strip.filler"
        @input="update"
        key="strip-filler"
        @select="select"
      ></FillerPicker>
    </div>
    <div v-else-if="value.type === 'cross'" class="flex-container">
      <select v-model="value.cross.angle" @change="update" key="cross-angle">
        <option value="0">droite</option>
        <option value="45">sautoir</option>
      </select>
      <FillerPicker
        v-model="value.cross.filler"
        @input="update"
        key="cross-filler"
        @select="select"
      ></FillerPicker>
    </div>
    <div v-else-if="value.type === 'symbol'" class="flex-container">
      <select
        v-model="value.symbol.chargeId"
        @change="update"
        key="symbol-charge"
      >
        <option
          v-for="option in chargeOptions"
          :value="option.id"
          :key="option.id"
        >
          {{ option.label }}
        </option>
      </select>
      <input
        v-model.number="value.symbol.count"
        type="number"
        @input="update"
        key="symbol-number"
      />
      <FillerPicker
        v-model="value.symbol.filler"
        @input="update"
        key="symbol-filler"
        @select="select"
      ></FillerPicker>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { SingleChargePickerModel } from "./SingleChargePickerModel";
import { getChargeOptions } from "../service/ChargeService";
import FillerPicker from "./FillerPicker.vue";
import { FillerPickerSelectedEvent } from "./FillerPickerSelected";
import { MyOption } from "../service/MyOptions.type";

@Component({
  components: {
    FillerPicker,
  },
})
export default class SingleChargePicker extends Vue {
  @Prop() value!: SingleChargePickerModel;

  chargeOptions: MyOption[] = [];

  async created(): Promise<void> {
    this.chargeOptions = await getChargeOptions();
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