import { ColorId } from "@/generator/model.type";
import { XMLElement } from "xmlbuilder";
import SvgBuilder from "./SvgBuilder";
import { addRectangle } from "./SvgHelper";

export class PatternWrapper {
  constructor(
    readonly root: SvgBuilder,
    readonly node: XMLElement,
    readonly id: string,
    readonly size: paper.Size
  ) {}

  addBackground(colorId: ColorId): void {
    this.addRectangle(0, 0, this.size.width, this.size.width, colorId);
  }

  addRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    colorId: ColorId
  ): void {
    const color = this.root.palette.getColor(colorId);
    this.addRectangleRawColor(x, y, width, height, color);
  }

  addRectangleRawColor(
    x: number,
    y: number,
    width: number,
    height: number,
    rawColor: string
  ): void {
    addRectangle(this.node, x, y, width, height, rawColor);
  }
}
