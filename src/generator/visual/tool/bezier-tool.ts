import { Bezier, Point } from "bezier-js";
import * as paper from "paper";

export default {
  beziersToPath: beziersToPath,
  curveToBezier: curveToBezier,
};

function curveToBezier(curve: paper.Curve): Bezier {
  const p1 = curve.point1;
  let handle1 = curve.points[1]; // Do not use curve.handle1 to have absolute position;
  const handle2 = curve.points[2]; // Idem
  const p2 = curve.point2;

  if (p1.x == handle1.x && p1.y == handle1.y) {
    // If p1 == handle1, Bezier.offset() method fail
    // So, slighty change handle1 with the tangent to minize visual effect
    handle1 = handle1.add(curve.getTangentAtTime(0));
  }

  return new Bezier(
    p1.x,
    p1.y,
    handle1.x,
    handle1.y,
    handle2.x,
    handle2.y,
    p2.x,
    p2.y
  );
}

function beziersToPath(beziers: Bezier[]): paper.Path {
  const path = new paper.Path();

  const firstLine = beziers[0];
  const start = new paper.Point(firstLine.points[0]);
  const handleOut = relativePoint(start, firstLine.points[1]);
  const firstSegment = new paper.Segment(start, undefined, handleOut);
  path.add(firstSegment);

  for (let i = 1; i < beziers.length; i++) {
    const beforeLine = beziers[i - 1];
    const afterLine = beziers[i];

    const start = new paper.Point(afterLine.points[0]);
    const handleIn = relativePoint(start, beforeLine.points[2]);
    const handleOut = relativePoint(start, afterLine.points[1]);
    const segment = new paper.Segment(start, handleIn, handleOut);
    path.add(segment);
  }

  const lastLine = beziers[beziers.length - 1];
  const end = new paper.Point(lastLine.points[3]);
  const handleIn = relativePoint(end, lastLine.points[2]);
  const lastSegment = new paper.Segment(end, handleIn, undefined);
  path.add(lastSegment);

  return path;
}

function relativePoint(reference: Point, point: Point): paper.Point {
  return new paper.Point(point.x - reference.x, point.y - reference.y);
}
