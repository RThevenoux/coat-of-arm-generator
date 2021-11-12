<template>
  <div class="flex-container">
    <div>
      <h3>Style</h3>
      <div>
        <input
          type="radio"
          v-model="value.type"
          value="plein"
          @change="update"
        />
        <label>Plein</label>
      </div>

      <div class="flex-container" style="background-color: #d8d8d8">
        <input
          type="radio"
          v-model="value.type"
          value="pattern"
          @change="update"
        />
        <p>Pavage</p>
        <div>
          <div>
            <input
              type="radio"
              v-model="value.patternName"
              value="echiquete"
              @change="update"
            />
            <label>Échiqueté</label>
          </div>
          <div>
            <input
              type="radio"
              v-model="value.patternName"
              value="losange"
              @change="update"
            />
            <label>Losangé</label>
          </div>
          <div>
            <input
              type="radio"
              v-model="value.patternName"
              value="triangle"
              @change="update"
            />
            <label>Trianglé</label>
          </div>
          <div>
            <input
              type="radio"
              v-model="value.patternName"
              value="fusele"
              @change="update"
            />
            <label>Fuselé</label>
            <select v-model="value.patternAngle" @change="update">
              <option value="defaut">défaut</option>
              <option value="bande">en bande</option>
              <option value="barre">en barre</option>
            </select>
          </div>
        </div>
        <div>
          <div v-for="option of vairOptions" :key="option.id">
            <input
              type="radio"
              v-model="value.patternName"
              :value="option.id"
              @change="update"
            />
            <label>{{ option.label }}</label>
          </div>
        </div>
      </div>

      <div style="background-color: #fff">
        <input
          type="radio"
          v-model="value.type"
          value="seme"
          @change="update"
        />
        <label>Semé de : </label>
        <select v-model="value.semeChargeId" @change="update">
          <option
            v-for="option in chargeOptions"
            :value="option.id"
            :key="option.id"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div style="background-color: #d8d8d8">
        <input
          type="radio"
          v-model="value.type"
          value="strip"
          @change="update"
        />
        <select v-model="value.stripAngle" @change="update">
          <option value="0">fascé</option>
          <option value="45">barré</option>
          <option value="90">palé</option>
          <option value="135">bandé</option>
        </select>

        <input
          v-model.number="value.stripCount"
          type="number"
          @input="update"
        />
      </div>
    </div>
    <div>
      <h3>Couleurs</h3>
      <div v-if="color1Label">
        <label>{{ color1Label }}</label>
        <ColorPicker v-model="value.color1" @input="update"></ColorPicker>
      </div>
      <div v-if="color2Label">
        <label>{{ color2Label }}</label>
        <ColorPicker v-model="value.color2" @input="update"></ColorPicker>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getChargeOptions } from "../service/ChargeService";
import { MyOption } from "../service/MyOptions.type";
import ColorPicker from "./ColorPicker.vue";
import { FillerEditorModel } from "./FillerEditorModel";

@Component({
  components: {
    ColorPicker,
  },
})
export default class FieldEditor extends Vue {
  @Prop() value!: FillerEditorModel;

  chargeOptions: MyOption[] = [];
  vairOptions = [
    { id: "vair", label: "Vair" },
    { id: "contrevair", label: "Contre-vair" },
    { id: "vair_en_pal", label: "Vair en pal" },
    { id: "vair_en_pointe", label: "Vair en pointe" },
  ];

  get color1Label(): string {
    switch (this.value.type) {
      case "plein":
        return "Couleur";
      case "seme":
        return "Couleur champs";
      case "pattern":
      case "strip":
        return "Couleur 1";
      case "none":
      default:
        return null;
    }
  }

  get color2Label(): string {
    switch (this.value.type) {
      case "seme":
        return "Couleur meuble";
      case "pattern":
      case "strip":
        return "Couleur 2";
      case "plein":
      case "none":
      default:
        return null;
    }
  }

  async mounted(): Promise<void> {
    this.chargeOptions = await getChargeOptions();
  }

  update(): void {
    this.$emit("input", this.value);
  }
}
</script>

<style scoped>
.selected {
  background-color: lightskyblue;
}
</style>
