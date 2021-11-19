import { FillerSeme } from "@/generator/model.type";
import { getSemeVisualInfo } from "@/service/ChargeService";
import {
  addPattern,
  addRectangle,
  addUse,
  fillColorStyle,
  strokeStyle,
} from "../svg/SvgHelper";
import SvgBuilder from "../SvgBuilder";
import { SimpleShape, SymbolShape } from "../type";
import { createPatternTransfrom } from "./util";
import { SemeVisualInfo } from "@/service/visual.type";

export async function createSemeFiller(
  builder: SvgBuilder,
  model: FillerSeme,
  container: SimpleShape | SymbolShape,
  id: string
): Promise<string> {
  const seme = await getSemeVisualInfo(model.chargeId);

  const transformParam = computeTransform(container, seme);

  const w = seme.width;
  const h = seme.height;

  const patternNode = addPattern(builder.defs, id, w, h, transformParam);

  const backgroundColor = builder.palette.getColor(model.fieldColor);
  addRectangle(patternNode, 0, 0, w, h, backgroundColor);

  const chargeColor = builder.palette.getColor(model.chargeColor);
  const style =
    fillColorStyle(chargeColor) + strokeStyle(builder.defaultStrokeWidth);

  const symbolId = builder._addSymbol(seme.charge);
  for (const copyTransform of seme.copies) {
    addUse(patternNode, symbolId, undefined, style, copyTransform);
  }
  return id;
}

function computeTransform(container: SimpleShape | SymbolShape, seme: SemeVisualInfo) {
  if (container.type == "strip") {
    // Compute scaling to display 2 pattern on the strip width
    const scaleCoef = container.width / (2 * seme.width);

    let rotation = 0;
    if (container.direction == "bande" || container.direction == "barre") {
      rotation = (container.angle * 180) / Math.PI - 90;
    }

    return createPatternTransfrom(container.patternAnchor, scaleCoef, rotation);

  } else {
    const bounds = (container.type == "symbol" ? container.item : container.path).bounds;
    const scaleCoef = bounds.width / (seme.repetition * seme.width);
    return createPatternTransfrom(bounds.topLeft, scaleCoef);
  }
}
