import * as paper from "paper";
import { Direction, FillerStrip } from "@/generator/model.type";
import { addPattern, addRectangle } from "../svg/SvgHelper";
import { SimpleShape, SymbolShape } from "../type";
import SvgBuilder from "../SvgBuilder";

export function createStripFiller(
  builder: SvgBuilder,
  model: FillerStrip,
  container: SimpleShape | SymbolShape,
  id: string
): string {
  const item = container.type == "symbol" ? container.item : container.path;

  const angleRad = _getStripAngle(model.direction, item.bounds);
  const angleDeg = (angleRad * 180) / Math.PI;

  const clone = item.clone();
  clone.rotate(-angleDeg, new paper.Point(0, 0));

  const pathHeight = clone.bounds.height;
  const scaleCoef = pathHeight / model.count;

  const x = 0;
  const y =
    (Math.cos(angleRad) * item.bounds.y - Math.sin(angleRad) * item.bounds.x) /
    scaleCoef;
  const transform = `scale(${scaleCoef},${scaleCoef})rotate(${angleDeg})`;

  const color1 = builder.palette.getColor(model.color1);
  const color2 = builder.palette.getColor(model.color2);
  const patternNode = addPattern(builder.defs, id, x, y, 1, 1, transform);

  addRectangle(patternNode, 0, 0, 1, 1, color1);
  addRectangle(patternNode, 0, 0.5, 1, 0.5, color2);

  return id;
}

function _getStripAngle(direction: Direction, bounds: paper.Rectangle): number {
  switch (direction) {
    case "fasce":
      return 0;
    case "barre":
      return -Math.atan2(bounds.height, bounds.width);
    case "pal":
      return -Math.PI / 2;
    case "bande":
      return Math.atan2(bounds.height, bounds.width);
  }
}
