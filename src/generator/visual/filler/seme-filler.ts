import * as paper from "paper";
import { FillerSeme } from "@/generator/model.type";
import { getSemeVisualInfo } from "@/service/ChargeService";
import {
  addPattern,
  addRectangle,
  addUse,
  fillColorStyle,
  PatternTransform,
  strokeStyle,
  svgTransform,
} from "../svg/SvgHelper";
import SvgBuilder from "../SvgBuilder";
import { SimpleShape, StripShape, SymbolShape } from "../type";
import { createPatternTransfrom } from "./util";
import { SemeVisualInfo } from "@/service/visual.type";

export async function createSemeFiller(
  builder: SvgBuilder,
  model: FillerSeme,
  container: SimpleShape | SymbolShape,
  id: string
): Promise<string> {
  const seme = await getSemeVisualInfo(model.chargeId);

  let transformParam = null;
  if (container.type == "strip") {
    transformParam = stripFiller(container, seme);
  } else if (container.type == "symbol") {
    transformParam = defaultFiller(container.item, seme);
  } else {
    transformParam = defaultFiller(container.path, seme);
  }

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

function defaultFiller(
  item: paper.Item,
  seme: SemeVisualInfo
): PatternTransform {
  const bounds = item.bounds;
  const w = seme.width;
  const scaleCoef = bounds.width / (w * seme.repetition);
  return createPatternTransfrom(bounds.topLeft, scaleCoef);
}

function stripFiller(
  strip: StripShape,
  seme: SemeVisualInfo
): PatternTransform {
  if (strip.direction == "pal" || strip.direction == "fasce") {
    const scaleCoef = strip.width / (2 * seme.width);
    return createPatternTransfrom(strip.path.bounds.topLeft, scaleCoef);
  } else {
    return getDiagonalTransform(strip, seme);
  }
}

function getDiagonalTransform(strip: StripShape, seme: SemeVisualInfo) {
  // Compute scaling to display 2 pattern on the strip width
  const scaleCoef = strip.width / (2 * seme.width);

  // Compute angle of rotation to apply to pattern
  const angleDeg = (strip.angle * 180) / Math.PI;
  const deltaAngleDeg = angleDeg - 90;

  // Compute strip left border x-position in pattern coordinate
  // do not lock pattern position on y-translation. It may be an improvement to do...
  const clone = strip.path.clone();
  clone.rotate(deltaAngleDeg, new paper.Point(0, 0));
  const x = clone.bounds.left / scaleCoef;
  const y = 0;

  const transform = svgTransform(scaleCoef, deltaAngleDeg);
  return { x, y, transform };
}
