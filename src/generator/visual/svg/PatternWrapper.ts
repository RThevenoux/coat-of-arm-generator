import { XMLElement } from "xmlbuilder";
import { MyStyle } from "./MyStyle";
import SvgBuilder from "./SvgBuilder";
import { addPath, addRectangle, addUse } from "./SvgHelper";
import { SvgStyle } from "./svg.type";

export class PatternWrapper {
  private pathCount = 0;

  constructor(
    readonly root: SvgBuilder,
    readonly node: XMLElement,
    readonly id: string,
    readonly size: paper.Size
  ) {}

  addBackground(style: MyStyle): void {
    this.addRectangle(0, 0, this.size.width, this.size.height, style);
  }

  addRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    style: MyStyle
  ): void {
    const svgSyle = this.toSvgStyle(style);
    addRectangle(this.node, x, y, width, height, svgSyle);
  }

  addPath(pathData: string, style?: MyStyle): string {
    const id = this.nextPathId();
    const svgStyle = this.toSvgStyle(style);
    addPath(this.node, pathData, svgStyle, id);
    return id;
  }

  addUse(symbolId: string, transform: string, style?: MyStyle): void {
    const svgSyle = this.toSvgStyle(style);
    addUse(this.node, symbolId, svgSyle, transform);
  }

  private nextPathId() {
    return `${this.id}_path${this.pathCount++}`;
  }

  private toSvgStyle(myStyle?: MyStyle): SvgStyle | undefined {
    if (!myStyle) {
      return undefined;
    }

    const svg: SvgStyle = {};
    if (myStyle.border) {
      svg.strokeWidth = this.root.defaultStrokeWidth;
    }
    if (myStyle.colorId) {
      svg.color = this.root.palette.getColor(myStyle.colorId);
    } else if (myStyle.rawColor) {
      svg.color = myStyle.rawColor;
    }

    return svg;
  }
}
