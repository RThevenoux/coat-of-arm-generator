import * as paper from "paper";
import { FillerStrip } from "@/generator/model.type";
import { addPattern, addRectangle } from "../svg/SvgHelper";
import { SimpleShape, SymbolShape } from "../type";
import SvgBuilder from "../SvgBuilder";

export function createStripFiller(
  builder: SvgBuilder,
  model: FillerStrip,
  container: SimpleShape | SymbolShape,
  id: string
): string {
  const item = getItem(container);
  switch (model.direction) {
    case "pal":
      createPal(builder, model, item, id);
      break;
    case "fasce":
      createFasce(builder, model, item, id);
      break;
    case "bande":
      createDiagonal(builder, model, true, item, id);
      break;
    case "barre":
      createDiagonal(builder, model, false, item, id);
      break;
    default:
      throw new Error("Unsupported direction: " + model.direction);
  }
  return id;
}

function createPal(
  builder: SvgBuilder,
  model: FillerStrip,
  item: paper.Item,
  id: string
) {
  const pathWidth = item.bounds.width;
  const scaleCoef = pathWidth / model.count;

  const x = item.bounds.x / scaleCoef;
  const y = 0; // pattern is invariant by y-translation
  const transform = `scale(${scaleCoef},${scaleCoef})`;
  const transformParam = { x, y, transform };

  const color1 = builder.palette.getColor(model.color1);
  const color2 = builder.palette.getColor(model.color2);
  const patternNode = addPattern(builder.defs, id, 1, 1, transformParam);

  addRectangle(patternNode, 0, 0, 1, 1, color1);
  addRectangle(patternNode, 0.5, 0, 0.5, 1, color2);
}

function createFasce(
  builder: SvgBuilder,
  model: FillerStrip,
  item: paper.Item,
  id: string
): void {
  const pathHeight = item.bounds.height;
  const scaleCoef = pathHeight / model.count;

  const x = 0; // pattern is invariant by x-translation
  const y = item.bounds.y / scaleCoef;
  const transform = `scale(${scaleCoef},${scaleCoef})`;
  const transformParam = { x, y, transform };

  const color1 = builder.palette.getColor(model.color1);
  const color2 = builder.palette.getColor(model.color2);
  const patternNode = addPattern(builder.defs, id, 1, 1, transformParam);

  addRectangle(patternNode, 0, 0, 1, 1, color1);
  addRectangle(patternNode, 0, 0.5, 1, 0.5, color2);
}

function createDiagonal(
  builder: SvgBuilder,
  model: FillerStrip,
  bande: boolean,
  item: paper.Item,
  id: string
): void {
  const angleRad = Math.atan2(item.bounds.height, item.bounds.width);
  const angleDeg = (angleRad * 180) / Math.PI;

  const clone = item.clone();

  const rotationDeg = bande ? 90 - angleDeg : angleDeg - 90;
  // paperjs rotation is anti-clockwise
  clone.rotate(rotationDeg, new paper.Point(0, 0));

  const scaleCoef = clone.bounds.width / model.count;

  const x = clone.bounds.left / scaleCoef;
  const y = 0; // pattern is invariant by y-translation
  // svg rotation is clockwise
  const transform = `scale(${scaleCoef},${scaleCoef})rotate(${-rotationDeg})`;
  const transformParam = { x, y, transform };

  const color1 = builder.palette.getColor(model.color1);
  const color2 = builder.palette.getColor(model.color2);
  const patternNode = addPattern(builder.defs, id, 1, 1, transformParam);

  addRectangle(patternNode, 0, 0, 1, 1, color1);
  if (bande) {
    addRectangle(patternNode, 0, 0, 0.5, 1, color2);
  } else {
    addRectangle(patternNode, 0.5, 0, 0.5, 1, color2);
  }
}

function getItem(container: SimpleShape | SymbolShape): paper.Item {
  if (container.type === "symbol") {
    return container.item;
  } else {
    return container.path;
  }
}
