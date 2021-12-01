import * as paper from "paper";
import xmlBuilder from "xmlbuilder";
import { FillerModel } from "../../model.type";
import { EscutcheonShape, SimpleShape, SymbolShape } from "../type";
import { ChargeVisualInfo } from "@/service/visual.type";
import {
  addPath,
  addPattern,
  addStyle,
  addSymbol,
  addUse,
  createSVG,
} from "./SvgHelper";
import { Palette } from "../Palette";
import { createPatternFiller } from "../filler/pattern-filler";
import { createDefaultFiller } from "../filler/default-filler";
import { createStripFiller } from "../filler/strip-filler";
import { createSemeFiller } from "../filler/seme-filler";
import { createReflect } from "../filler/reflect";
import { PatternWrapper } from "./PatternWrapper";
import { PatternTransform, SvgStyle } from "./svg.type";

export default class SvgBuilder {
  private readonly container: xmlBuilder.XMLElement;
  readonly defs: xmlBuilder.XMLElement;

  private patternCount = 0;
  private definedSymbol: Record<string, string> = {};
  private defaultFillerId: string | null = null;
  private escutcheonPathId: string | null = null;

  constructor(
    private readonly escutcheon: EscutcheonShape,
    readonly palette: Palette,
    readonly defaultStrokeWidth: number
  ) {
    this.container = createSVG();

    // Create "defs" section
    this.defs = this.container.ele("defs");
  }

  public addBorder(borderSize: number): void {
    // Update escutcheonPath to compute viewBox on 'build()'
    this.escutcheon.path.strokeWidth = borderSize;
    this.escutcheon.path.strokeColor = new paper.Color("#000");

    // Add border to SVG
    const escutcheonId = this.getEscutcheonPathId();
    const style = { color: "none", strokeWidth: borderSize };
    addUse(this.container, escutcheonId, style);
  }

  public addReflect(): void {
    const escutcheonId = this.getEscutcheonPathId();
    const gradienId = createReflect(
      this,
      this.escutcheon.path,
      "gradient-reflect"
    );
    addUse(this.container, escutcheonId, { fillerId: gradienId });
  }

  public build(outputSize: { width: number; height: number }): string {
    const viewBox = this.escutcheon.path.strokeBounds;
    return this.container
      .att("width", outputSize.width)
      .att("height", outputSize.height)
      .att(
        "viewBox",
        `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`
      )
      .end();
  }

  public getEscutcheonPathId(): string {
    if (this.escutcheonPathId == null) {
      this.escutcheonPathId = "escutcheon";
      const style = {};
      addPath(
        this.defs,
        this.escutcheon.path.pathData,
        style,
        this.escutcheonPathId
      );
    }
    return this.escutcheonPathId;
  }

  public async fill(
    fillerModel: FillerModel | "none",
    shape: SimpleShape
  ): Promise<void> {
    const style = await this.getStyle(fillerModel, shape);
    addPath(this.container, shape.path.pathData, style);
  }

  public async drawSymbol(
    symbolDef: ChargeVisualInfo,
    position: paper.Point,
    scaleCoef: number,
    filler: FillerModel
  ): Promise<void> {
    const item = paper.project.importSVG(symbolDef.xml);
    const symbolShape: SymbolShape = {
      type: "symbol",
      item: item,
      root: this.escutcheon,
    };

    const style = await this.getStyle(filler, symbolShape);
    style.strokeWidth = this.defaultStrokeWidth / scaleCoef;

    const transform =
      `scale(${scaleCoef},${scaleCoef})` +
      ` translate(${position.x / scaleCoef},${position.y / scaleCoef})`;

    const group = this.container.ele("g");
    group.raw(symbolDef.xml).att("transform", transform);

    addStyle(group, style);
  }

  private async getStyle(
    model: FillerModel | "none",
    container: SimpleShape | SymbolShape
  ): Promise<SvgStyle> {
    if (!model || model == "none" || !model.type) {
      return this._getDefaultFiller();
    }
    switch (model.type) {
      case "plein": {
        const color = this.palette.getColor(model.color);
        return { color };
      }
      case "pattern": {
        const fillerId = createPatternFiller(this, model, container);
        return { fillerId };
      }
      case "seme": {
        const fillerId = await createSemeFiller(this, model, container);
        return { fillerId };
      }
      case "strip": {
        const fillerId = createStripFiller(this, model, container);
        return { fillerId };
      }
      case "invalid":
      default:
        console.log("Unsupported-filler-type:" + model.type);
        return this._getDefaultFiller();
    }
  }

  private _getDefaultFiller(): SvgStyle {
    if (!this.defaultFillerId) {
      this.defaultFillerId = createDefaultFiller(this);
    }
    return { fillerId: this.defaultFillerId };
  }

  private nextPatternId(): string {
    return `pattern${this.patternCount++}`;
  }

  public getSymbolId(symbolDef: ChargeVisualInfo): string {
    let symbolId = this.definedSymbol[symbolDef.id];
    if (!symbolId) {
      symbolId = `symbol_${symbolDef.id}`;
      this.definedSymbol[symbolDef.id] = symbolId;
      addSymbol(this.defs, symbolId, symbolDef);
    }
    return symbolId;
  }

  public createPattern(
    width: number,
    height: number,
    transform?: PatternTransform
  ): PatternWrapper {
    const id = this.nextPatternId();
    const size = new paper.Size(width, height);

    const node = addPattern(this.defs, id, width, height, transform);
    return new PatternWrapper(this, node, id, size);
  }
}
