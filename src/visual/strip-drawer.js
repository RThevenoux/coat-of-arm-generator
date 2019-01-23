import paper from 'paper-jsdom';

export {
  getStrip,
  getStrips,
  getPal,
  getPals,
  getFasce,
  getFasces,
  getDiagonal,
  getDiagonals
}

function getStrip(bounds, angle) {
  return getStrips(bounds, angle, 1)[0];
}
function getStrips(bounds, angle, count) {
  switch (angle) {
    case "0": return getFasces(bounds, count);
    case "90": return getPals(bounds, count);
    case "135": return getDiagonals(bounds, false, count);
    case "45": return getDiagonals(bounds, true, count);
    default:
      console.log("invalid angle " + angle);
      return [];
  }
}

function getPal(bounds) {
  return getPals(bounds, 1)[0];
}
function getPals(bounds, count) {
  let result = [];
  let hStrip = bounds.height / (2 * count + 1);
  for (let i = 0; i < count; i++) {
    result.push(new paper.Path.Rectangle({
      point: [bounds.x, bounds.y + (2 * i + 1) * hStrip],
      size: [bounds.width, hStrip]
    }));
  }
  return result;
}

function getFasce(bounds) {
  return getFasces(bounds, 1)[0];
}
function getFasces(bounds, count) {
  let result = [];
  let wStrip = bounds.width / (2 * count + 1);
  for (let i = 0; i < count; i++) {
    result.push(new paper.Path.Rectangle({
      point: [bounds.x + (2 * i + 1) * wStrip, bounds.y],
      size: [wStrip, bounds.height]
    }));
  }
  return result;
}

function getDiagonal(bounds, reverse) {
  return getDiagonals(bounds, reverse, 1)[0];
}
function getDiagonals(bounds, reverse, count) {

  let w = bounds.width;
  let h = bounds.height;
  let x = bounds.x;
  let y = bounds.y;

  let d = w / (2 * count + 1) / Math.sqrt(2);
  let x0 = x - d * (2 * count - 1);

  // create the '\' diagonal
  let pathData
    = "M " + (x0) + "," + y
    + " L " + (x0 + 2 * d) + "," + y
    + " " + (x0 + w + 2 * d) + "," + (y + h)
    + " " + (x0 + w) + "," + (y + h)
    + " z";
  let patternPath = new paper.Path(pathData);
  if (reverse) { // Mirror to obtain the '/' diagonal
    let center = [x + w / 2, y + h / 2];
    patternPath.scale(-1, 1, center);
  }

  let vector = (reverse ? [-4 * d, 0] : [4 * d, 0]);

  let result = [];
  for (let i = 0; i < count; i++) {
    let stripPath = patternPath.clone();
    result.push(stripPath);
    patternPath.translate(vector);
  }
  return result;
}