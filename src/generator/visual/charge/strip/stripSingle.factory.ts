import { StripSingle } from "./type";
import { StripShape } from "../../type";
import { createVerticalStripPath } from "../../shape/strip.factory";
import { StripData } from "../../shape/strip.type";
import { StripRotationHelper } from "./StripRotationHelper";

export function createSingleStrip(
  position: paper.Point,
  data: StripData,
  rotation: StripRotationHelper
): StripSingle {
  const stripPath = createVerticalStripPath(data);
  stripPath.translate(position);
  const __bounds = stripPath.bounds;

  rotation.rotatePath(stripPath);
  const anchor = rotation.rotatePoint(position);

  const shape: StripShape = {
    type: "strip",
    path: stripPath,
    root: data.root,
    stripDirection: rotation.direction,
    stripAngle: rotation.angle,
    stripWidth: data.width,
    patternAnchor: anchor,
  };

  return {
    type: "stripSingle",
    filler: data.filler,
    shape,
    __bounds,
  };
}
