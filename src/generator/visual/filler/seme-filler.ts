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
} from "../svg/SvgHelper";
import SvgBuilder from "../SvgBuilder";
import { SimpleShape, StripShape, SymbolShape } from "../type";

export async function createSemeFiller(
  builder: SvgBuilder,
  model: FillerSeme,
  container: SimpleShape | SymbolShape,
  id: string
): Promise<string> {
  if (container.type == "strip") {
    await stripFiller(builder, model, container, id);
  } else if (container.type == "symbol") {
    const bounds = container.item.bounds;
    await defaultFiller(builder, model, bounds, id);
  } else {
    const bounds = container.path.bounds;
    await defaultFiller(builder, model, bounds, id);
  }
  return id;
}

async function defaultFiller(
  builder: SvgBuilder,
  model: FillerSeme,
  bounds: paper.Rectangle,
  id: string
): Promise<void> {
  const seme = await getSemeVisualInfo(model.chargeId);
  const symbolId = builder._addSymbol(seme.charge);

  const w = seme.width;
  const h = seme.height;

  const scaleCoef = bounds.width / (w * seme.repetition);
  const transform = `scale(${scaleCoef},${scaleCoef})`;

  // Align pattern
  const x = bounds.x / scaleCoef;
  const y = bounds.y / scaleCoef;

  const transformParam = { x, y, transform };

  const patternNode = addPattern(builder.defs, id, w, h, transformParam);

  const backgroundColor = builder.palette.getColor(model.fieldColor);
  addRectangle(patternNode, 0, 0, w, h, backgroundColor);

  const chargeColor = builder.palette.getColor(model.chargeColor);
  const style =
    fillColorStyle(chargeColor) + strokeStyle(builder.defaultStrokeWidth);

  for (const copyTransform of seme.copies) {
    addUse(patternNode, symbolId, undefined, style, copyTransform);
  }
}

async function stripFiller(
  builder: SvgBuilder,
  model: FillerSeme,
  strip: StripShape,
  id: string
) {
  const seme = await getSemeVisualInfo(model.chargeId);
  const symbolId = builder._addSymbol(seme.charge);

  const w = seme.width;
  const h = seme.height;

  const transform = getTransform(strip, w);

  const patternNode = addPattern(builder.defs, id, w, h, transform);

  const backgroundColor = builder.palette.getColor(model.fieldColor);
  addRectangle(patternNode, 0, 0, w, h, backgroundColor);

  const chargeColor = builder.palette.getColor(model.chargeColor);
  const style =
    fillColorStyle(chargeColor) + strokeStyle(builder.defaultStrokeWidth);

  for (const copyTransform of seme.copies) {
    addUse(patternNode, symbolId, undefined, style, copyTransform);
  }
}

function getTransform(strip: StripShape, semeWidth: number): PatternTransform {
  if (strip.direction == "pal" || strip.direction == "fasce") {
    return getStraigthTransform(strip, semeWidth);
  } else {
    return getDiagonalTransform(strip, semeWidth);
  }
}

function getStraigthTransform(
  strip: StripShape,
  semeWidth: number
): PatternTransform {
  const bounds = strip.path.bounds;

  const scaleCoef = strip.width / (2 * semeWidth);

  // lock pattern on x-translation to match top-left corner
  const x = bounds.x / scaleCoef;
  const y = bounds.y / scaleCoef;

  return { x, y, transform: `scale(${scaleCoef},${scaleCoef})` };
}

function getDiagonalTransform(strip: StripShape, semeWidth: number) {
  // Compute scaling to display 2 pattern on the strip width
  const scaleCoef = strip.width / (2 * semeWidth);

  // Compute angle of rotation to apply to pattern
  const angleDeg = (strip.angle * 180) / Math.PI;
  const deltaAngleDeg = angleDeg - 90;

  // Compute strip left border x-position in pattern coordinate
  // do not lock pattern position on y-translation. It may be an improvement to do...
  const clone = strip.path.clone();
  clone.rotate(deltaAngleDeg, new paper.Point(0, 0)); // paperjs rotation is anti-clockwise
  const x = clone.bounds.left / scaleCoef;
  const y = 0;

  // svg rotation is clockwise
  const transform = `scale(${scaleCoef},${scaleCoef})rotate(${-deltaAngleDeg})`;
  return { x, y, transform };
}
