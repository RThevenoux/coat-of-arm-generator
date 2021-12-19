<template>
  <div>
    <div class="flex-container">
      <select v-model="value.type" @change="update">
        <option value="strip">Bandeau</option>
        <option value="cross">Croix</option>
        <option value="symbol">Symbole</option>
      </select>
      <StripMainEditor
        v-if="value.type === 'strip'"
        v-model="value.strip"
        @input="update"
        @switchDetails="switchStripDetails"
      >
      </StripMainEditor>
      <div v-else-if="value.type === 'cross'" class="flex-container">
        <select v-model="value.cross.angle" @change="update" key="cross-angle">
          <option value="fasce">droite</option>
          <option value="barre">sautoir</option>
        </select>
        <select v-model="value.cross.size" @change="update" key="strip-size">
          <option value="default">standard</option>
          <option value="reduced">réduite</option>
          <option value="minimal">filet</option>
        </select>
        <FillerPicker
          v-model="value.cross.filler"
          @input="update"
          key="cross-filler"
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
          size="2"
        />
        <FillerPicker
          v-model="value.symbol.filler"
          @input="update"
          key="symbol-filler"
        ></FillerPicker>
      </div>
    </div>
    <StripDetailsEditor
      v-if="value.type === 'strip' && showStripDetails"
      v-model="value.strip"
      @input="update"
    >
    </StripDetailsEditor>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { SingleChargePickerModel } from "./SingleChargePickerModel";
import { getChargeOptions } from "../service/ChargeService";
import FillerPicker from "./FillerPicker.vue";
import StripDetailsEditor from "./StripDetailsEditor.vue";
import StripMainEditor from "./StripMainEditor.vue";
import { MyOption } from "../service/MyOptions.type";
import { v4 as uuidv4 } from "uuid";

@Component({
  components: {
    FillerPicker,
    StripMainEditor,
    StripDetailsEditor,
  },
})
export default class SingleChargePicker extends Vue {
  @Prop() value!: SingleChargePickerModel;

  chargeOptions: MyOption[] = [];
  uuid = uuidv4();
  showStripDetails = false;

  async created(): Promise<void> {
    this.chargeOptions = await getChargeOptions();
  }

  switchStripDetails(): void {
    this.showStripDetails = !this.showStripDetails;
  }

  update(): void {
    this.$emit("input", this.value);
  }
}
</script>

<style scoped></style>
