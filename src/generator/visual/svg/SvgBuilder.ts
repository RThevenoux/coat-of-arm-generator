import * as paper from "paper";
import xmlBuilder from "xmlbuilder";
import { FillerModel, FillerPlein } from "../../model.type";
import { EscutcheonShape, SimpleShape, SymbolShape } from "../type";
import { ChargeVisualInfo } from "@/service/visual.type";
import {
  addPath,
  addPattern,
  addSymbol,
  addUse,
  createSVG,
  PatternTransform,
  refStyle,
  strokeStyle,
} from "./SvgHelper";
import { Palette } from "../Palette";
import { createPatternFiller } from "../filler/pattern-filler";
import { createDefaultFiller } from "../filler/default-filler";
import { createStripFiller } from "../filler/strip-filler";
import { createSemeFiller } from "../filler/seme-filler";
import { createPlainFiller } from "../filler/plain-filler";
import { createReflect } from "../filler/reflect";
import { PatternWrapper } from "./PatternWrapper";

export default class SvgBuilder {
  private readonly container: xmlBuilder.XMLElement;
  readonly defs: xmlBuilder.XMLElement;

  private patternCount = 0;
  private definedSolidFiller: Record<string, string> = {};
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
    const style = "fill:none;" + strokeStyle(borderSize);
    addUse(this.container, escutcheonId, undefined, style);
  }

  public addReflect(): void {
    const escutcheonId = this.getEscutcheonPathId();
    const gradienId = createReflect(
      this,
      this.escutcheon.path,
      "gradient-reflect"
    );
    const fill = refStyle(gradienId);
    addUse(this.container, escutcheonId, fill);
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
      addPath(this.defs, this.escutcheon.path.pathData, this.escutcheonPathId);
    }
    return this.escutcheonPathId;
  }

  public async fill(
    fillerModel: FillerModel | "none",
    shape: SimpleShape
  ): Promise<void> {
    const fillerId = await this._getFillerId(fillerModel, shape);
    const style = refStyle(fillerId);
    addPath(this.container, shape.path.pathData, undefined, style);
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

    const fillerId = await this._getFillerId(filler, symbolShape);

    const strokeWidth = this.defaultStrokeWidth / scaleCoef;
    const transform =
      `scale(${scaleCoef},${scaleCoef})` +
      ` translate(${position.x / scaleCoef},${position.y / scaleCoef})`;

    const group = this.container.ele("g");
    group
      .raw(symbolDef.xml)
      .att("transform", transform)
      .att("fill", refStyle(fillerId))
      .att("style", strokeStyle(strokeWidth));
  }

  private async _getFillerId(
    model: FillerModel | "none",
    container: SimpleShape | SymbolShape
  ): Promise<string> {
    if (!model || model == "none" || !model.type) {
      return this._getDefaultFiller();
    }
    switch (model.type) {
      case "pattern":
        return createPatternFiller(this, model, container);
      case "plein":
        return this._getSolidFiller(model);
      case "seme":
        return createSemeFiller(this, model, container);
      case "strip":
        return createStripFiller(this, model, container);
      case "invalid":
      default:
        console.log("Unsupported-filler-type:" + model.type);
        return this._getDefaultFiller();
    }
  }

  private _getDefaultFiller(): string {
    if (!this.defaultFillerId) {
      this.defaultFillerId = createDefaultFiller(this);
    }
    return this.defaultFillerId;
  }

  private _getSolidFiller(model: FillerPlein): string {
    const key = model.color;
    let fillerId = this.definedSolidFiller[key];
    if (!fillerId) {
      fillerId = createPlainFiller(this, model, `solid-${key}`);
      this.definedSolidFiller[key] = fillerId;
    }
    return fillerId;
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
