import * as paper from "paper";
import xmlBuilder, { XMLElement } from "xmlbuilder";
import { FillerModel } from "../../model.type";
import {
  EscutcheonShape,
  FieldShape,
  SimpleShape,
  MobileChargeShape,
} from "../type";
import { ChargeVisualInfo } from "@/service/visual.type";
import {
  addClipPath,
  addPath,
  addPattern,
  addStyle,
  addSymbol,
  addTransform,
  addUse,
  createGroup,
  createSVG,
} from "./SvgHelper";
import { Palette } from "../Palette";
import { createPatternFiller } from "../filler/pattern-filler";
import { createDefaultFiller } from "../filler/default-filler";
import { createStripFiller } from "../filler/strip-filler";
import { createSemeFiller } from "../filler/seme-filler";
import { createReflect } from "../filler/reflect";
import { PatternWrapper } from "./PatternWrapper";
import { PatternTransform, SvgStyle, TransformList } from "./svg.type";

export class SvgBuilder {
  private readonly container: xmlBuilder.XMLElement;
  readonly defs: xmlBuilder.XMLElement;

  private clipPathCount = 0;
  private patternCount = 0;
  private symbolCount = 0;
  private chargeSymbolIds: Record<string, string> = {};
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

  public getClipPathId(container: FieldShape): string {
    if (container.clipPathId) {
      return container.clipPathId;
    }
    const clipPathId = this.nextClipPathId();
    addClipPath(this.defs, clipPathId, container.path.pathData);
    container.clipPathId = clipPathId;
    return clipPathId;
  }

  private nextClipPathId(): string {
    return `clipPath${this.clipPathCount++}`;
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
    shape: SimpleShape,
    parent?: XMLElement
  ): Promise<XMLElement> {
    const style = await this.getStyle(fillerModel, shape);
    return addPath(parent || this.container, shape.path.pathData, style);
  }

  public createGroup(parent?: XMLElement): XMLElement {
    return createGroup(parent || this.container);
  }

  public async drawCharge(
    chargeInfo: ChargeVisualInfo,
    position: paper.Point,
    scaleCoef: number,
    filler: FillerModel
  ): Promise<void> {
    const item = paper.project.importSVG(chargeInfo.xml);
    const chargeShape: MobileChargeShape = {
      type: "mobileCharge",
      item: item,
      root: this.escutcheon,
    };

    const style = await this.getStyle(filler, chargeShape);
    style.strokeWidth = this.defaultStrokeWidth / scaleCoef;

    const transforms: TransformList = [
      { type: "scale", sx: scaleCoef },
      {
        type: "translate",
        tx: position.x / scaleCoef,
        ty: position.y / scaleCoef,
      },
    ];

    const group = createGroup(this.container);
    group.raw(chargeInfo.xml);
    addTransform(group, transforms);
    addStyle(group, style);
  }

  private async getStyle(
    model: FillerModel | "none",
    container: SimpleShape | MobileChargeShape
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

  public addSymbol(): { symbolId: string; node: XMLElement } {
    const symbolId = `symbol_${this.symbolCount++}`;
    const node = addSymbol(this.defs, symbolId);
    return { symbolId, node };
  }

  public getChargeSymbolId(chargeDef: ChargeVisualInfo): string {
    let symbolId = this.chargeSymbolIds[chargeDef.id];
    if (!symbolId) {
      symbolId = `mobile_${chargeDef.id}`;
      const symbol = addSymbol(this.defs, symbolId);
      symbol
        .att("width", chargeDef.width)
        .att("height", chargeDef.height)
        .att("viewBox", `0 0 ${chargeDef.width} ${chargeDef.height}`)
        .raw(chargeDef.xml);
      this.chargeSymbolIds[chargeDef.id] = symbolId;
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
