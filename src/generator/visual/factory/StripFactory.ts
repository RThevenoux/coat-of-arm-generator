import * as paper from "paper";
import { Angle } from "../../model.type";

export {
  createStrip,
  createStrips,
  createPal,
  createPals,
  createFasce,
  createFasces,
  createDiagonal,
  createDiagonals,
};

function createStrip(bounds: paper.Rectangle, angle: Angle): paper.Path {
  return createStrips(bounds, angle, 1)[0];
}
function createStrips(
  bounds: paper.Rectangle,
  angle: Angle,
  count: number
): paper.Path[] {
  switch (angle) {
    case "0":
      return createFasces(bounds, count);
    case "90":
      return createPals(bounds, count);
    case "135":
      return createDiagonals(bounds, false, count);
    case "45":
      return createDiagonals(bounds, true, count);
    default:
      console.log("invalid angle " + angle);
      return [];
  }
}

function createPal(bounds: paper.Rectangle): paper.Path {
  return createPals(bounds, 1)[0];
}
function createPals(bounds: paper.Rectangle, count: number): paper.Path[] {
  const result = [];
  const hStrip = bounds.height / (2 * count + 1);
  for (let i = 0; i < count; i++) {
    result.push(
      new paper.Path.Rectangle({
        point: [bounds.x, bounds.y + (2 * i + 1) * hStrip],
        size: [bounds.width, hStrip],
      })
    );
  }
  return result;
}

function createFasce(bounds: paper.Rectangle): paper.Path {
  return createFasces(bounds, 1)[0];
}
function createFasces(bounds: paper.Rectangle, count: number): paper.Path[] {
  const result = [];
  const wStrip = bounds.width / (2 * count + 1);
  for (let i = 0; i < count; i++) {
    result.push(
      new paper.Path.Rectangle({
        point: [bounds.x + (2 * i + 1) * wStrip, bounds.y],
        size: [wStrip, bounds.height],
      })
    );
  }
  return result;
}

function createDiagonal(bounds: paper.Rectangle, reverse: boolean): paper.Path {
  return createDiagonals(bounds, reverse, 1)[0];
}

function createDiagonals(
  bounds: paper.Rectangle,
  reverse: boolean,
  count: number
): paper.Path[] {
  const w = bounds.width;
  const h = bounds.height;
  const x = bounds.x;
  const y = bounds.y;

  const d = w / (2 * count + 1) / Math.sqrt(2);
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

  const result = [];
  for (let i = 0; i < count; i++) {
    const stripPath = patternPath.clone();
    result.push(stripPath);
    patternPath.translate(vector);
  }
  return result;
}
