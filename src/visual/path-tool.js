import paper from 'paper-jsdom';

export { getIncircle }

function getIncircle(path) {
  let incirleDef = _getInitalIncircle(path);

  for (let i = 0; i < 10; i++) {
    let center = incirleDef.center;
    // Multiply radius by 1.05 to be sure the circle intersect the path
    let incircle = new paper.Path.Circle(center, incirleDef.radius * 1.05);
    let intersections = incircle.getIntersections(path);
    if (intersections.length == 0) {
      console.log("  Error > no intersection");
      break;
    }
    // -- Here, angle are in degree
    let angles = intersections.map(intersection => _getAngleInDegree(center, intersection.point));
    let analysis = _analyseAngles(angles);
    if (analysis.delta >= 180) {
      break;
    }
    // -- angle are in radian after
    let radianAngle = analysis.median / 180 * Math.PI;
    incirleDef = _nextIncircle(path, incirleDef, radianAngle);
  }

  return incirleDef;
}

function _getInitalIncircle(path) {
  let center = path.interiorPoint;

  let incirleDef = _getIncircleDef(path, center);
  if (incirleDef.radius != 0) {
    return incirleDef;
  }

  // If initialCenter is on a border, check other point.
  // Loop until found a correct point
  let i = 1;
  while (true) {
    let delta = path.bounds.width / (Math.pow(2, i));

    let north = center.add([0, -delta]);
    if (path.contains(north)) {
      incirleDef = _getIncircleDef(path, north);
      if (incirleDef.radius != 0) {
        return incirleDef;
      }
    }

    let south = center.add([0, delta]);
    if (path.contains(south)) {
      incirleDef = _getIncircleDef(path, south);
      if (incirleDef.radius != 0) {
        return incirleDef;
      }
    }

    let east = center.add([delta, 0]);
    if (path.contains(east)) {
      incirleDef = _getIncircleDef(path, east);
      if (incirleDef.radius != 0) {
        return incirleDef;
      }
    }

    let west = center.add([-delta, 0]);
    if (path.contains(west)) {
      incirleDef = _getIncircleDef(path, west);
      if (incirleDef.radius != 0) {
        return incirleDef;
      }
    }

    i++;
  }
}

function _nextIncircle(path, incircleDef, angle) {
  // trace a line in angle opposite direction
  let lineLenght = path.bounds.height + path.bounds.width;
  let lineEnd = _translate(incircleDef.center, angle, lineLenght);
  let line = new paper.Path.Line(incircleDef.center, lineEnd);
  // get the opposite intersection
  let opposite = line.getIntersections(path)[0].point;
  let oppositeDistance = opposite.getDistance(incircleDef.center);
  let delta = (oppositeDistance - incircleDef.radius) / 2;

  // find the bigger inCircle on the line between
  // the old incircle's center and the intersection
  let n = 10;
  let maxIncircleDef = incircleDef;
  for (let i = 0; i < n; i++) {
    let nextCenter = _translate(incircleDef.center, angle, delta / n * (i + 1));
    let nextIncircleDef = _getIncircleDef(path, nextCenter);
    if (nextIncircleDef.radius > maxIncircleDef.radius) {
      maxIncircleDef = nextIncircleDef;
    }
  }

  return maxIncircleDef;
}

function _getIncircleDef(path, point) {
  let nearest = path.getNearestPoint(point);
  let distance = nearest.getDistance(point);
  return {
    center: point,
    radius: distance,
    nearest: nearest
  }
}

/** angle is opposite, in radian */
function _translate(source, angle, length) {
  let unitVector = new paper.Point(- Math.cos(angle), + Math.sin(angle));
  let vector = unitVector.multiply(length);
  return source.add(vector);
}

/**
 * 
 * @param {number} angles in degree 
 */
function _analyseAngles(angles) {
  if (angles.length == 1) {
    return {
      median: angles[0],
      delta: 0
    };
  }

  let angle0 = angles[0];
  let angle1 = angles[1];

  let delta = angleDelta(angle0, angle1);

  let min, max = null;
  if (delta < 180) {
    min = angle0;
    max = angle1;
  } else {
    min = angle1;
    max = angle0;
    delta = 360 - delta;
  }

  for (let i = 2; i < angles.length; i++) {
    let angle = angles[i];
    let minToAngle = angleDelta(min, angle);
    let minToMax = delta;
    if (minToAngle > minToMax) {
      let maxToAngle = minToAngle - minToMax;
      let angleToMin = 360 - minToAngle;
      if (maxToAngle < angleToMin) {
        max = angle;
      } else {
        min = angle;
      }
    }
    delta = angleDelta(min, max);
  }

  let median = ((min + delta / 2) % 360);

  return {
    median: median,
    delta: delta
  };
}

/**
 * 
 * @param {*} a in degree
 * @param {*} b in degree
 */
function angleDelta(a, b) {
  let delta = (b - a) % 360;
  if (delta < 0) { delta += 360 };
  return delta;
}

function _getAngleInDegree(start, end) {
  let dx = end.x - start.x;
  let dy = end.y - start.y;
  let atan = Math.atan(-dy / dx) * 180 / Math.PI;

  if (dx > 0) {
    return atan;
  } else {
    if (atan < 0) {
      return atan + 180;
    } else {
      return atan - 180;
    }
  }
}