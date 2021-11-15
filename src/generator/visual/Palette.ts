import { PaletteData } from "@/service/visual.type";
import { ColorId } from "../model.type";

export class Palette {
  constructor(readonly data: PaletteData) {}

  public getColor(colorId: ColorId): string {
    const value = this.data[colorId];
    // TODO manage case value==null / undefined
    return `#${value}`;
  }
}
