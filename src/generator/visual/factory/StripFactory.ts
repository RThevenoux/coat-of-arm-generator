import * as paper from "paper";
import { Direction } from "../../model.type";
import { FieldShape, StripShape } from "../type";

export function createStrips(
  container: FieldShape,
  angle: Direction,
  count: number
): StripShape[] {
  switch (angle) {
    case "0":
      return createFasces(container, count);
    case "90":
      return createPals(container, count);
    case "135":
      return createDiagonals(container, false, count);
    case "45":
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
    const strip = new paper.Path.Rectangle({
      point: [bounds.x, bounds.y + (2 * i + 1) * hStrip],
      size: [bounds.width, hStrip],
    });

    const clippedStrip = _clip(strip, container);

    const stripShape: StripShape = {
      type: "strip",
      path: clippedStrip,
      angle: "pal",
      width: hStrip,
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
    const strip = new paper.Path.Rectangle({
      point: [bounds.x + (2 * i + 1) * wStrip, bounds.y],
      size: [wStrip, bounds.height],
    });

    const clippedStrip = _clip(strip, container);

    const stripShape: StripShape = {
      type: "strip",
      path: clippedStrip,
      angle: "fasce",
      width: wStrip,
    };

    result.push(stripShape);
  }

  return result;
}

function createDiagonals(
  container: FieldShape,
  reverse: boolean,
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
  if (reverse) {
    // Mirror to obtain the '/' diagonal
    const center = new paper.Point(x + w / 2, y + h / 2);
    patternPath.scale(-1, 1, center);
  }

  const vector = new paper.Point(reverse ? [-4 * d, 0] : [4 * d, 0]);

  const angle = Math.atan2(w, h);
  const stripWidth = 2 * d * Math.sin(angle);

  const result = [];
  for (let i = 0; i < count; i++) {
    const stripPath = patternPath.clone();
    patternPath.translate(vector);

    const clippedStrip = _clip(stripPath, container);

    const stripShape: StripShape = {
      type: "strip",
      path: clippedStrip,
      angle: reverse ? angle : Math.PI - angle, // rad
      width: stripWidth,
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
