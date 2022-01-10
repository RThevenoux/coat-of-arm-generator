import * as paper from "paper";
import { FillerStrip } from "@/model/filler";
import { SimpleShape, MobileChargeShape } from "../type";
import { SvgBuilder } from "../svg/SvgBuilder";
import { createPatternTransfrom, getItem } from "./util";
import { PatternWrapper } from "../svg/PatternWrapper";
import { TransformList } from "../svg/svg.type";
import { origin } from "../tool/point";

export function createStripFiller(
  builder: SvgBuilder,
  model: FillerStrip,
  container: SimpleShape | MobileChargeShape
): string {
  const item = getItem(container);
  switch (model.direction) {
    case "pal":
      return createPal(builder, model, item).id;
    case "fasce":
      return createFasce(builder, model, item).id;
    case "bande":
      return createDiagonal(builder, model, true, item).id;
    case "barre":
      return createDiagonal(builder, model, false, item).id;
    default:
      throw new Error("Unsupported direction: " + model.direction);
  }
}

function createPal(
  builder: SvgBuilder,
  model: FillerStrip,
  item: paper.Item
): PatternWrapper {
  const pathWidth = item.bounds.width;
  const scaleCoef = pathWidth / model.count;

  const transformParam = createPatternTransfrom(item.bounds.topLeft, scaleCoef);

  const pattern = builder.createPattern(1, 1, transformParam);
  pattern.addBackground({ colorId: model.color1 });
  pattern.addRectangle(0.5, 0, 0.5, 1, { colorId: model.color2 });

  return pattern;
}

function createFasce(
  builder: SvgBuilder,
  model: FillerStrip,
  item: paper.Item
): PatternWrapper {
  const pathHeight = item.bounds.height;
  const scaleCoef = pathHeight / model.count;

  const transformParam = createPatternTransfrom(item.bounds.topLeft, scaleCoef);

  const pattern = builder.createPattern(1, 1, transformParam);
  pattern.addBackground({ colorId: model.color1 });
  pattern.addRectangle(0, 0.5, 1, 0.5, { colorId: model.color2 });

  return pattern;
}

function createDiagonal(
  builder: SvgBuilder,
  model: FillerStrip,
  bande: boolean,
  item: paper.Item
): PatternWrapper {
  const angleRad = Math.atan2(item.bounds.height, item.bounds.width);
  const angleDeg = (angleRad * 180) / Math.PI;

  // svg & paperjs rotation is clockwise
  const rotationDeg = bande ? 90 - angleDeg : angleDeg - 90;

  const clone = item.clone();
  clone.rotate(rotationDeg, origin());

  const scaleCoef = clone.bounds.width / model.count;

  const x = clone.bounds.left / scaleCoef;
  const y = 0; // pattern is invariant by y-translation
  const transformList: TransformList = [];
  transformList.push({ type: "scale", sx: scaleCoef });
  transformList.push({ type: "rotate", angle: rotationDeg });

  const transformParam = { x, y, transformList };

  const pattern = builder.createPattern(1, 1, transformParam);
  pattern.addBackground({ colorId: model.color1 });
  if (bande) {
    pattern.addRectangle(0, 0, 0.5, 1, { colorId: model.color2 });
  } else {
    pattern.addRectangle(0.5, 0, 0.5, 1, { colorId: model.color2 });
  }
  return pattern;
}
