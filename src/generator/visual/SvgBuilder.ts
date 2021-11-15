import * as paper from "paper";
import xmlBuilder from "xmlbuilder";
import { getSemeVisualInfo } from "@/service/ChargeService";
import {
  Direction,
  ColorId,
  FillerModel,
  FillerPattern,
  FillerSeme,
  FillerStrip,
} from "../model.type";
import { SimpleShape, SymbolShape } from "./type";
import { getPatternVisualInfo } from "@/service/PatternService";
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

  private async _getStripFiller(
    model: FillerStrip,
    container: SimpleShape | SymbolShape
  ) {
    const item = container.type == "symbol" ? container.item : container.path;

    const angle = this._getStripAngle(model.direction, item.bounds);

    const clone = item.clone();
    clone.rotate(-angle, new paper.Point(0, 0));

    const pathHeight = clone.bounds.height;
    const scaleCoef = pathHeight / model.count;

    const x = 0;
    const y =
      (-Math.sin((angle * Math.PI) / 180) * item.bounds.x +
        Math.cos((angle * Math.PI) / 180) * item.bounds.y) /
      scaleCoef;
    const transform = `scale(${scaleCoef},${scaleCoef})rotate(${angle})`;

    const id = this.nextPatternId();
    const color1 = this.palette.getColor(model.color1);
    const color2 = this.palette.getColor(model.color2);
    const patternNode = addPattern(this.defs, id, x, y, 1, 1, transform);

    addRectangle(patternNode, 0, 0, 1, 1, color1);
    addRectangle(patternNode, 0, 0.5, 1, 0.5, color2);

    return id;
  }

  private _getStripAngle(
    direction: Direction,
    bounds: paper.Rectangle
  ): number {
    const pathAngle = (Math.atan(bounds.height / bounds.width) * 180) / Math.PI;
    switch (direction) {
      case "0":
        return 0;
      case "45":
        return pathAngle;
      case "90":
        return -90;
      case "135":
        return -pathAngle;
    }
  }

  private _getFillColorProp(key: ColorId): string {
    const color = this.palette.getColor(key);
    return fillColorStyle(color);
  }

  private _getDefaultFiller(): string {
    if (!this.defaultFillerId) {
      this.defaultFillerId = "default-filler";
      this._addDefaultFiller(this.defaultFillerId);
    }
    return this.defaultFillerId;
  }

  private _addDefaultFiller(id: string) {
    const size = 50;
    const half = size / 2;
    const color1 = "white";
    const color2 = "grey";

    const patternNode = addPattern(this.defs, id, 0, 0, size, size);

    addRectangle(patternNode, 0, 0, size, size, color1);
    addRectangle(patternNode, half, 0, half, half, color2);
    addRectangle(patternNode, 0, half, half, half, color2);
  }

  private _getSolidFiller(key: string): string {
    const existingId = this.definedSolidFiller[key];
    if (existingId) {
      return existingId;
    }

    // Create new Solid Filler
    const id = `solid-${key}`;
    const color = this.palette.getColor(key);
    addSolidGradient(this.defs, id, color);

    this.definedSolidFiller[key] = id;
    return id;
  }

  private nextPatternId(): string {
    return `pattern${this.patternCount++}`;
  }

  private async _getSemeFiller(
    model: FillerSeme,
    container: SimpleShape | SymbolShape
  ): Promise<string> {
    const seme = await getSemeVisualInfo(model.chargeId);
    const id = this.nextPatternId();

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

    const style =
      this._getFillColorProp(model.chargeColor) +
      strokeStyle(this.defaultStrokeWidth);

    for (const copyTransform of seme.copies) {
      addUse(patternNode, symbolId, undefined, style, copyTransform);
    }

    return id;
  }

  private _getPatternFiller(
    fillerModel: FillerPattern,
    container: SimpleShape | SymbolShape
  ): string {
    const bounds = (container.type == "symbol" ? container.item : container.path)
      .bounds;
    const rotation = this._getPatternRotation(fillerModel);

    const pattern = getPatternVisualInfo(fillerModel.patternName);
    const w = pattern.patternWidth;
    const h = pattern.patternHeight;

    const id = `pattern${this.patternCount++}`;

    const scaleCoef = bounds.width / (w * pattern.patternRepetition);
    let transform = `scale(${scaleCoef},${scaleCoef})`;
    if (rotation) {
      transform += `rotate(${rotation})`;
    }

    // Align pattern (fail if rotation is applied)
    const x = bounds.x / scaleCoef;
    const y = bounds.y / scaleCoef;

    const patternNode = addPattern(this.defs, id, x, y, w, h, transform);

    const backgroundColor = this.palette.getColor(fillerModel.color1);
    addRectangle(patternNode, 0, 0, w, h, backgroundColor);

    const originalId = `${id}_original`;
    const style = this._getFillColorProp(fillerModel.color2);
    addPath(patternNode, pattern.path, originalId, undefined, style);

    if (pattern.copies) {
      for (const transform of pattern.copies) {
        addUse(patternNode, originalId, undefined, undefined, transform);
      }
    }

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

  /* Rotation is only used by "fusele" */
  private _getPatternRotation(description: FillerPattern): number | undefined {
    if (!description.angle) {
      return undefined;
    }
    switch (description.angle) {
      case "bande":
        return -45;
      case "barre":
        return 45;
      case "defaut":
        return undefined;
      default:
        console.log("Invalid angle" + description.angle);
        return undefined;
    }
  }
}
