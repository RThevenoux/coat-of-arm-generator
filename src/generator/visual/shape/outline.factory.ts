import { OutlineVisualData } from "@/service/OutlineData";
import * as paper from "paper";
import { origin, point } from "../tool/point";

export function createOutline(
  length: number,
  unitSize: number,
  outlineInfo: OutlineVisualData,
  shifted: boolean
): paper.Path {
  if (!outlineInfo) {
    return line(length);
  }

  if (outlineInfo.type == "pattern") {
    const pattern = new paper.Path(outlineInfo.patternData);
    pattern.scale(unitSize * outlineInfo.scale, point(0, 0));

    return repeatPattern(pattern, length, shifted);
  } else {
    // undefined or straight
    return line(length);
  }
}

function line(length: number): paper.Path {
  return new paper.Path.Line(origin(), point(length, 0));
}

function repeatPattern(
  pattern: paper.Path,
  length: number,
  shifted: boolean
): paper.Path {
  const patternLength = pattern.bounds.width;
  const n = length / patternLength;
  const start = shifted ? -0.5 : 0;

  /*
  const patternHeight = pattern.bounds.height;
  const lineH = 2 * patternHeight;
  const rightLine = new paper.Path.Line(
    point(length, -2 * lineH),
    point(length, lineH)
  );
  const leftLine = new paper.Path.Line(point(0, -lineH), point(0, lineH));
  */

  const path = new paper.Path();
  for (let i = start; i < n; i++) {
    const x = i * patternLength;
    const clone = pattern.clone();
    clone.translate(point(x, 0));

    // Cut pattern
    /*
    const cloneMaxX = clone.bounds.x + clone.bounds.width;
    if (clone.bounds.x >= 0) {
      if (cloneMaxX <= length) {
    */
    path.join(clone);
    /*
      } else {
        const rightCut = cutRigth(clone, rightLine);
        path.join(rightCut);
      }
    } else {
      if (cloneMaxX <= length) {
        const leftCut = cutLeft(clone, leftLine);
        path.join(leftCut);
      } else {
        const leftCut = cutLeft(clone, leftLine);
        const bothCut = cutRigth(leftCut, rightLine);
        path.join(bothCut);
      }
    }
    */
  }
  return path.reduce({});
}

/*
function cutLeft(path: paper.Path, cutLine: paper.Path.Line): paper.Path {
  const clone = path.clone();
  const intersections = clone.getIntersections(cutLine);

  if (intersections.length == 0) {
    // Error : path do not cross cutLine
  }

  const result = new paper.Path();

  for (let i = 0; i < intersections.length; i++) {
    const intersection = intersections[i];

  }
  if (intersections.length == 1) {
    const crossing = intersections[0];
    return clone.splitAt(crossing); //only keep remaining
  } else {
    console.warn("More than 1 left-crossing");
    return new paper.Path.Line(
      point(cutLine.bounds.x, 0),
      point(path.bounds.x + path.bounds.width, 0)
    );
  }
}

function cutRigth(path: paper.Path, cutLine: paper.Path.Line): paper.Path {
  const clone = path.clone();
  const intersection = clone.getIntersections(cutLine);
  if (intersection.length == 1) {
    const crossing = intersection[0];
    clone.splitAt(crossing); //only keep remaining
    return clone;
  } else {
    console.warn("More than 1 right-crossing");
    return new paper.Path.Line(
      point(path.bounds.x, 0),
      point(cutLine.bounds.x, 0)
    );
  }
}*/
