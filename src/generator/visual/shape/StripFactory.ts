import * as paper from "paper";
import { Direction } from "../../model.type";
import { FieldShape, StripShape } from "../type";

export function createStrips(
  container: FieldShape,
  angle: Direction,
  count: number
): StripShape[] {
  switch (angle) {
    case "fasce":
      return createFasces(container, count);
    case "pal":
      return createPals(container, count);
    case "bande":
      return createDiagonals(container, false, count);
    case "barre":
      return createDiagonals(container, true, count);
    default:
      console.log("invalid angle " + angle);
      return [];
  }
}

function createFasces(container: FieldShape, count: number): StripShape[] {
  const result = [];

  const bounds = container.path.bounds;
  const hStrip = bounds.height / (2 * count + 1);

  for (let i = 0; i < count; i++) {
    const topLeft = new paper.Point(bounds.x, bounds.y + (2 * i + 1) * hStrip);
    const strip = new paper.Path.Rectangle({
      point: topLeft,
      size: [bounds.width, hStrip],
    });

    const clippedStrip = _clip(strip, container);

    const stripShape: StripShape = {
      type: "strip",
      path: clippedStrip,
      direction: "fasce",
      angle: 0,
      width: hStrip,
      patternAnchor: topLeft,
    };

    result.push(stripShape);
  }

  return result;
}

function createPals(container: FieldShape, count: number): StripShape[] {
  const result = [];

  const bounds = container.path.bounds;
  const wStrip = bounds.width / (2 * count + 1);

  for (let i = 0; i < count; i++) {
    const topLeft = new paper.Point(bounds.x + (2 * i + 1) * wStrip, bounds.y);
    const strip = new paper.Path.Rectangle({
      point: topLeft,
      size: [wStrip, bounds.height],
    });

    const clippedStrip = _clip(strip, container);

    const stripShape: StripShape = {
      type: "strip",
      path: clippedStrip,
      direction: "pal",
      angle: Math.PI / 2,
      width: wStrip,
      patternAnchor: topLeft,
    };

    result.push(stripShape);
  }

  return result;
}

function createDiagonals(
  container: FieldShape,
  barre: boolean,
  count: number
): StripShape[] {
  const bounds = container.path.bounds;

  const w = bounds.width;
  const h = bounds.height;
  const x = bounds.x;
  const y = bounds.y;

  const d = w / ((2 * count + 1) * Math.SQRT2);
  const x0 = x - d * (2 * count - 1);

  // create the '\' diagonal
  const p0 = `${x0},${y}`;
  const p1 = `${x0 + 2 * d},${y}`;
  const p2 = `${x0 + w + 2 * d},${y + h}`;
  const p3 = `${x0 + w},${y + h}`;
  const pathData = `M ${p0} L ${p1} ${p2} ${p3} z`;

  const patternPath = new paper.Path(pathData);
  if (barre) {
    // Mirror to obtain the '/' diagonal
    const center = new paper.Point(x + w / 2, y + h / 2);
    patternPath.scale(-1, 1, center);
  }

  const vector = new paper.Point(barre ? [-4 * d, 0] : [4 * d, 0]);

  const angle = Math.atan2(h, w);
  const stripWidth = 2 * d * Math.sin(angle);

  const result = [];
  for (let i = 0; i < count; i++) {
    const stripPath = patternPath.clone();
    patternPath.translate(vector);

    const clippedStrip = _clip(stripPath, container);

    const stripShape: StripShape = {
      type: "strip",
      path: clippedStrip,
      direction: barre ? "barre" : "bande",
      angle: barre ? angle : Math.PI - angle, // rad
      width: stripWidth,
      patternAnchor: barre
        ? stripPath.bounds.topRight
        : stripPath.bounds.topLeft,
    };
    result.push(stripShape);
  }

  return result;
}

function _clip(path: paper.Path, container: FieldShape) {
  const clippedStrip = container.path.intersect(path);
  if (!(clippedStrip instanceof paper.Path)) {
    throw new Error("Clipped strip is not a simple Path");
  }
  return clippedStrip;
}
