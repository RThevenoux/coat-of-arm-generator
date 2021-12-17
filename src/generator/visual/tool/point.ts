import * as paper from "paper";

export function point(x: number, y: number): paper.Point {
  return new paper.Point(x, y);
}

export function origin(): paper.Point {
  return point(0, 0);
}
