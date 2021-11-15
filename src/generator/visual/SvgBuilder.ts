import * as paper from "paper";
import xmlBuilder from "xmlbuilder";
import { getSemeVisualInfo } from "@/service/ChargeService";
import {
  FillerModel,
  FillerPattern,
  FillerSeme,
  FillerStrip,
} from "../model.type";
import { SimpleShape, SymbolShape } from "./type";
import { ChargeVisualInfo } from "@/service/visual.type";
import {
  addGradientStop,
  addPath,
  addPattern,
  addRadialGradient,
  addRectangle,
  addSolidGradient,
  addSymbol,
  addUse,
  createSVG,
  fillColorStyle,
  refStyle,
  strokeStyle,
} from "./svg/SvgHelper";
import { Palette } from "./Palette";
import { createPatternFiller } from "./filler/pattern-filler";
import { createDefaultFiller } from "./filler/default-filler";
import { createStripFiller } from "./filler/strip-filler";

export default class SvgBuilder {
  private readonly container: xmlBuilder.XMLElement;
  private readonly defs: xmlBuilder.XMLElement;

  private patternCount = 0;
  private definedSolidFiller: Record<string, string> = {};
  private definedSymbol: Record<string, string> = {};
  private defaultFillerId: string | null = null;
  private escutcheonPathId: string | null = null;

  constructor(
    private readonly escutcheonPath: paper.Path,
    private readonly palette: Palette,
    private readonly defaultStrokeWidth: number
  ) {
    this.palette = palette;
    this.defaultStrokeWidth = defaultStrokeWidth;
    this.escutcheonPath = escutcheonPath;

    this.container = createSVG();

    // Create "defs" section
    this.defs = this.container.ele("defs");
  }

  public addBorder(borderSize: number): void {
    // Update escutcheonPath to compute viewBox on 'build()'
    this.escutcheonPath.strokeWidth = borderSize;
    this.escutcheonPath.strokeColor = new paper.Color("#000");

    // Add border to SVG
    const style = "fill:none;" + strokeStyle(borderSize);
    const escutcheonId = this.getEscutcheonPathId();
    addUse(this.container, escutcheonId, undefined, style);
  }

  public addReflect(): void {
    const escutcheonId = this.getEscutcheonPathId();
    const fill = refStyle(this.createReflect());

    addUse(this.container, escutcheonId, fill);
  }

  public build(outputSize: { width: number; height: number }): string {
    const viewBox = this.escutcheonPath.strokeBounds;

    return this.container
      .att("width", outputSize.width)
      .att("height", outputSize.height)
      .att(
        "viewBox",
        `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`
      )
      .end();
  }

  private createReflect(): string {
    const gradienId = "gradient-reflect";
    const bounds = this.escutcheonPath.bounds;

    const cx = bounds.width / 3;
    const cy = bounds.height / 3;
    const radius = (bounds.width * 2) / 3;

    const gradient = addRadialGradient(this.defs, gradienId, cx, cy, radius);

    addGradientStop(gradient, 0.0, "#fff", 0.31);
    addGradientStop(gradient, 0.19, "#fff", 0.25);
    addGradientStop(gradient, 0.6, "#6b6b6b", 0.125);
    addGradientStop(gradient, 1.0, "#000", 0.125);

    return gradienId;
  }

  public getEscutcheonPathId(): string {
    if (this.escutcheonPathId == null) {
      this.escutcheonPathId = "escutcheon";
      addPath(this.defs, this.escutcheonPath.pathData, this.escutcheonPathId);
    }
    return this.escutcheonPathId;
  }

  public async fill(
    fillerModel: FillerModel | "none",
    shape: SimpleShape
  ): Promise<void> {
    const fillerId = await this._getFillerId(fillerModel, shape);
    addPath(this.container, shape.path.pathData, undefined, refStyle(fillerId));
  }

  public async drawSymbol(
    symbolDef: ChargeVisualInfo,
    position: paper.Point,
    scaleCoef: number,
    filler: FillerModel
  ): Promise<void> {
    const item = paper.project.importSVG(symbolDef.xml);
    const symbolShape: SymbolShape = { type: "symbol", item: item };

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
    fillerModel: FillerModel | "none",
    container: SimpleShape | SymbolShape
  ): Promise<string> {
    if (!fillerModel || fillerModel == "none" || !fillerModel.type) {
      return this._getDefaultFiller();
    }
    switch (fillerModel.type) {
      case "pattern":
        return this._getPatternFiller(fillerModel, container);
      case "plein":
        return this._getSolidFiller(fillerModel.color);
      case "seme":
        return this._getSemeFiller(fillerModel, container);
      case "strip":
        return this._getStripFiller(fillerModel, container);
      case "invalid":
      default:
        console.log("Unsupported-filler-type:" + fillerModel.type);
        return this._getDefaultFiller();
    }
  }

  private _getStripFiller(
    model: FillerStrip,
    container: SimpleShape | SymbolShape
  ) {
    const id = this.nextPatternId();
    createStripFiller(model, container, this.defs, id, this.palette);
    return id;
  }

  private _getDefaultFiller(): string {
    if (!this.defaultFillerId) {
      this.defaultFillerId = createDefaultFiller(this.defs, "default-filler");
    }
    return this.defaultFillerId;
  }

  private _getSolidFiller(key: string): string {
    let fillerId = this.definedSolidFiller[key];
    if (!fillerId) {
      fillerId = `solid-${key}`;
      const color = this.palette.getColor(key);
      addSolidGradient(this.defs, fillerId, color);
      this.definedSolidFiller[key] = fillerId;
    }
    return fillerId;
  }

  private nextPatternId(): string {
    return `pattern${this.patternCount++}`;
  }

  private async _getSemeFiller(
    model: FillerSeme,
    container: SimpleShape | SymbolShape
  ): Promise<string> {
    const id = this.nextPatternId();

    const seme = await getSemeVisualInfo(model.chargeId);
    const symbolId = this._addSymbol(seme.charge);

    const containerBounds = (
      container.type == "symbol" ? container.item : container.path
    ).bounds;

    const w = seme.width;
    const h = seme.height;

    const scaleCoef = containerBounds.width / (w * seme.repetition);
    const transform = `scale(${scaleCoef},${scaleCoef})`;

    // Align pattern
    const x = containerBounds.x / scaleCoef;
    const y = containerBounds.y / scaleCoef;

    const patternNode = addPattern(this.defs, id, x, y, w, h, transform);

    const backgroundColor = this.palette.getColor(model.fieldColor);
    addRectangle(patternNode, 0, 0, w, h, backgroundColor);

    const chargeColor = this.palette.getColor(model.chargeColor);

    const style =
      fillColorStyle(chargeColor) + strokeStyle(this.defaultStrokeWidth);

    for (const copyTransform of seme.copies) {
      addUse(patternNode, symbolId, undefined, style, copyTransform);
    }

    return id;
  }

  private _getPatternFiller(
    fillerModel: FillerPattern,
    container: SimpleShape | SymbolShape
  ): string {
    const id = this.nextPatternId();
    createPatternFiller(fillerModel, container, this.defs, id, this.palette);
    return id;
  }

  private _addSymbol(symbolDef: ChargeVisualInfo): string {
    let symbolId = this.definedSymbol[symbolDef.id];

    if (!symbolId) {
      symbolId = `symbol_${symbolDef.id}`;
      this.definedSymbol[symbolDef.id] = symbolId;
      addSymbol(this.defs, symbolId, symbolDef);
    }

    return symbolId;
  }
}
