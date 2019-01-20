import paper from 'paper-jsdom';

let partitionDefs = require('./data/partitions.json');

export default function partitionShape(shape, partitionningType) {
  if (partitionningType == "plain") {
    return [shape];
  }

  let partitionDef = partitionDefs[partitionningType];
  if (!partitionDef) {
    return [];
  }

  let scaleX = shape.width / partitionDef.width;
  let scaleY = shape.height / partitionDef.height;

  let mainPath = new paper.Path(shape.path);

  let paths = partitionDef.paths.map(pathData => new paper.Path(pathData).scale(scaleX, scaleY, [0, 0]));

  return _intersectPath(mainPath, paths);
}

function _intersectPath(mainPath, partitionPaths) {
  return partitionPaths
    .map(path => mainPath.intersect(path))
    .map(result => {
      return {
        path: result.pathData,
        width: result.strokeBounds.width,
        height: result.strokeBounds.height
      }
    });
}