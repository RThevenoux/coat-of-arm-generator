import paper from "paper";
import { origin, point } from "../tool/point";
import {
  StripClones,
  StripComposition,
  StripShape,
  StripSingle,
} from "../type";
import { RotationDef, StripData } from "./strip.type";
import { createOutline } from "./OutlineFactory";

export function createSingleStrip(
  position: paper.Point,
  data: StripData,
  rotation: RotationDef
): StripSingle {
  const stripPath = createVerticalStripPath(data);
  const __bounds = stripPath.bounds;
  stripPath.translate(position);
  stripPath.rotate(rotation.angle, rotation.center);

  const anchor = position.rotate(-rotation.angle, rotation.center); // Not clear why rotation must be negate...

  const shape: StripShape = {
    type: "strip",
    path: stripPath,
    root: data.root,
    stripDirection: rotation.direction,
    stripAngle: rotation.angle,
    stripWidth: data.stripWidth,
    patternAnchor: anchor,
  };

  return {
    type: "stripSingle",
    filler: data.filler,
    shape,
    __bounds,
  };
}

function createHorizontalStripPath(strip: StripData): paper.Path {
  const topPath = createOutline(
    strip.stripLength,
    strip.stripWidth,
    strip.outline.outline1,
    false
  );

  const bottomPath = createOutline(
    strip.stripLength,
    strip.stripWidth,
    strip.outline.outline2,
    strip.outline.outline2Shifted
  );
  bottomPath.scale(1, -1, origin());
  bottomPath.reverse();
  bottomPath.translate(point(0, strip.stripWidth));

  const path = new paper.Path();
  path.join(topPath);
  path.lineTo(bottomPath.firstCurve.point1);
  path.join(bottomPath);
  path.lineTo(topPath.firstCurve.point1);
  path.closePath();

  return path.reduce({});
}

function createVerticalStripPath(data: StripData): paper.Path {
  const path = createHorizontalStripPath(data);
  path.rotate(90, origin());
  path.translate(point(data.stripWidth, 0));
  return path;
}

export function createStripClones(
  positions: paper.Point[],
  pattern: StripSingle | StripComposition,
  rotation: RotationDef
): StripClones {
  const patternBoundsPath = new paper.Path.Rectangle(pattern.__bounds);
  const cloneBounds: paper.Rectangle[] = [];
  for (const position of positions) {
    const clone = patternBoundsPath.clone();
    clone.translate(position);
    clone.rotate(rotation.angle, rotation.center);
    cloneBounds.push(clone.bounds);
  }

  return {
    type: "stripClones",
    clonePattern: pattern,
    clonePositions: cloneBounds,
  };
}
