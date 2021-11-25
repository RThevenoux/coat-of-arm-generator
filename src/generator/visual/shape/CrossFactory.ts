import * as paper from "paper";
import { CrossShape, FieldShape, OtherShape } from "../type";

export function createCross(container: FieldShape): CrossShape {
  const bounds = container.path.bounds;

  const width =
    bounds.height > bounds.width ? bounds.width / 3 : bounds.height / 3;

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

  const patternAnchor = new paper.Point(xPal, yFasce);

  return {
    type: "cross",
    path: clipped,
    stripWidth: width,
    patternAnchor,
  };
}

export function createCrossSaltire(container: FieldShape): OtherShape {
  const bounds = container.path.bounds;

  const w = bounds.width;
  const h = bounds.height;
  const x = bounds.x;
  const y = bounds.y;

  const d = w / (5 * Math.SQRT2);
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
  const center = new paper.Point(x + w / 2, y + h / 2);
  strip2.scale(-1, 1, center);

  const cross = strip1.unite(strip2);

  const clipped = _clip(cross, container);

  return {
    type: "other",
    path: clipped,
  };
}

function _clip(path: paper.PathItem, container: FieldShape): paper.Path {
  const clippedStrip = container.path.intersect(path);
  if (!(clippedStrip instanceof paper.Path)) {
    throw new Error("Clipped strip is not a simple Path");
  }
  return clippedStrip;
}
