import paper from 'paper-jsdom';

export default function addStrip(builder, charge, shapePath) {
  let n = charge.count;
  let w = shapePath.bounds.width;
  let h = shapePath.bounds.height;
  let x = shapePath.bounds.x;
  let y = shapePath.bounds.y;

  switch (charge.angle) {
    case "0": {
      let hStrip = h / (2 * n + 1);
      let def = {
        point: [x, y + hStrip],
        size: [w, hStrip]
      }
      let stripPath = new paper.Path.Rectangle(def);
      let stripVector = [0, 2 * hStrip];
      _addMultiple(builder, shapePath, stripPath, stripVector, n, charge.filler);
    } break;
    case "45": {
      let d = (w) / (2 * n + 1) / Math.sqrt(2);
      let x0 = x + w + d * (2 * n - 1);

      let stripPathData
        = "M " + (x0) + "," + y
        + " L " + (x0 - 2 * d) + "," + y
        + " " + (x0 - w - 2 * d) + "," + (y + h)
        + " " + (x0 - w) + "," + (y + h)
        + " z";
      let stripPath = new paper.Path(stripPathData);
      let stripVector = [-4 * d, 0];

      _addMultiple(builder, shapePath, stripPath, stripVector, n, charge.filler);
      break;
    }
    case "90": {
      let wStrip = w / (2 * n + 1);
      let def = {
        point: [x + wStrip, y],
        size: [wStrip, h]
      }
      let stripPath = new paper.Path.Rectangle(def);
      let stripVector = [2 * wStrip, 0];
      _addMultiple(builder, shapePath, stripPath, stripVector, n, charge.filler);
    } break;
    case "135":
      let d = (w) / (2 * n + 1) / Math.sqrt(2);
      let x0 = x - d * (2 * n - 1);

      let stripPathData
        = "M " + (x0) + "," + y
        + " L " + (x0 + 2 * d) + "," + y
        + " " + (x0 + w + 2 * d) + "," + (y + h)
        + " " + (x0 + w) + "," + (y + h)
        + " z";
      let stripPath = new paper.Path(stripPathData);
      let stripVector = [4 * d, 0];

      _addMultiple(builder, shapePath, stripPath, stripVector, n, charge.filler);
      break;
    default:
      console.log("invalid angle " + charge.angle + " count=" + charge.count + " fillerId:" + fillerId);
      break;
  }
}

function _addMultiple(builder, containerPath, stripPath, stripVector, count, fillerModel) {
  for (let i = 0; i < count; i++) {
    let path = containerPath.intersect(stripPath);

    builder.fill(fillerModel,path);

    stripPath.translate(stripVector);
  }
}