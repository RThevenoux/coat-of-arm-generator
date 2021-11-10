import * as paper from "paper";
import { getPartitionVisual } from "../../service/PartitionService";

export default function partitionShape(
  containerPath: paper.Path,
  partitionningType: string
): paper.Path[] {
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

  const result: paper.Path[] = [];
  for (const pathData of partitionDef.paths) {
    const path = new paper.Path(pathData);
    path.scale(scaleX, scaleY, partitionOrigin);
    path.translate(containerOrigin);

    // Compute intersection.
    const intersection = containerPath.intersect(path);
    if (intersection instanceof paper.Path) {
      result.push(intersection);
    } else {
      return [];
    }
  }

  return result;
}
