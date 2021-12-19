<template>
  <div class="flex-container">
    <div>
      <h3>Style</h3>
      <div>
        <input
          :id="uuid + '-plain'"
          type="radio"
          v-model="value.type"
          value="plein"
          @change="update"
        />
        <label :for="uuid + '-plain'">Plein</label>
      </div>

      <div class="flex-container" style="background-color: #d8d8d8">
        <input
          :id="uuid + '-pattern'"
          type="radio"
          v-model="value.type"
          value="pattern"
          @change="update"
        />
        <label :for="uuid + '-pattern'">Pavage</label>
        <div>
          <div>
            <input
              :id="uuid + '-echiquete'"
              type="radio"
              v-model="value.patternName"
              value="echiquete"
              @change="update"
            />
            <label :for="uuid + '-echiquete'">Échiqueté</label>
          </div>
          <div>
            <input
              :id="uuid + '-losange'"
              type="radio"
              v-model="value.patternName"
              value="losange"
              @change="update"
            />
            <label :for="uuid + '-losange'">Losangé</label>
          </div>
          <div>
            <input
              :id="uuid + '-triangle'"
              type="radio"
              v-model="value.patternName"
              value="triangle"
              @change="update"
            />
            <label :for="uuid + '-triangle'">Trianglé</label>
          </div>
          <div>
            <input
              :id="uuid + '-fusele'"
              type="radio"
              v-model="value.patternName"
              value="fusele"
              @change="update"
            />
            <label :for="uuid + '-fusele'">Fuselé</label>
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
              :id="uuid + '-vair-' + option.id"
              type="radio"
              v-model="value.patternName"
              :value="option.id"
              @change="update"
            />
            <label :for="uuid + '-vair-' + option.id">{{ option.label }}</label>
          </div>
        </div>
      </div>

      <div style="background-color: #fff">
        <input
          :id="uuid + '-seme'"
          type="radio"
          v-model="value.type"
          value="seme"
          @change="update"
        />
        <label :for="uuid + '-seme'">Semé de : </label>
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
          <option value="fasce">fascé</option>
          <option value="barre">barré</option>
          <option value="pal">palé</option>
          <option value="bande">bandé</option>
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
import { v4 as uuidv4 } from "uuid";

@Component({
  components: {
    ColorPicker,
  },
})
export default class FieldEditor extends Vue {
  @Prop() value!: FillerEditorModel;
  uuid = uuidv4();

  chargeOptions: MyOption[] = [];
  vairOptions = [
    { id: "vair", label: "Vair" },
    { id: "contrevair", label: "Contre-vair" },
    { id: "vair_en_pal", label: "Vair en pal" },
    { id: "vair_en_pointe", label: "Vair en pointe" },
  ];

  get color1Label(): string | null {
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

  get color2Label(): string | null {
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
