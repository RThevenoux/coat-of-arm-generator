import paper from 'paper-jsdom';

let partitionDefs = require('./data/partitions.json');

export default function partitionShape(containerPath, partitionningType) {
  if (partitionningType == "plain") {
    return [containerPath];
  }

  let partitionDef = partitionDefs[partitionningType];
  if (!partitionDef) {
    return [];
  }

  let scaleX = containerPath.bounds.width / partitionDef.width;
  let scaleY = containerPath.bounds.height / partitionDef.height;

  let paths = partitionDef.paths.map(pathData => new paper.Path(pathData).scale(scaleX, scaleY, [0, 0]));

  return _intersectPath(containerPath, paths);
}

function _intersectPath(containerPath, partitionPaths) {
  return partitionPaths
    .map(path => containerPath.intersect(path));
}