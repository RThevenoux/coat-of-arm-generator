import paper from 'paper';
import BezierTool from './tool/bezier-tool';
import getLineIntersection from './tool/affine-tool';

export default function createBorder(path, offset) {
  if (!path.clockwise) {
    path.reverse();
  }

  let result = null;
  let firstPath = null;
  let previousPath = null;
  for (let curve of path.curves) {
    let borderInfo = createCurveBorder(curve, offset);

    if (path.closed) {
      borderInfo.solid = clip(borderInfo.solid, path);
    }

    // Join with the current result;
    if (!result) {
      result = borderInfo.solid;
      firstPath = borderInfo.offsetPath;
    } else {
      let joinPoint = curve.point1;
      result = joinBorder(previousPath, borderInfo.offsetPath, joinPoint, result, path);
      result = unite(result, borderInfo.solid);
    }
    previousPath = borderInfo.offsetPath;
  }

  if (path.closed) {
    let joinPoint = path.firstSegment.point;
    result = joinBorder(previousPath, firstPath, joinPoint, result, path);
  }
  return result;
}

function joinBorder(path1, path2, joinPoint, result, clipPath) {
  let cap = computeCap(joinPoint, path1, path2);
  if (cap) {
    cap = clip(cap, clipPath);
    return unite(result, cap);
  }
  return result;
}

function unite(path1, path2) {
  let temp = path1.unite(path2);
  path1.remove();
  path2.remove();
  return temp;
}

function clip(path, clip) {
  let temp = clip.intersect(path);
  path.remove();
  return temp;
}

function computeCap(point, previousPath, nextPath) {
  let intersections = previousPath.getIntersections(nextPath);
  if (intersections.length > 0) {
    // No cap if intersection
    return null;
  }

  let p1 = previousPath.lastSegment.point;
  let p2 = nextPath.firstSegment.point;

  let v1 = p1.subtract(point);
  let tangent1 = v1.rotate(-90);

  let v2 = p2.subtract(point);
  let tangent2 = v2.rotate(90);

  let dot = v1.dot(v2);

  if (dot >= 0) { // Mitter Cap
    let intersection = getLineIntersection(p1, tangent1, p2, tangent2);
    let cap = new paper.Path();
    cap.add(p1);
    cap.add(point);
    cap.add(p2);
    cap.add(intersection);
    cap.closePath();
    return cap;
  }

  // Else mitter-bevel
  let p1Bis = p1.add(tangent1);
  let p2Bis = p2.add(tangent2);

  let cap = new paper.Path();
  cap.add(p1);
  cap.add(point);
  cap.add(p2);
  cap.add(p2Bis);
  cap.add(p1Bis);

  cap.closePath();
  return cap;
}

function createCurveBorder(curve, offset) {
  if (curve.classify().type != "line") {
    let bezier = BezierTool.curveToBezier(curve);
    let offsetBeziers = bezier.offset(offset);
    let offsetPath = BezierTool.beziersToPath(offsetBeziers);

    let reversed = curve.reversed();

    let solid = offsetPath.clone();
    let segment1 = reversed.segment1.clone();
    segment1.handleIn = null;
    solid.add(segment1);

    let segment2 = reversed.segment2.clone();
    segment2.handleOut = null;
    solid.add(segment2);

    solid.closePath();

    return {
      offsetPath: offsetPath,
      solid: solid
    };
  } else {
    let p1 = curve.point1;
    let p2 = curve.point2;

    let angle = 90;
    let vector = p2.subtract(p1).normalize(offset).rotate(angle);

    let offsetPath = new paper.Path([p1, p2]);
    offsetPath.translate(vector);

    let solid = offsetPath.clone();
    solid.add(p2);
    solid.add(p1);
    solid.closePath();

    return {
      offsetPath: offsetPath,
      solid: solid
    };
  }
}