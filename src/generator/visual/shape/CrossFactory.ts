import { ChargeCross, CrossSize } from "@/generator/model.type";
import * as paper from "paper";
import { point } from "../tool/point";
import { CrossShape, FieldShape, OtherShape, SimpleShape } from "../type";

export function createCross(
  cross: ChargeCross,
  container: FieldShape
): SimpleShape {
  if (cross.direction === "barre" || cross.direction === "bande") {
    return createDiagonalCross(cross.size, container);
  } else {
    return createStraigthCross(cross.size, container);
  }
}

function createStraigthCross(
  size: CrossSize,
  container: FieldShape
): CrossShape {
  const bounds = container.path.bounds;

  const shortestSide = Math.min(bounds.height, bounds.width);

  let coef;
  if (size == "default") {
    coef = 3;
  } else if (size == "reduced") {
    coef = 6;
  } else {
    coef = 12;
  }

  const width = shortestSide / coef;

  const xPal = bounds.x + (bounds.width - width) / 2;
  const yFasce = bounds.y + (bounds.height - width) / 2;

  const pal = new paper.Path.Rectangle({
    point: [xPal, bounds.y],
    size: [width, bounds.height],
  });
  const fasce = new paper.Path.Rectangle({
    point: [bounds.x, yFasce],
    size: [bounds.width, width],
  });
  const cross = pal.unite(fasce);
  const clipped = _clip(cross, container);

  const patternAnchor = point(xPal, yFasce);

  return {
    type: "cross",
    path: clipped,
    root: container.root,
    stripWidth: width,
    patternAnchor,
  };
}

function createDiagonalCross(
  size: CrossSize,
  container: FieldShape
): OtherShape {
  const bounds = container.path.bounds;

  const w = bounds.width;
  const h = bounds.height;
  const x = bounds.x;
  const y = bounds.y;

  let coef;
  if (size == "default") {
    coef = 6;
  } else if (size == "reduced") {
    coef = 12;
  } else {
    coef = 24;
  }

  const d = w / coef;
  const x0 = x - d;

  // create the '\' diagonal
  const p0 = `${x0},${y}`;
  const p1 = `${x0 + 2 * d},${y}`;
  const p2 = `${x0 + w + 2 * d},${y + h}`;
  const p3 = `${x0 + w},${y + h}`;
  const pathData = `M ${p0} L ${p1} ${p2} ${p3} z`;

  const strip1 = new paper.Path(pathData);
  const strip2 = strip1.clone();
  // Mirror to obtain the '/' diagonal
  const center = point(x + w / 2, y + h / 2);
  strip2.scale(-1, 1, center);

  const cross = strip1.unite(strip2);

  const clipped = _clip(cross, container);

  return {
    type: "other",
    path: clipped,
    root: container.root,
  };
}

function _clip(path: paper.PathItem, container: FieldShape): paper.Path {
  const clippedStrip = container.path.intersect(path);
  if (!(clippedStrip instanceof paper.Path)) {
    throw new Error("Clipped strip is not a simple Path");
  }
  return clippedStrip;
}
