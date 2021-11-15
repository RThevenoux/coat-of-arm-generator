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

export async function createSemeFiller(
  builder: SvgBuilder,
  model: FillerSeme,
  container: SimpleShape | SymbolShape,
  id: string
): Promise<string> {
  const seme = await getSemeVisualInfo(model.chargeId);
  const symbolId = builder._addSymbol(seme.charge);

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

  const patternNode = addPattern(builder.defs, id, x, y, w, h, transform);

  const backgroundColor = builder.palette.getColor(model.fieldColor);
  addRectangle(patternNode, 0, 0, w, h, backgroundColor);

  const chargeColor = builder.palette.getColor(model.chargeColor);

  const style =
    fillColorStyle(chargeColor) + strokeStyle(builder.defaultStrokeWidth);

  for (const copyTransform of seme.copies) {
    addUse(patternNode, symbolId, undefined, style, copyTransform);
  }

  return id;
}
