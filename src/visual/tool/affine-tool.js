import paper from 'paper';

export default getLineIntersection;

function getLineIntersection(point1, vector1, point2, vector2) {
  let coef1 = affineCoefficient(point1, vector1);
  let coef2 = affineCoefficient(point2, vector2);

  if (coef1.vertical) {
    return verticalIntersection(coef1, coef2);
  }

  if (coef2.vertical) {
    return verticalIntersection(coef2, coef1);
  }

  if (coef1.a == coef2.a) {
    // Collinear
    return null;
  }

  let x = (coef2.b - coef1.b) / (coef1.a - coef2.a);
  let y = coef1.apply(x);
  return new paper.Point(x, y);
}

function verticalIntersection(verticalCoef, otherCoef) {
  if (otherCoef.vertical) {
    // Collinear
    return null;
  }
  let x = verticalCoef.x;
  let y = otherCoef.apply(x);
  return new paper.Point(x, y);
}

function affineCoefficient(point, vector) {
  // Trick here
  // 'x' will be use in division. If it's close to 0, consider is 0
  // to avoid aberration due to number approximation
  if (Math.round(vector.x * 1000) == 0) {
    return {
      vertical: true,
      x: point.x
    }
  }

  let a = vector.y / vector.x;
  let b = point.y - a * point.x;

  return {
    vertical: false,
    a: a,
    b: b,
    apply: x => a * x + b
  }
}