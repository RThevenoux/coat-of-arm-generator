import paper from 'paper-jsdom';

export { getIncircle }

function getIncircle(path) {
  let incirleDef = _getInitalIncircle(path);

  // Try to find a better incircle iteratively
  for (let i = 0; i < 10; i++) {
    // Find intersection between current incircle and path
    let center = incirleDef.center;
    // - Multiply radius by 1.05 to be sure the circle intersect the path
    let incircle = new paper.Path.Circle(center, incirleDef.radius * 1.05);
    let intersections = incircle.getIntersections(path);
    if (intersections.length == 0) {
      console.log("  Error > no intersection");
      break;
    }

    // Analyse intersection points to get a direction for the next incircle search
    let angles = intersections.map(intersection => -intersection.point.subtract(center).angle / 180 * Math.PI);
    let analysis = _analyseAngles(angles);
    if (analysis.delta >= Math.PI) {
      break;
    }

    // Find a better incircle in the median angle direction
    let searchAngle = Math.PI - analysis.median;
    let next = _nextIncircle(path, incirleDef, searchAngle);
    if (next == null) {
      // An error occur
      break;
    }
    incirleDef = next;
  }

  return incirleDef;
}

// NOTA : the path should be "almost" convex
function _getInitalIncircle(path) {
  // First, test 'interiorPoint'
  let center = path.interiorPoint;
  let incirleDef = _safeGetIncircleDef(path, center);
  if (incirleDef) return incirleDef;

  // If interiorPoint is on a border, check other point.
  // Loop until found a correct point
  let i = 1;
  while (true) {
    let delta = path.bounds.width / (Math.pow(2, i));

    let north = _safeGetIncircleDef(path, center.add([0, -delta]));
    if (north) return north;

    let south = _safeGetIncircleDef(path, center.add([0, delta]));
    if (south) return south;

    let east = _safeGetIncircleDef(path, center.add([delta, 0]));
    if (east) return east;

    let west = _safeGetIncircleDef(path, center.add([-delta, 0]));
    if (west) return west;

    i++;
  }
}

function _safeGetIncircleDef(path, point) {
  if (path.contains(point)) {
    let incirleDef = _getTangentCircleDef(path, point);
    if (incirleDef.radius != 0) {
      return incirleDef;
    }
  }
  return null;
}

function _nextIncircle(path, incircleDef, angle) {
  let oppositeDistance = _getIntersectionDistance(path, incircleDef.center, angle);
  if (oppositeDistance == 0) {
    // Error, do not find an intersection.
    return null;
  }
  let maxDelta = oppositeDistance - incircleDef.radius;

  // find the bigger inCircle on the line between
  // the old incircle's center and the intersection
  let n = 10;
  let maxIncircleDef = incircleDef;
  for (let i = 0; i < n; i++) {
    let vector = _vector(angle, maxDelta / n * (i + 1));
    let nextCenter = incircleDef.center.add(vector);
    let nextIncircleDef = _getTangentCircleDef(path, nextCenter);
    if (nextIncircleDef.radius > maxIncircleDef.radius) {
      maxIncircleDef = nextIncircleDef;
    }
  }

  return maxIncircleDef;
}

function _getIntersectionDistance(path, point, angle) {
  // trace a line in angle opposite direction
  let lineLenght = path.bounds.height + path.bounds.width;// 
  let lineEnd = point.add(_vector(angle, lineLenght));
  let line = new paper.Path.Line(point, lineEnd);
  let intersections = line.getIntersections(path);
  if (intersections.length == 0) {
    console.log("# IntersectionLine : No intersection! Point:" + point + " angle:" + angle);
    return 0;
  }
  return intersections[0].point.getDistance(point);
}

function _getTangentCircleDef(path, point) {
  let nearest = path.getNearestPoint(point);
  let distance = nearest.getDistance(point);
  return {
    center: point,
    radius: distance,
    nearest: nearest
  }
}

function _vector(angle, length) {
  let unitVector = new paper.Point(Math.cos(angle), Math.sin(angle));
  return unitVector.multiply(length);
}

function _analyseAngles(angles) {
  // If only one angle
  if (angles.length == 1) {
    return {
      median: angles[0],
      delta: 0
    };
  }

  // If 2 or mores angles, compute a 'delta' between the two first angle,
  // then add each other angles and increase the delta if necessary
  let angle0 = angles[0];
  let angle1 = angles[1];

  let delta = _positiveDirectedAngleDelta(angle0, angle1);
  let min, max = null;
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
    let angle = angles[i];
    let minToAngle = _positiveDirectedAngleDelta(min, angle);
    let minToMax = delta;
    if (minToAngle > minToMax) {
      let maxToAngle = minToAngle - minToMax;
      let angleToMin = 2 * Math.PI - minToAngle;
      if (maxToAngle < angleToMin) {
        max = angle;
      } else {
        min = angle;
      }
    }
    delta = _positiveDirectedAngleDelta(min, max);
  }

  // compute result
  let median = ((min + delta / 2) % (2 * Math.PI));

  return {
    median: median,
    delta: delta
  };
}

// return in interval [0, 2*PI]
function _positiveDirectedAngleDelta(a, b) {
  let delta = (b - a) % (2 * Math.PI);
  if (delta < 0) { delta += (2 * Math.PI) };
  return delta;
}