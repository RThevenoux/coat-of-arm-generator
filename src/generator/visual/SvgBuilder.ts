import * as paper from "paper";
import xmlBuilder from "xmlbuilder";
import { getSemeVisualInfo } from "@/service/ChargeService";
import {
  Angle,
  ColorId,
  FillerModel,
  FillerPattern,
  FillerSeme,
  FillerStrip,
} from "../model.type";
import { FillerPatternParameters, MyShape } from "./type";
import { getPatternVisualInfo } from "@/service/PatternService";
import {
  ChargeVisualInfo,
  Palette,
  PatternVisualInfo,
} from "@/service/visual.type";

export default class SvgBuilder {
  readonly palette: Palette;
  readonly defaultStrokeWidth: number;
  readonly container: xmlBuilder.XMLElement;
  readonly defs: xmlBuilder.XMLElement;

  patternCount = 0;
  definedSolidFiller: Record<string, string> = {};
  definedSymbol: Record<string, string> = {};
  defaultFillerId: string | null = null;

  constructor(
    viewBox: paper.Rectangle,
    palette: Palette,
    defaultStrokeWidth: number
  ) {
    this.palette = palette;
    this.defaultStrokeWidth = defaultStrokeWidth;

    this.container = xmlBuilder
      .create("svg", { headless: true })
      .att("xmlns", "http://www.w3.org/2000/svg")
      .att(
        "viewBox",
        `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`
      );

    // Create "defs" section
    this.defs = this.container.ele("defs");
  }

  public async fill(
    fillerModel: FillerModel | "none",
    shape: MyShape
  ): Promise<void> {
    const fillerId = await this._getFillerId(fillerModel, shape.path);
    this._fillPathItem(fillerId, shape.path);
  }

  public async drawSymbol(
    symbolDef: ChargeVisualInfo,
    position: paper.Point,
    scaleCoef: number,
    filler: FillerModel
  ): Promise<void> {
    const item = paper.project.importSVG(symbolDef.xml);

    const fillerId = await this._getFillerId(filler, item);

    const strokeWidth = this.defaultStrokeWidth / scaleCoef;
    const transform =
      `scale(${scaleCoef},${scaleCoef})` +
      ` translate(${position.x / scaleCoef},${position.y / scaleCoef})`;

    const group = this.container.ele("g");
    group
      .raw(symbolDef.xml)
      .att("transform", transform)
      .att("fill", `url(#${fillerId})`)
      .att("style", this._stroke(strokeWidth));
  }

  private async _getFillerId(
    fillerModel: FillerModel | "none",
    item: paper.Item
  ): Promise<string> {
    if (!fillerModel || fillerModel == "none" || !fillerModel.type) {
      return this._getDefaultFiller();
    }
    switch (fillerModel.type) {
      case "pattern": {
        const patternDef = getPatternVisualInfo(fillerModel.patternName);
        const parameters = this._getPatternParameters(
          fillerModel,
          item.bounds.size
        );
        return this._getPatternFiller(patternDef, parameters);
      }
      case "plein":
        return this._getSolidFiller(fillerModel.color);
      case "seme":
        return this._getSemeFiller(fillerModel, item.bounds.size);
      case "strip":
        return this._getStripFiller(fillerModel, item);
      case "invalid":
      default:
        console.log("Unsupported-filler-type:" + fillerModel.type);
        return this._getDefaultFiller();
    }
  }

  private async _getStripFiller(model: FillerStrip, path: paper.Item) {
    const angle = this._getStripAngle(model.angle, path.bounds);

    const clone = path.clone();
    clone.rotate(-angle, new paper.Point(0, 0));

    const pathHeight = clone.bounds.height;
    const scaleCoef = pathHeight / model.count;

    const x = 0;
    const y =
      (-Math.sin((angle * Math.PI) / 180) * path.bounds.x +
        Math.cos((angle * Math.PI) / 180) * path.bounds.y) /
      scaleCoef; //magic value should go here !
    const transform = `scale(${scaleCoef},${scaleCoef})rotate(${angle})`;

    const id = this.nextPatternId();
    const patternNode = this.defs
      .ele("pattern")
      .att("id", id)
      .att("x", x)
      .att("y", y)
      .att("width", 1)
      .att("height", 1)
      .att("patternUnits", "userSpaceOnUse")
      .att("patternTransform", transform);

    patternNode
      .ele("rect")
      .att("x", 0)
      .att("y", 0)
      .att("width", 1)
      .att("height", 1)
      .att("style", this._getFillColorProp(model.color1));

    patternNode
      .ele("rect")
      .att("x", 0)
      .att("y", 0.5)
      .att("width", 1)
      .att("height", 0.5)
      .att("style", this._getFillColorProp(model.color2));

    return id;
  }

