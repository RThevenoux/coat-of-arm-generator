import * as paper from "paper";
import { point } from "./point";

type InCircleDef = {
  center: paper.Point;
  radius: number;
  nearest: paper.Point;
};

export function getIncircle(path: paper.PathItem): InCircleDef {
  let incirleDef = _getInitalIncircle(path);

  // Try to find a better incircle iteratively
  for (let i = 0; i < 10; i++) {
    // Find intersection between current incircle and path
    const center = incirleDef.center;
    // - Multiply radius by 1.05 to be sure the circle intersect the path
    const incircle = new paper.Path.Circle(center, incirleDef.radius * 1.05);
    const intersections = incircle.getIntersections(path);
    if (intersections.length == 0) {
      console.log("  Error > no intersection");
      break;
    }

    // Analyse intersection points to get a direction for the next incircle search
    const angles = intersections.map(
      (intersection) =>
        (-intersection.point.subtract(center).angle / 180) * Math.PI
    );
    const analysis = _analyseAngles(angles);
    if (analysis.delta >= Math.PI) {
      break;
    }

    // Find a better incircle in the median angle direction
    const searchAngle = Math.PI - analysis.median;
    const next = _nextIncircle(path, incirleDef, searchAngle);
    if (next == null) {
      // An error occur
      break;
    }
    incirleDef = next;
  }

  return incirleDef;
}

// NOTA : the path should be "almost" convex
function _getInitalIncircle(path: paper.PathItem): InCircleDef {
  // First, test 'interiorPoint'
  const center = path.interiorPoint;
  const incirleDef = _safeGetIncircleDef(path, center);
  if (incirleDef) return incirleDef;

  // If interiorPoint is on a border, check other point.
  // Loop until found a correct point
  let delta = path.bounds.width / 2;
  let result = null;
  while (result == null) {
    delta = delta / 2;
    result = _testNSEWIncirclDef(path, center, delta);
  }
  return result;
}

function _testNSEWIncirclDef(
  path: paper.PathItem,
  center: paper.Point,
  delta: number
): null | InCircleDef {
  const north = _safeGetIncircleDef(path, center.add(point(0, -delta)));
  if (north) return north;

  const south = _safeGetIncircleDef(path, center.add(point(0, delta)));
  if (south) return south;

  const east = _safeGetIncircleDef(path, center.add(point(delta, 0)));
  if (east) return east;

  const west = _safeGetIncircleDef(path, center.add(point(-delta, 0)));
  if (west) return west;

  return null;
}

function _safeGetIncircleDef(
  path: paper.PathItem,
  point: paper.Point
): null | InCircleDef {
  if (path.contains(point)) {
    const incirleDef = _getTangentCircleDef(path, point);
    if (incirleDef.radius != 0) {
      return incirleDef;
    }
  }
  return null;
}

function _nextIncircle(
  path: paper.PathItem,
  incircleDef: InCircleDef,
  angle: number
): null | InCircleDef {
  const oppositeDistance = _getIntersectionDistance(
    path,
    incircleDef.center,
    angle
  );
  if (oppositeDistance == 0) {
    // Error, do not find an intersection.
    return null;
  }
  const maxDelta = oppositeDistance - incircleDef.radius;

  // find the bigger inCircle on the line between
  // the old incircle's center and the intersection
  const n = 10;
  let maxIncircleDef = incircleDef;
  for (let i = 0; i < n; i++) {
    const vector = _vector(angle, (maxDelta / n) * (i + 1));
    const nextCenter = incircleDef.center.add(vector);
    const nextIncircleDef = _getTangentCircleDef(path, nextCenter);
    if (nextIncircleDef.radius > maxIncircleDef.radius) {
      maxIncircleDef = nextIncircleDef;
    }
  }

  return maxIncircleDef;
}

function _getIntersectionDistance(
  path: paper.PathItem,
  point: paper.Point,
  angle: number
): number {
  // trace a line in angle opposite direction
  const lineLenght = path.bounds.height + path.bounds.width; //
  const lineEnd = point.add(_vector(angle, lineLenght));
  const line = new paper.Path.Line(point, lineEnd);
  const intersections = line.getIntersections(path);
  if (intersections.length == 0) {
    console.log(
      "# IntersectionLine : No intersection! Point:" + point + " angle:" + angle
    );
    return 0;
  }
  return intersections[0].point.getDistance(point);
}

function _getTangentCircleDef(
  path: paper.PathItem,
  point: paper.Point
): InCircleDef {
  const nearest = path.getNearestPoint(point);
  const distance = nearest.getDistance(point);
  return {
    center: point,
    radius: distance,
    nearest: nearest,
  };
}

function _vector(angle: number, length: number): paper.Point {
  const unitVector = point(Math.cos(angle), Math.sin(angle));
  return unitVector.multiply(length);
}

function _analyseAngles(angles: number[]): {
  median: number;
  delta: number;
} {
  // If only one angle
  if (angles.length == 1) {
    return {
      median: angles[0],
      delta: 0,
    };
  }

  // If 2 or mores angles, compute a 'delta' between the two first angle,
  // then add each other angles and increase the delta if necessary
  const angle0 = angles[0];
  const angle1 = angles[1];

  let delta = _positiveDirectedAngleDelta(angle0, angle1);
  let min,
    max = null;
  if (delta < Math.PI) {
    min = angle0;
    max = angle1;
  } else {
    min = angle1;
    max = angle0;
    delta = 2 * Math.PI - delta;
  }

  // add each other angle
  for (let i = 2; i < angles.length; i++) {
    const angle = angles[i];
    const minToAngle = _positiveDirectedAngleDelta(min, angle);
    const minToMax = delta;
    if (minToAngle > minToMax) {
      const maxToAngle = minToAngle - minToMax;
      const angleToMin = 2 * Math.PI - minToAngle;
      if (maxToAngle < angleToMin) {
        max = angle;
      } else {
        min = angle;
      }
    }
    delta = _positiveDirectedAngleDelta(min, max);
  }

  // compute result
  const median = (min + delta / 2) % (2 * Math.PI);

  return {
    median: median,
    delta: delta,
  };
}

// return in interval [0, 2*PI]
function _positiveDirectedAngleDelta(a: number, b: number): number {
  let delta = (b - a) % (2 * Math.PI);
  if (delta < 0) {
    delta += 2 * Math.PI;
  }
  return delta;
}
