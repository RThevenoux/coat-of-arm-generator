import * as paper from "paper";
import xmlBuilder from "xmlbuilder";
import { getChargeVisualInfo } from "../../service/ChargeService";
import {
  Angle,
  ColorId,
  FillerModel,
  FillerPattern,
  FillerSeme,
  FillerStrip,
} from "../model.type";
import {
  FillerPatternParameters,
  FillerSemeParameters,
  MyPathItem,
} from "./type";
import { getPatternVisualInfo } from "../../service/PatternService";
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
        viewBox.x + " " + viewBox.y + " " + viewBox.width + " " + viewBox.height
      );

    // Create "defs" section
    this.defs = this.container.ele("defs");
  }

  async fill(
    fillerModel: FillerModel | "none",
    path: MyPathItem
  ): Promise<void> {
    if (!fillerModel || fillerModel == "none" || !fillerModel.type) {
      const defaultFillerId = this._getDefaultFiller();
      this._fillPath(defaultFillerId, path);
      return;
    }

    if (fillerModel.type == "strip") {
      this._fillWithStrips(fillerModel, path);
    } else {
      const fillerId = await this._getFillerId(fillerModel, path.bounds.size);
      this._fillPath(fillerId, path);
    }
  }

  _fillWithStrips(fillerModel: FillerStrip, path: MyPathItem): void {
    const center = new paper.Point(0, 0);

    const angle = this._getStripAngle(fillerModel.angle, path);

    const clone = path.clone();

    clone.rotate(angle, center);
    const x = clone.bounds.x;
    const y = clone.bounds.y;
    const w = clone.bounds.width;
    const h = clone.bounds.height;
    const hStrip = h / (2 * fillerModel.count);

    const color1Id = this._getSolidFiller(fillerModel.color1);
    const color2Id = this._getSolidFiller(fillerModel.color2);

    for (let i = 0; i < 2 * fillerModel.count; i++) {
      const stripPath = new paper.Path.Rectangle({
        point: [x, y + hStrip * i],
        size: [w, hStrip],
      });

      const strip = clone.intersect(stripPath) as MyPathItem;
      strip.rotate(-angle, center);

      const colorId = i % 2 == 0 ? color1Id : color2Id;
      this._fillPath(colorId, strip);
    }
  }

  _getStripAngle(angle: Angle, path: MyPathItem): number {
    const pathAngle =
      (Math.atan(path.bounds.height / path.bounds.width) * 180) / Math.PI;
    switch (angle) {
      case "0":
        return 0;
      case "45":
        return pathAngle;
      case "90":
        return 90;
      case "135":
        return -pathAngle;
    }
  }

  _fillPath(fillerId: string, path: MyPathItem): void {
    this.container
      .ele("path")
      .att("d", path.pathData)
      .att("fill", "url(#" + fillerId + ")");
  }

  async _getFillerId(
    fillerModel: FillerModel,
    shapeBox: paper.Size
  ): Promise<string> {
    switch (fillerModel.type) {
      case "plein": {
        return this._getSolidFiller(fillerModel.color);
      }
      case "pattern": {
        const patternDef = getPatternVisualInfo(fillerModel.patternName);
        const parameters = this._getPatternParameters(fillerModel, shapeBox);
        return this._addPattern(patternDef, parameters);
      }
      case "seme": {
        const parameters = await this._getSemeParameters(fillerModel);
        return this._addSeme(parameters, shapeBox.width);
      }
      default: {
        console.log(
          "visual-generator - unsupported-filler-type:" + fillerModel.type
        );
        return this._getDefaultFiller();
      }
    }
  }

  _getFillColorProp(key: ColorId): string {
    return "fill:#" + this._getColor(key) + ";";
  }

  _stroke(width: number): string {
    return "stroke:black;stroke-width:" + width + "px;";
  }

  _getColor(key: ColorId): string {
    return this.palette[key];
  }

  _getDefaultFiller(): string {
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

  _getSolidFiller(key: string): string {
    let id = this.definedSolidFiller[key];

    if (!id) {
      id = "solid-" + key;
      this.defs
        .ele("linearGradient")
        .att("id", id)
        .ele("stop")
        .att("stop-color", "#" + this._getColor(key));

      this.definedSolidFiller[key] = id;
    }

    return id;
  }

  _addSeme(parameters: FillerSemeParameters, shapeWidth: number): string {
    const id = "pattern" + this.patternCount++;

    const box = {
      width: parameters.seme.width,
      height: parameters.seme.height,
    };

    const symbolId = this.addSymbol(parameters.charge);

    const scaleCoef = shapeWidth / (box.width * parameters.seme.repetition);
    const transform = "scale(" + scaleCoef + "," + scaleCoef + ")";

    const patternNode = this.defs
      .ele("pattern")
      .att("id", id)
      .att("x", 0)
      .att("y", 0)
      .att("width", box.width)
      .att("height", box.height)
      .att("patternUnits", "userSpaceOnUse")
      .att("patternTransform", transform);

    patternNode
      .ele("rect")
      .att("x", 0)
      .att("y", 0)
      .att("width", box.width)
      .att("height", box.height)
      .att("style", this._getFillColorProp(parameters.fieldColor));

    const strokeWidth = this.defaultStrokeWidth / scaleCoef;

    for (const copyTransform of parameters.seme.copies) {
      patternNode
        .ele("use")
        .att("xlink:href", "#" + symbolId)
        .att("transform", copyTransform)
        .att(
          "style",
          this._getFillColorProp(parameters.color) + this._stroke(strokeWidth)
        );
    }

    return id;
  }

  _addPattern(
    pattern: PatternVisualInfo,
    parameters: FillerPatternParameters
  ): string {
    const id = "pattern" + this.patternCount++;

    const scaleCoef =
      parameters.shapeWidth /
      (pattern.patternWidth * pattern.patternRepetition);
    let transform = "scale(" + scaleCoef + "," + scaleCoef + ")";
    if (parameters.rotation) {
      transform += "rotate(" + parameters.rotation + ")";
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

    const originalId = id + "_original";
    patternNode
      .ele("path")
      .att("d", pattern.path)
      .att("id", originalId)
      .att("style", this._getFillColorProp(parameters.patternColor));

    if (pattern.copies) {
      for (const copyTransform of pattern.copies) {
        patternNode
          .ele("use")
          .att("xlink:href", "#" + originalId)
          .att("transform", copyTransform);
      }
    }

    return id;
  }

  addSymbol(symbolDef: ChargeVisualInfo): string {
    let symbolId = this.definedSymbol[symbolDef.id];

    if (!symbolId) {
      symbolId = "symbol_" + symbolDef.id;
      this.definedSymbol[symbolDef.id] = symbolId;

      this.defs
        .ele("symbol")
        .att("id", symbolId)
        .att("width", symbolDef.width)
        .att("height", symbolDef.height)
        .att("viewBox", "0 0 " + symbolDef.width + " " + symbolDef.height)
        .raw(symbolDef.xml);
    }

    return symbolId;
  }

  async _getSemeParameters(
    description: FillerSeme
  ): Promise<FillerSemeParameters> {
    const chargeDef = await getChargeVisualInfo(description.chargeId);
    const semeDef = chargeDef.seme;

    const tx = semeDef.tx;
    const ty = semeDef.ty;
    const h = chargeDef.height;
    const w = chargeDef.width;

    return {
      charge: chargeDef,
      color: description.chargeColor,
      seme: {
        width: tx * 2,
        height: ty * 2,
        repetition: semeDef.repetition,
        copies: [
          "translate(" + (-w / 2 + tx) + "," + (-h / 2 + ty) + ")",
          "translate(" + -w / 2 + "," + -h / 2 + ")",
          "translate(" + -w / 2 + "," + (-h / 2 + 2 * ty) + ")",
          "translate(" + (-w / 2 + 2 * tx) + "," + -h / 2 + ")",
          "translate(" + (-w / 2 + 2 * tx) + "," + (-h / 2 + 2 * ty) + ")",
        ],
      },
      fieldColor: description.fieldColor,
    };
  }

  _getPatternParameters(
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
