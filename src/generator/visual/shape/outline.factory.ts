import { OutlineVisualInfo } from "@/service/visual.type";
import * as paper from "paper";
import { point } from "../tool/point";

export function createOutline(
  length: number,
  unitSize: number,
  outlineInfo: OutlineVisualInfo,
  shifted: boolean
): paper.Path {
  const pattern = new paper.Path(outlineInfo.patternData);
  pattern.scale(unitSize * outlineInfo.scale, point(0, 0));

  return repeatPattern(pattern, length, shifted);
}

function repeatPattern(
  pattern: paper.Path,
  length: number,
  shifted: boolean
): paper.Path {
  const patternLength = pattern.bounds.width;
  const n = length / patternLength;
  const start = shifted ? -0.5 : 0;

  const path = new paper.Path();
  for (let i = start; i < n; i++) {
    const x = i * patternLength;
    const clone = pattern.clone();
    clone.translate(point(x, 0));

    path.join(clone);
  }
  return path.reduce({});
}
