import { OutlineId } from "@/generator/model.type";
import { getOutlineInfo } from "@/service/OutlineService";
import * as paper from "paper";

export function createOutline(
  length: number,
  unitSize: number,
  outlineId?: OutlineId
): paper.Path {
  if (!outlineId) {
    return line(length);
  }

  const outlineInfo = getOutlineInfo(outlineId);

  if (outlineInfo.type == "pattern") {
    const pattern = new paper.Path(outlineInfo.patternData);
    pattern.scale(unitSize, point(0, 0));
    const patternLength = pattern.bounds.width;
    const n = Math.ceil(length / patternLength);

    return repeatPattern(pattern, n);
  } else {
    // undefined or straight
    return line(length);
  }
}

function point(x: number, y: number): paper.Point {
  return new paper.Point(x, y);
}

function line(length: number): paper.Path {
  return new paper.Path.Line(point(0, 0), point(length, 0));
}

function repeatPattern(pattern: paper.Path, n: number): paper.Path {
  const patternLength = pattern.bounds.width;

  const path = new paper.Path();
  for (let i = 0; i < n; i++) {
    const x0 = i * patternLength;
    const clone = pattern.clone();
    clone.translate(new paper.Point(x0, 0));
    path.addSegments(clone.segments);
  }
  return path;
}
