<template>
  <div class="hello">
    <h3>Configuration</h3>

    <select v-model="value.escutcheon" @change="update">
      <option
        v-for="escutcheon in escutcheonOptions"
        :value="escutcheon.id"
        :key="escutcheon.id"
      >
        {{ escutcheon.label }}
      </option>
    </select>

    <select v-model="value.palette" @change="update">
      <option
        v-for="palette in paletteOptions"
        :value="palette.id"
        :key="palette.id"
      >
        {{ palette.label }}
      </option>
    </select>

    <div>
      <input type="checkbox" v-model="value.reflect" @change="update" />
      <label>Reflect effect</label>
    </div>

    <div>
      <label>Bordure écu</label>
      <input
        v-model.number="value.border.size"
        type="number"
        @change="update"
      />
    </div>

    <div>
      <label>Bordure meubles</label>
      <input
        v-model.number="value.defaultStrokeSize"
        type="number"
        @change="update"
      />
    </div>

    <div>
      <label>Taille</label>
      <input
        v-model.number="value.outputSize.width"
        type="number"
        @change="update"
      />
      <label>×</label>
      <input
        v-model.number="value.outputSize.height"
        type="number"
        @change="update"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { getPalettes } from "../service/PaletteService";
import { getEscutcheons } from "../service/EscutcheonService";
import { VisualConfModel } from "../generator/visual/VisualConfModel";

@Component
export default class VisualConf extends Vue {
  @Prop() value!: VisualConfModel;

  private paletteOptions = getPalettes();
  private escutcheonOptions = getEscutcheons();

  update(): void {
    this.$emit("input", this.value);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
