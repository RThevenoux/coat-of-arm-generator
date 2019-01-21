import getFiller from './filler-builder';
import paper from 'paper-jsdom';

export default function addStripe(builder, charge, shape) {
  let fillerId = getFiller(builder, charge.filler, shape);

  let shapePath = new paper.Path(shape.path);
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
      let itemPath = new paper.Path.Rectangle(def);
      let translateVector = [0, 2 * hStrip];
      _addMultiple(builder, shapePath, itemPath, translateVector, n, fillerId);
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
      let translateVector = [-4 * d, 0];

      _addMultiple(builder, shapePath, stripPath, translateVector, n, fillerId);
      break;
    }
    case "90": {
      let wStrip = w / (2 * n + 1);
      let def = {
        point: [x + wStrip, y],
        size: [wStrip, h]
      }
      let itemPath = new paper.Path.Rectangle(def);
      let translateVector = [2 * wStrip, 0];
      _addMultiple(builder, shapePath, itemPath, translateVector, n, fillerId);
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
      let translateVector = [4 * d, 0];

      _addMultiple(builder, shapePath, stripPath, translateVector, n, fillerId);
      break;
    default:
      console.log("invalid angle " + charge.angle + " count=" + charge.count + " fillerId:" + fillerId);
      break;
  }
}

function _addMultiple(builder, containerShape, itemShape, vector, count, fillerId) {
  for (let i = 0; i < count; i++) {
    let pathData = containerShape.intersect(itemShape).pathData;
    builder.container
      .ele("path")
      .att("d", pathData)
      .att("fill", "url(#" + fillerId + ")");
    itemShape.translate(vector);
  }
}