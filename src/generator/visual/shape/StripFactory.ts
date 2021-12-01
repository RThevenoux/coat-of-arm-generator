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
  const ratio = 1 / (2 * count + 1);
  const bounds = container.path.bounds;
  const hStrip = bounds.height * ratio;

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
      root: container.root,
      stripDirection: "fasce",
      stripAngle: 90,
      stripWidth: hStrip,
      patternAnchor: topLeft,
    };

    result.push(stripShape);
  }

  return result;
}

function createPals(container: FieldShape, count: number): StripShape[] {
  const result = [];
  const ratio = 1 / (2 * count + 1);
  const bounds = container.path.bounds;
  const wStrip = bounds.width * ratio;

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
      root: container.root,
      stripDirection: "pal",
      stripAngle: 0,
      stripWidth: wStrip,
      patternAnchor: topLeft,
    };

    result.push(stripShape);
  }

  return result;
}

function createDiagonals(container: FieldShape, barre: boolean, count: number) {
  const path = container.path;

  const angleRad = Math.atan2(path.bounds.height, path.bounds.width);
  const angleDeg = (angleRad * 180) / Math.PI;
  const rotationDeg = barre ? 90 - angleDeg : angleDeg - 90;

  const clone = path.clone();
  // paperjs rotation is clockwise
  const rotCenter = new paper.Point(0, 0);
  clone.rotate(-rotationDeg, rotCenter);

  const result = [];
  const ratio = 1 / (2 * count + 1);
  const bounds = clone.bounds;
  const wStrip = bounds.width * ratio;

  for (let i = 0; i < count; i++) {
    const topLeft = new paper.Point(bounds.x + (2 * i + 1) * wStrip, bounds.y);
    const strip = new paper.Path.Rectangle({
      point: topLeft,
      size: [wStrip, bounds.height],
    });
    strip.rotate(rotationDeg, rotCenter);

    const clippedStrip = _clip(strip, container);

    const stripShape: StripShape = {
      type: "strip",
      path: clippedStrip,
      root: container.root,
      stripDirection: barre ? "barre" : "bande",
      stripAngle: rotationDeg,
      stripWidth: wStrip,
      patternAnchor: topLeft.rotate(-rotationDeg, rotCenter), // Not clear why rotation must be negate...
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
