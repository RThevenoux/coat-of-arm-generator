import { point } from "../tool/point";
import { StripShape } from "../type";
import { RotationDef, StripGroupData } from "./StripFactoryData.type";

interface SingleStripe {
  path: paper.Path;
  patternAnchor: paper.Point;
}

export function buildStripShapes(
  data: StripGroupData,
  pattern: paper.Path
): StripShape[] {
  const result: StripShape[] = [];

  for (let groupIndex = 0; groupIndex < data.groupCount; groupIndex++) {
    for (let stripIndex = 0; stripIndex < data.stripByGroup; stripIndex++) {
      const position = stripPosition(data, groupIndex, stripIndex);
      const topLeft = point(position, data.fixedOrigin);
      const singleStrip = createSingleStrip(topLeft, pattern, data.rotation);

      result.push({
        type: "strip",
        path: singleStrip.path,
        root: data.root,
        stripDirection: data.rotation.direction,
        stripAngle: data.rotation.angle,
        stripWidth: data.stripWidth,
        patternAnchor: singleStrip.patternAnchor,
      });
    }
  }
  return result;
}

function stripPosition(
  data: StripGroupData,
  groupIndex: number,
  stripIndex: number
): number {
  const groupPosition =
    data.groupOrigin + (2 * groupIndex + 1) * data.mainDelta;
  return groupPosition + data.stripWidth * 2 * stripIndex;
}

function createSingleStrip(
  topLeft: paper.Point,
  stripPattern: paper.Path,
  rotation: RotationDef
): SingleStripe {
  const stripPath = stripPattern.clone();
  stripPath.translate(topLeft);

  stripPath.rotate(rotation.angle, rotation.center);
  const anchor = topLeft.rotate(-rotation.angle, rotation.center); // Not clear why rotation must be negate...
  return {
    path: stripPath,
    patternAnchor: anchor,
  };
}
