import partitionShape from "./partitionner";
import drawCharge from "./charge-drawer";
import createBorder from "./factory/BorderFactory";
import SvgBuilder from "./SvgBuilder";
import { FieldModel, MultiFieldModel, SimpleFieldModel } from "../model.type";
import { MyPathItem } from "./type";

export default async function drawField(
  builder: SvgBuilder,
  model: FieldModel,
  containerPath: MyPathItem
): Promise<void> {
  if (!model || model == "empty-field") {
    return drawError(builder, containerPath);
  }
  switch (model.type) {
    case "simple":
      return drawSimpleField(builder, model, containerPath);
    case "partition":
      return drawPartitionField(builder, model, containerPath);
    default:
      return drawError(builder, containerPath);
  }
}

function drawError(
  builder: SvgBuilder,
  containerPath: MyPathItem
): Promise<void> {
  return builder.fill("none", containerPath);
}

async function drawPartitionField(
  builder: SvgBuilder,
  model: MultiFieldModel,
  containerPath: MyPathItem
): Promise<void> {
  const subFieldPaths = partitionShape(containerPath, model.partitionType);
  if (subFieldPaths.length == 0) {
    return drawError(builder, containerPath);
  }

  for (let i = 0; i < subFieldPaths.length; i++) {
    const subFieldModel = model.fields[i];
    const subFieldPath = subFieldPaths[i];
    await drawField(builder, subFieldModel, subFieldPath);
  }
}

async function drawSimpleField(
  builder: SvgBuilder,
  model: SimpleFieldModel,
  containerPath: MyPathItem
): Promise<void> {
  if (model.border) {
    const borderSize =
      Math.min(containerPath.bounds.height, containerPath.bounds.width) / 6;
    const border = createBorder(containerPath, borderSize);

    await builder.fill(model.border.filler, border);

    const inner = containerPath.subtract(border) as MyPathItem;
    await builder.fill(model.filler, inner);
    if (model.charges) {
      for (const charge of model.charges) {
        await drawCharge(builder, charge, inner);
      }
    }
  } else {
    await builder.fill(model.filler, containerPath);
    if (model.charges) {
      for (const charge of model.charges) {
        await drawCharge(builder, charge, containerPath);
      }
    }
  }
}
