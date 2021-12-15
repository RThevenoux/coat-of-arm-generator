import * as paper from "paper";
import { Outline } from "./Outline.type";

export function createOutline(
  length: number,
  unitSize: number,
  outline?: Outline
): paper.Path {
  if (outline == "square") {
    const path = new paper.Path();

    const n = Math.ceil(length / (2 * unitSize));
    for (let i = 0; i < n; i++) {
      const x0 = i * 2 * unitSize;
      path.add(point(x0, 0));
      path.add(point(x0 + unitSize, 0));
      path.add(point(x0 + unitSize, unitSize));
      path.add(point(x0 + 2 * unitSize, unitSize));
    }
    return path;
  } else if (outline == "triangle") {
    const path = new paper.Path();
    const n = Math.ceil(length / (2 * unitSize));
    for (let i = 0; i < n; i++) {
      const x0 = i * 2 * unitSize;
      path.add(point(x0, -unitSize / 2));
      path.add(point(x0 + unitSize, unitSize / 2));
    }
    path.add(point(n * 2 * unitSize, -unitSize / 2));

    return path;
  } else if (outline == "remi") {
    const path = new paper.Path();
    const n = Math.ceil(length / (2 * unitSize));
    for (let i = 0; i < n; i++) {
      const x0 = i * 2 * unitSize;
      path.add(point(x0 + 0.0 * unitSize, 0));
      path.add(point(x0 + 0.5 * unitSize, 0));
      path.add(point(x0 + 1.0 * unitSize, -unitSize));
      path.add(point(x0 + 1.5 * unitSize, 0));
    }
    path.add(point(n * 2 * unitSize, 0));

    return path;
  } else {
    // undefined or straight
    const path = new paper.Path();
    path.add(point(0, 0));
    path.add(point(length, 0));
    return path;
  }
}

function point(x: number, y: number): paper.Point {
  return new paper.Point(x, y);
}
