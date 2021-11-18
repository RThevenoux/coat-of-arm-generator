import * as paper from "paper";

import { PatternTransform, svgTransform } from "../svg/SvgHelper";

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
  if (rotate) {
    anchor = anchor.rotate(rotate, new paper.Point(0, 0));
  }
  const x = anchor.x / scale;
  const y = anchor.y / scale;
  const transform = svgTransform(scale, rotate);
  return { x, y, transform };
}
