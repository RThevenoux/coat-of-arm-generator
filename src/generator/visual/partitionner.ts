import * as paper from "paper";
import { getPartitionVisual } from "../../service/PartitionService";
import { FieldShape } from "./type";

export default function partitionShape(
  container: FieldShape,
  partitionningType: string
): FieldShape[] {
  if (partitionningType == "plain") {
    return [container];
  }

  const partitionDef = getPartitionVisual(partitionningType);
  if (!partitionDef) {
    return [];
  }

  const bounds = container.path.bounds;
  // Compute scale info
  const scaleX = bounds.width / partitionDef.width;
  const scaleY = bounds.height / partitionDef.height;
  const partitionOrigin = new paper.Point(0, 0);
  // Get translate info
  const containerOrigin = bounds.topLeft;

  const result: FieldShape[] = [];
  for (const pathData of partitionDef.paths) {
    const path = new paper.Path(pathData);
    path.scale(scaleX, scaleY, partitionOrigin);
    path.translate(containerOrigin);

    // Compute intersection.
    const intersection = container.path.intersect(path);
    if (intersection instanceof paper.Path) {
      result.push({
        type: "field",
        path: intersection,
        root: container.root
      });
    } else {
      return [];
    }
  }

  return result;
}
