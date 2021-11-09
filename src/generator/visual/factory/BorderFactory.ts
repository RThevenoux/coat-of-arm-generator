import paper from "paper";
import BezierTool from "../tool/bezier-tool";
import getLineIntersection from "../tool/affine-tool";
import { MyPathItem } from "../type";
import { Bezier } from "bezier-js";
import { Segment } from "paper/dist/paper-core";

export default function createBorder(
  path: MyPathItem,
  offset: number
): MyPathItem {
  if (!path.clockwise) {
    path.reverse();
  }

  if (path.curves.length == 0) {
    console.log(
      "createBorder: no curves. Path bounds=" +
        path.bounds +
        " area=" +
        path.area
    );
  }

  const first = _firstCurve(path.curves[0], offset, path);

  let result = first.result;
  const firstPath = first.firstPath;
  let previousPath = first.firstPath;

  for (let i = 1; i < path.curves.length; i++) {
    const curve = path.curves[i];
    const borderInfo = createCurveBorder(curve, offset);

    if (path.closed) {
      borderInfo.solid = clip(borderInfo.solid, path);
    }

    // Join with the current result;

    const joinPoint = curve.point1;
    result = joinBorder(
      previousPath,
      borderInfo.offsetPath,
      joinPoint,
      result,
      path
    );
    result = unite(result, borderInfo.solid);

    previousPath = borderInfo.offsetPath;
  }

  if (path.closed) {
    const joinPoint = path.firstSegment.point;
    result = joinBorder(previousPath, firstPath, joinPoint, result, path);
  }
  return result;
}

function _firstCurve(
  curve: paper.Curve,
  offset: number,
  clipper: MyPathItem
): { result: MyPathItem; firstPath: MyPathItem } {
  const borderInfo = createCurveBorder(curve, offset);
  if (clipper.closed) {
    borderInfo.solid = clip(borderInfo.solid, clipper);
  }
  return {
    result: borderInfo.solid,
    firstPath: borderInfo.offsetPath,
  };
}

function joinBorder(
  path1: MyPathItem,
  path2: MyPathItem,
  joinPoint: paper.Point,
  result: MyPathItem,
  clipPath: MyPathItem
): MyPathItem {
  const cap = computeCap(joinPoint, path1, path2);
  if (cap) {
    const clipped = clip(cap, clipPath);
    return unite(result, clipped);
  }
  return result;
}

function unite(path1: paper.PathItem, path2: paper.PathItem): MyPathItem {
  const temp = path1.unite(path2);
  path1.remove();
  path2.remove();
  return temp as MyPathItem;
}

function clip(path: MyPathItem, clip: MyPathItem): MyPathItem {
  const temp = clip.intersect(path);
  path.remove();
  return temp as MyPathItem;
}

function computeCap(
  point: paper.Point,
  previousPath: MyPathItem,
  nextPath: MyPathItem
): paper.Path | null {
  const intersections = previousPath.getIntersections(nextPath);
  if (intersections.length > 0) {
    // No cap if intersection
    return null;
  }

  const p1 = previousPath.lastSegment.point;
  const p2 = nextPath.firstSegment.point;

  const v1 = p1.subtract(point);
  const tangent1 = v1.rotate(-90, undefined as unknown as paper.Point);

  const v2 = p2.subtract(point);
  const tangent2 = v2.rotate(90, undefined as unknown as paper.Point);

  const dot = v1.dot(v2);

  if (dot >= 0) {
    // Mitter Cap

    const cap = new paper.Path();
    cap.add(p1);
    cap.add(point);
    cap.add(p2);

    const intersection = getLineIntersection(p1, tangent1, p2, tangent2);

    if (intersection == null) {
      console.log("Colinear! Can not create correct cap");
    } else {
      cap.add(intersection);
    }

    cap.closePath();
    return cap;
  }

  // Else mitter-bevel
  const p1Bis = p1.add(tangent1);
  const p2Bis = p2.add(tangent2);

  const cap = new paper.Path();
  cap.add(p1);
  cap.add(point);
  cap.add(p2);
  cap.add(p2Bis);
  cap.add(p1Bis);

  cap.closePath();
  return cap;
}

interface ClassifyResult {
  type: "line" | "quadratic" | "serpentine" | "cusp" | "loop" | "arch";
  roots: number[];
}

function createCurveBorder(
  curve: paper.Curve,
  offset: number
): { offsetPath: paper.Path; solid: MyPathItem } {
  const type = (curve.classify() as ClassifyResult).type;

  if (type != "line") {
    const bezier = BezierTool.curveToBezier(curve);
    const offsetBeziers = bezier.offset(offset) as Bezier[];
    const offsetPath = BezierTool.beziersToPath(offsetBeziers);

    const reversed = curve.reversed();

    const solid = offsetPath.clone();
    const segment1 = reversed.segment1;
    solid.add(new Segment(segment1.point, undefined, segment1.handleOut));

    const segment2 = reversed.segment2;
    solid.add(new Segment(segment2.point, segment2.handleIn, undefined));

    solid.closePath();

    return {
      offsetPath: offsetPath,
      solid: solid,
    };
  } else {
    const p1 = curve.point1;
    const p2 = curve.point2;

    const angle = 90;
    const vector = p2
      .subtract(p1)
      .normalize(offset)
      .rotate(angle, undefined as unknown as paper.Point);

    const offsetPath = new paper.Path([p1, p2]);
    offsetPath.translate(vector);

    const solid = offsetPath.clone();
    solid.add(p2);
    solid.add(p1);
    solid.closePath();

    return {
      offsetPath: offsetPath,
      solid: solid,
    };
  }
}
