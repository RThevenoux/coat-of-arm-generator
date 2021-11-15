<template>
  <button @click="click" v-bind:class="{ selected: state.isSelected }">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      version="1.1"
      id="svg4"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:svg="http://www.w3.org/2000/svg"
    >
      <path
        :style="colors.color1"
        d="m 9.2,4.7 -7,7 c -0.9,0.9 1.3,4.4 3.2,5.7 L 13,10 Z"
        id="color1"
      />
      <path
        :style="colors.color2"
        d="M 13,10 5.3,17.6 C 6.7,19.0 9.1,21.1 11.3,21.0 l 7.1,-7.1 z"
        id="color2"
      />
      <path
        d="M21.143 9.667c-.733-1.392-1.914-3.05-3.617-4.753-2.977-2.978-5.478-3.914-6.785-3.914-.414 0-.708.094-.86.246l-1.361 1.36c-1.899-.236-3.42.106-4.294.983-.876.875-1.164 2.159-.792 3.523.492 1.806 2.305 4.049 5.905 5.375.038.323.157.638.405.885.588.588 1.535.586 2.121 0s.588-1.533.002-2.119c-.588-.587-1.537-.588-2.123-.001l-.17.256c-2.031-.765-3.395-1.828-4.232-2.9l3.879-3.875c.496 2.73 6.432 8.676 9.178 9.178l-7.115 7.107c-.234.153-2.798-.316-6.156-3.675-3.393-3.393-3.175-5.271-3.027-5.498l1.859-1.856c-.439-.359-.925-1.103-1.141-1.689l-2.134 2.131c-.445.446-.685 1.064-.685 1.82 0 1.634 1.121 3.915 3.713 6.506 2.764 2.764 5.58 4.243 7.432 4.243.648 0 1.18-.195 1.547-.562l8.086-8.078c.91.874-.778 3.538-.778 4.648 0 1.104.896 1.999 2 1.999 1.105 0 2-.896 2-2 0-3.184-1.425-6.81-2.857-9.34zm-16.209-5.371c.527-.53 1.471-.791 2.656-.761l-3.209 3.206c-.236-.978-.049-1.845.553-2.445zm9.292 4.079l-.03-.029c-1.292-1.292-3.803-4.356-3.096-5.063.715-.715 3.488 1.521 5.062 3.096.862.862 2.088 2.247 2.937 3.458-1.717-1.074-3.491-1.469-4.873-1.462z"
        id="main"
      />
    </svg>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ColorId } from "../generator/model.type";
import { PaletteData } from "../service/visual.type";
import { FillerEditorModel } from "./FillerEditorModel";
import { FillerPickerState } from "./FillerPickerModel";
import { FillerPickerSelectedEvent } from "./FillerPickerSelected";

const palette: PaletteData = {
  or: "ff0",
  argent: "fff",
  sable: "000",
  azur: "00f",
  sinople: "0f0",
  gueules: "f00",
  pourpre: "f0f",
};
const defaultColor = "888";

interface IconColors {
  color1: string;
  color2: string;
}

@Component
export default class FieldEditor extends Vue {
  @Prop() value!: FillerEditorModel;

  state: FillerPickerState = {
    isSelected: false,
  };

  get colors(): IconColors {
    switch (this.value.type) {
      case "plein":
        return this.getColorFillers(this.value.color1, this.value.color1);
      case "seme":
      case "pattern":
      case "strip":
        return this.getColorFillers(this.value.color1, this.value.color2);
      case "none":
      default:
        return this.formatFiller("666", "aaa");
    }
  }

  private formatFiller(color1: string, color2: string): IconColors {
    return { color1: `fill: #${color1}`, color2: `fill: #${color2}` };
  }

  private getColorFillers(colorId1: ColorId, colorId2: ColorId): IconColors {
    const color1 = this.palette(colorId1);
    const color2 = this.palette(colorId2);
    return this.formatFiller(color1, color2);
  }

  private palette(colorId: ColorId): string {
    const color = palette[colorId];
    if (color) {
      return color;
    } else {
      return defaultColor;
    }
  }

  click(): void {
    const emitEvent: FillerPickerSelectedEvent = {
      type: "filler-picker",
      source: {
        state: this.state,
        model: this.value,
      },
    };
    this.$emit("select", emitEvent);
  }
}
</script>

<style scoped>
.selected {
  background-color: lightskyblue;
}
</style>
