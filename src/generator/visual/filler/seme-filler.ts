import * as paper from "paper";
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

  const patternNode = addPattern(builder.defs, id, x, y, w, h, transform);

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

  const bounds = strip.path.bounds;

  const w = seme.width;
  const h = seme.height;

  let scaleCoef = null;
  let transform = null;
  let x;
  let y;
  if (strip.angle == "pal") {
    scaleCoef = strip.width / (2 * w);

    x = bounds.x / scaleCoef;
    y = bounds.y / scaleCoef;
    transform = `scale(${scaleCoef},${scaleCoef})`;
  } else if (strip.angle == "fasce") {
    scaleCoef = strip.width / (2 * h);

    transform = `scale(${scaleCoef},${scaleCoef})`;
    x = bounds.x / scaleCoef;
    y = bounds.y / scaleCoef;
  } else {
    const angleDeg = 90 - (strip.angle * 180) / Math.PI;
    const angleRad = (angleDeg / 180) * Math.PI;

    scaleCoef = strip.width / (2 * w);

    transform = `scale(${scaleCoef},${scaleCoef})rotate(${angleDeg})`;
    x =
      (bounds.x * Math.cos(angleRad) + bounds.y * Math.sin(angleRad)) /
      scaleCoef;
    y =
      (bounds.y * Math.cos(angleRad) + bounds.x * Math.sin(angleRad)) /
      scaleCoef;
  }

  const patternNode = addPattern(builder.defs, id, x, y, w, h, transform);

  const backgroundColor = builder.palette.getColor(model.fieldColor);
  addRectangle(patternNode, 0, 0, w, h, backgroundColor);

  const chargeColor = builder.palette.getColor(model.chargeColor);
  const style =
    fillColorStyle(chargeColor) + strokeStyle(builder.defaultStrokeWidth);

  for (const copyTransform of seme.copies) {
    addUse(patternNode, symbolId, undefined, style, copyTransform);
  }
}
