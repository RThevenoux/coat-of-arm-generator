import * as paper from "paper";
import { getPartitionVisual } from "../../service/PartitionService";
import { MyPathItem } from "./type";

export default function partitionShape(
  containerPath: MyPathItem,
  partitionningType: string
): MyPathItem[] {
  if (partitionningType == "plain") {
    return [containerPath];
  }

  const partitionDef = getPartitionVisual(partitionningType);
  if (!partitionDef) {
    return [];
  }
  const paths = partitionDef.paths.map((pathData) => new paper.Path(pathData));

  // Scale every path
  const scaleX = containerPath.bounds.width / partitionDef.width;
  const scaleY = containerPath.bounds.height / partitionDef.height;
  const origin = new paper.Point(0, 0);
  paths.forEach((path) => path.scale(scaleX, scaleY, origin));

  return _intersectPath(containerPath, paths);
}

function _intersectPath(
  containerPath: MyPathItem,
  partitionPaths: MyPathItem[]
): MyPathItem[] {
  return partitionPaths.map(
    (path) => containerPath.intersect(path) as MyPathItem
  );
}
