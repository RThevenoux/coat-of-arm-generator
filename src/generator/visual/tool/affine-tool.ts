import * as paper from "paper";

export default getLineIntersection;

function getLineIntersection(
  point1: paper.Point,
  vector1: paper.Point,
  point2: paper.Point,
  vector2: paper.Point
): paper.Point | null {
  const coef1 = affineCoefficient(point1, vector1);
  const coef2 = affineCoefficient(point2, vector2);

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

  const x = (coef2.b - coef1.b) / (coef1.a - coef2.a);
  const y = coef1.apply(x);
  return new paper.Point(x, y);
}

function verticalIntersection(
  verticalCoef: VerticialCoefficient,
  otherCoef: Coefficient
): paper.Point | null {
  if (otherCoef.vertical) {
    // Collinear
    return null;
  }
  const x = verticalCoef.x;
  const y = otherCoef.apply(x);
  return new paper.Point(x, y);
}

type Coefficient = VerticialCoefficient | NonVerticialCoefficient;
type VerticialCoefficient = { vertical: true; x: number };
type NonVerticialCoefficient = {
  vertical: false;
  a: number;
  b: number;
  apply: (x: number) => number;
};

function affineCoefficient(
  point: paper.Point,
  vector: paper.Point
): Coefficient {
  // Trick here
  // 'x' will be use in division. If it's close to 0, consider is 0
  // to avoid aberration due to number approximation
  if (Math.round(vector.x * 1000) == 0) {
    return {
      vertical: true,
      x: point.x,
    };
  }

  const a = vector.y / vector.x;
  const b = point.y - a * point.x;

  return {
    vertical: false,
    a: a,
    b: b,
    apply: (x: number) => a * x + b,
  };
}
