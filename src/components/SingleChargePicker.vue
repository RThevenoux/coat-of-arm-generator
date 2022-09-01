<template>
  <div>
    <div class="flex-container">
      <!-- Selector -->
      <select v-model="value.type" @change="update">
        <option value="strip">Bandeau</option>
        <option value="cross">Croix</option>
        <option value="symbol">Symbole</option>
      </select>

      <!-- Strip Main (details below) -->
      <StripMainEditor
        v-if="value.type === 'strip'"
        v-model="value.strip"
        @input="update"
        @switchDetails="switchStripDetails"
      >
      </StripMainEditor>

      <!-- Cross -->
      <div v-else-if="value.type === 'cross'" class="flex-container">
        <select
          v-model="value.cross.diagonal"
          @change="update"
          key="cross-angle"
        >
          <option value="false">droite</option>
          <option value="true">sautoir</option>
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

      <!-- Symbol -->
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

    <template v-if="value.type === 'strip'">
      <!-- Strip Details ('main' above) -->
      <StripDetailsEditor
        v-if="showStripDetails"
        v-model="value.strip"
        @input="update"
      >
      </StripDetailsEditor>

      <!-- Strip companion -->
      <div class="flex-container">
        <input
          type="checkbox"
          v-model="value.strip.companion.present"
          @change="update"
          :id="uuid + '-companion-checkbox'"
        />
        <label :for="uuid + '-companion-checkbox'">Accompagné</label>

        <StripCompanionEditor
          v-if="value.strip.companion.present"
          v-model="value.strip.companion"
          @input="update"
          @switchDetails="switchStripCompanionDetails"
        >
        </StripCompanionEditor>
      </div>
      <StripDetailsEditor
        v-if="value.strip.companion.present && showStripComponionDetails"
        v-model="value.strip.companion"
        @input="update"
      >
      </StripDetailsEditor>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { SingleChargePickerModel } from "./SingleChargePickerModel";
import { getChargeOptions } from "../service/ChargeService";
import FillerPicker from "./FillerPicker.vue";
import StripDetailsEditor from "./strip/StripDetailsEditor.vue";
import StripMainEditor from "./strip/StripMainEditor.vue";
import StripCompanionEditor from "./strip/StripCompanionEditor.vue";
import { MyOption } from "../service/MyOptions.type";
import { v4 as uuidv4 } from "uuid";

@Component({
  components: {
    FillerPicker,
    StripMainEditor,
    StripDetailsEditor,
    StripCompanionEditor,
  },
})
export default class SingleChargePicker extends Vue {
  @Prop() value!: SingleChargePickerModel;

  chargeOptions: MyOption[] = [];
  uuid = uuidv4();
  showStripDetails = false;
  showStripComponionDetails = false;

  async created(): Promise<void> {
    this.chargeOptions = await getChargeOptions();
  }

  switchStripDetails(): void {
    this.showStripDetails = !this.showStripDetails;
  }

  switchStripCompanionDetails(): void {
    this.showStripComponionDetails = !this.showStripComponionDetails;
  }

  update(): void {
    this.$emit("input", this.value);
  }
}
</script>

<style scoped></style>
