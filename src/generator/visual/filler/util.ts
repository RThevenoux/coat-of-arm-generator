import * as paper from "paper";

import { PatternTransform, TransformList } from "../svg/svg.type";
import { origin } from "../tool/point";
import { SimpleShape, MobileChargeShape } from "../type";

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
    anchor = anchor.rotate(rotate, origin());
  }
  const x = anchor.x / scale;
  const y = anchor.y / scale;

  if (scale != 1) {
    transformList.push({ type: "scale", sx: scale });
  }

  return { x, y, transformList };
}

export function getItem(
  container: SimpleShape | MobileChargeShape
): paper.Item {
  if (container.type === "mobileCharge") {
    return container.item;
  } else {
    return container.path;
  }
}
