import { OutlineVisualData } from "@/service/OutlineData";
import * as paper from "paper";
import { origin, point } from "../tool/point";

export function createOutline(
  length: number,
  unitSize: number,
  outlineInfo?: OutlineVisualData
): paper.Path {
  if (!outlineInfo) {
    return line(length);
  }

  if (outlineInfo.type == "pattern") {
    const pattern = new paper.Path(outlineInfo.patternData);
    pattern.scale(unitSize * outlineInfo.scale, point(0, 0));
    const patternLength = pattern.bounds.width;
    const n = Math.ceil(length / patternLength);

    return repeatPattern(pattern, n);
  } else {
    // undefined or straight
    return line(length);
  }
}

function line(length: number): paper.Path {
  return new paper.Path.Line(origin(), point(length, 0));
}

function repeatPattern(pattern: paper.Path, n: number): paper.Path {
  const patternLength = pattern.bounds.width;

  const path = new paper.Path();
  for (let i = 0; i < n; i++) {
    const x0 = i * patternLength;
    const clone = pattern.clone();
    clone.translate(point(x0, 0));
    path.addSegments(clone.segments);
  }
  return path;
}
