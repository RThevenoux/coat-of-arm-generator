import * as paper from "paper";

import { PatternTransform, TransformList } from "../svg/svg.type";

/**
 * @param anchor
 * @param scale
 * @returns patternTransform that can be used to create a svg-pattern
 */
export function createPatternTransfrom(
  anchor: paper.Point,
  scale: number,
  rotate?: number
): PatternTransform {
  const transformList: TransformList = [];

  if (rotate && rotate != 0) {
    transformList.push({ type: "rotate", angle: rotate });
    anchor = anchor.rotate(rotate, new paper.Point(0, 0));
  }
  const x = anchor.x / scale;
  const y = anchor.y / scale;

  if (scale != 1) {
    transformList.push({ type: "scale", sx: scale });
  }

  return { x, y, transformList };
}