  private _getStripAngle(angle: Angle, bounds: paper.Rectangle): number {
    const pathAngle = (Math.atan(bounds.height / bounds.width) * 180) / Math.PI;
    switch (angle) {
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

  private _fillPathItem(fillerId: string, path: paper.PathItem): void {
    this.container
      .ele("path")
      .att("d", path.pathData)
      .att("fill", `url(#${fillerId})`);
  }

  private _getFillColorProp(key: ColorId): string {
    const color = this._getColor(key);
    return `fill:#${color};`;
  }

  private _stroke(width: number): string {
    return `stroke:black;stroke-width:${width}px;`;
  }

  private _getColor(key: ColorId): string {
    return this.palette[key];
  }

  private _getDefaultFiller(): string {
    if (!this.defaultFillerId) {
      this.defaultFillerId = "default-filler";

      const size = 50;
      const half = size / 2;
      const color1 = "white";
      const color2 = "grey";

      const patternNode = this.defs
        .ele("pattern")
        .att("id", this.defaultFillerId)
        .att("x", 0)
        .att("y", 0)
        .att("width", size)
        .att("height", size)
        .att("patternUnits", "userSpaceOnUse");

      patternNode
        .ele("rect")
        .att("x", 0)
        .att("y", 0)
        .att("width", size)
        .att("height", size)
        .att("fill", color1);
      patternNode
        .ele("rect")
        .att("x", half)
        .att("y", 0)
        .att("width", half)
        .att("height", half)
        .att("fill", color2);
      patternNode
        .ele("rect")
        .att("x", 0)
        .att("y", half)
        .att("width", half)
        .att("height", half)
        .att("fill", color2);
    }
    return this.defaultFillerId;
  }

  private _getSolidFiller(key: string): string {
    const existingId = this.definedSolidFiller[key];
    if (existingId) {
      return existingId;
    }

    // Create new Solid Filler
    const id = `solid-${key}`;
    const color = this._getColor(key);
    this.defs
      .ele("linearGradient")
      .att("id", id)
      .ele("stop")
      .att("stop-color", `#${color}`);

    this.definedSolidFiller[key] = id;
    return id;
  }

  private nextPatternId(): string {
    return `pattern${this.patternCount++}`;
  }

  private async _getSemeFiller(
    model: FillerSeme,
    shapeSize: paper.Size
  ): Promise<string> {
    const parameters = await getSemeVisualInfo(model.chargeId);
    const id = this.nextPatternId();

    const symbolId = this._addSymbol(parameters.charge);

    const scaleCoef =
      shapeSize.width / (parameters.width * parameters.repetition);
    const transform = `scale(${scaleCoef},${scaleCoef})`;

    const patternNode = this.defs
      .ele("pattern")
      .att("id", id)
      .att("x", 0)
      .att("y", 0)
      .att("width", parameters.width)
      .att("height", parameters.height)
      .att("patternUnits", "userSpaceOnUse")
      .att("patternTransform", transform);

    patternNode
      .ele("rect")
      .att("x", 0)
      .att("y", 0)
      .att("width", parameters.width)
      .att("height", parameters.height)
      .att("style", this._getFillColorProp(model.fieldColor));

    const style =
      this._getFillColorProp(model.chargeColor) +
      this._stroke(this.defaultStrokeWidth);
    for (const copyTransform of parameters.copies) {
      patternNode
        .ele("use")
        .att("href", `#${symbolId}`)
        .att("transform", copyTransform)
        .att("style", style);
    }

    return id;
  }

  private _getPatternFiller(
    pattern: PatternVisualInfo,
    parameters: FillerPatternParameters
  ): string {
    const id = `pattern${this.patternCount++}`;

    const scaleCoef =
      parameters.shapeWidth /
      (pattern.patternWidth * pattern.patternRepetition);
    let transform = `scale(${scaleCoef},${scaleCoef})`;
    if (parameters.rotation) {
      transform += `rotate(${parameters.rotation})`;
    }

    const patternNode = this.defs
      .ele("pattern")
      .att("id", id)
      .att("x", 0)
      .att("y", 0)
      .att("width", pattern.patternWidth)
      .att("height", pattern.patternHeight)
      .att("patternUnits", "userSpaceOnUse")
      .att("patternTransform", transform);

    patternNode
      .ele("rect")
      .att("x", 0)
      .att("y", 0)
      .att("width", pattern.patternWidth)
      .att("height", pattern.patternHeight)
      .att("style", this._getFillColorProp(parameters.backgroundColor));

    const originalId = `${id}_original`;
    patternNode
      .ele("path")
      .att("d", pattern.path)
      .att("id", originalId)
      .att("style", this._getFillColorProp(parameters.patternColor));

    if (pattern.copies) {
      for (const transform of pattern.copies) {
        patternNode
          .ele("use")
          .att("href", `#${originalId}`)
          .att("transform", transform);
      }
    }

    return id;
  }

  private _addSymbol(symbolDef: ChargeVisualInfo): string {
    let symbolId = this.definedSymbol[symbolDef.id];

    if (!symbolId) {
      symbolId = `symbol_${symbolDef.id}`;
      this.definedSymbol[symbolDef.id] = symbolId;

      this.defs
        .ele("symbol")
        .att("id", symbolId)
        .att("width", symbolDef.width)
        .att("height", symbolDef.height)
        .att("viewBox", `0 0 ${symbolDef.width} ${symbolDef.height}`)
        .raw(symbolDef.xml);
    }

    return symbolId;
  }

  private _getPatternParameters(
    description: FillerPattern,
    shapeBox: paper.Size
  ): FillerPatternParameters {
    let rotation: number | undefined = undefined;
    if (description.angle) {
      switch (description.angle) {
        case "bande":
          rotation = -45;
          break;
        case "barre":
          rotation = 45;
          break;
        case "defaut":
          break;
        default:
          console.log("Invalid angle" + description.angle);
      }
    }

    return {
      backgroundColor: description.color1,
      patternColor: description.color2,
      shapeWidth: shapeBox.width,
      rotation,
    };
  }
}
