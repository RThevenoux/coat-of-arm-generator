import paper from "paper";
import BezierTool from "../tool/bezier-tool";
import getLineIntersection from "../tool/affine-tool";
import { Bezier } from "bezier-js";
import { Segment } from "paper/dist/paper-core";
import { BorderShape, SimpleShape } from "../type";

/**
 *
 * @param path
 * @param offset
 * @throws Error if the border can not be created
 * @returns
 */
export default function createBorder(
  path: paper.Path,
  offset: number,
  rootShape: SimpleShape
): BorderShape {
  if (!path.clockwise) {
    path.reverse();
  }

  if (path.curves.length == 0) {
    throw new Error(
      "Can not create border. Input path does not contains curves"
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

  const inner = path.subtract(result);
  if (!(inner instanceof paper.Path)) {
    throw new Error("Border interrior is not a simple Path");
  }

  return {
    type: "border",
    path: result,
    root: rootShape,
    inner: {
      type: "field",
      path: inner,
      root: rootShape,
    },
  };
}

function _firstCurve(
  curve: paper.Curve,
  offset: number,
  clipper: paper.Path
): { result: paper.PathItem; firstPath: paper.Path } {
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
  path1: paper.Path,
  path2: paper.Path,
  joinPoint: paper.Point,
  result: paper.PathItem,
  clipPath: paper.Path
): paper.PathItem {
  const cap = computeCap(joinPoint, path1, path2);
  if (cap) {
    const clipped = clip(cap, clipPath);
    return unite(result, clipped);
  }
  return result;
}

function unite(path1: paper.PathItem, path2: paper.PathItem): paper.PathItem {
  const temp = path1.unite(path2);
  path1.remove(); // Removed from project
  path2.remove(); // Removed from project
  return temp;
}

function clip(path: paper.PathItem, clip: paper.PathItem): paper.PathItem {
  const temp = clip.intersect(path);
  path.remove(); // Removed from project
  return temp;
}

function computeCap(
  point: paper.Point,
  previousPath: paper.Path,
  nextPath: paper.Path
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
      console.warn("Colinear! Can not create correct cap");
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
): { offsetPath: paper.Path; solid: paper.PathItem } {
  const type = (curve.classify() as ClassifyResult).type;
  if (type == "line") {
    return createLineBorder(curve, offset);
  } else {
    return createBezierBorder(curve, offset);
  }
}

function createLineBorder(
  curve: paper.Curve,
  offset: number
): { offsetPath: paper.Path; solid: paper.PathItem } {
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

function createBezierBorder(
  curve: paper.Curve,
  offset: number
): { offsetPath: paper.Path; solid: paper.PathItem } {
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
}
