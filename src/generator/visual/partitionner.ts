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

  // Compute scale info
  const scaleX = containerPath.bounds.width / partitionDef.width;
  const scaleY = containerPath.bounds.height / partitionDef.height;
  const partitionOrigin = new paper.Point(0, 0);
  // Get translate info
  const containerOrigin = containerPath.bounds.topLeft;

  const result: MyPathItem[] = [];
  for (const pathData of partitionDef.paths) {
    const path = new paper.Path(pathData);
    path.scale(scaleX, scaleY, partitionOrigin);
    path.translate(containerOrigin);

    // Compute intersection.
    // Intersection should by Path or CompoundPath, so it should be safe to cast to MyPathItem
    const intersection = containerPath.intersect(path) as MyPathItem;
    result.push(intersection);
  }

  return result;
}
