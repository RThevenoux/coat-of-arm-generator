<template>
  <div>
    <div>
      <input type="radio" v-model="value.type" value="plein" @change="update" />
      <label>Plein</label>
      <ColorPicker v-model="value.pleinColor" @input="update"></ColorPicker>
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
        <div>
          <input
            type="radio"
            v-model="value.patternName"
            value="vair"
            @change="update"
          />
          <label>Vair</label>
        </div>
        <div>
          <input
            type="radio"
            v-model="value.patternName"
            value="contrevair"
            @change="update"
          />
          <label>Contre-vair</label>
        </div>
        <div>
          <input
            type="radio"
            v-model="value.patternName"
            value="vair_en_pal"
            @change="update"
          />
          <label>Vair en pal</label>
        </div>
        <div>
          <input
            type="radio"
            v-model="value.patternName"
            value="vair_en_pointe"
            @change="update"
          />
          <label>Vair en pointe</label>
        </div>
      </div>
      <div>
        <div>
          <ColorPicker
            v-model="value.patternColor1"
            @input="update"
          ></ColorPicker>
        </div>
        <div>
          <ColorPicker
            v-model="value.patternColor2"
            @input="update"
          ></ColorPicker>
        </div>
      </div>
    </div>

    <div class="flex-container" style="background-color: #fff">
      <p>Semé</p>

      <input type="radio" v-model="value.type" value="seme" @change="update" />

      <select v-model="value.semeChargeId" @change="update">
        <option
          v-for="option in chargeOptions"
          :value="option.id"
          :key="option.id"
        >
          {{ option.label }}
        </option>
      </select>

      <label>Couleur champs</label>
      <ColorPicker v-model="value.semeFieldColor" @input="update"></ColorPicker>

      <label>Couleur meuble</label>
      <ColorPicker
        v-model="value.semeChargeColor"
        @input="update"
      ></ColorPicker>
    </div>

    <div style="background-color: #d8d8d8">
      <input type="radio" v-model="value.type" value="strip" @change="update" />
      <select v-model="value.stripAngle" @change="update">
        <option value="0">fascé</option>
        <option value="45">barré</option>
        <option value="90">palé</option>
        <option value="135">bandé</option>
      </select>
      <ColorPicker v-model="value.stripColor1" @input="update"></ColorPicker>
      <ColorPicker v-model="value.stripColor2" @input="update"></ColorPicker>
      <input v-model.number="value.stripCount" type="number" @input="update" />
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
