import partitionShape from "./partitionner";
import drawCharge from "./charge-drawer";
import createBorder from "./factory/BorderFactory";
import SvgBuilder from "./SvgBuilder";
import {
  BorderModel,
  FieldModel,
  MultiFieldModel,
  PlainFieldModel,
} from "../model.type";
import { FieldShape, MyShape } from "./type";

export default async function drawField(
  builder: SvgBuilder,
  model: FieldModel,
  containerPath: FieldShape
): Promise<void> {
  switch (model.type) {
    case "plain":
      return drawPlainField(builder, model, containerPath);
    case "partition":
      return drawPartitionField(builder, model, containerPath);
    default:
      return drawError(builder, containerPath);
  }
}

function drawError(builder: SvgBuilder, containerPath: MyShape): Promise<void> {
  return builder.fill("none", containerPath);
}

async function drawPartitionField(
  builder: SvgBuilder,
  model: MultiFieldModel,
  container: FieldShape
): Promise<void> {
  const subFieldPaths = partitionShape(container, model.partitionType);
  if (subFieldPaths.length == 0) {
    return drawError(builder, container);
  }

  for (let i = 0; i < subFieldPaths.length; i++) {
    const subFieldModel = model.fields[i];
    const subFieldPath = subFieldPaths[i];
    await drawField(builder, subFieldModel, subFieldPath);
  }
}

async function drawPlainField(
  builder: SvgBuilder,
  model: PlainFieldModel,
  container: FieldShape
): Promise<void> {
  if (model.border) {
    const inner = await drawBorder(builder, model.border, container);
    return drawFieldWithoutBorder(builder, model, inner);
  } else {
    return drawFieldWithoutBorder(builder, model, container);
  }
}

async function drawBorder(
  builder: SvgBuilder,
  model: BorderModel,
  container: FieldShape
): Promise<FieldShape> {
  const bounds = container.path.bounds;
  const borderSize = Math.min(bounds.height, bounds.width) / 6;

  try {
    const border = createBorder(container.path, borderSize);

    await builder.fill(model.filler, border);
    return border.inner;
  } catch (err) {
    console.error(err);
    return container;
  }
}

async function drawFieldWithoutBorder(
  builder: SvgBuilder,
  model: PlainFieldModel,
  container: FieldShape
) {
  await builder.fill(model.filler, container);
  if (model.charges) {
    for (const charge of model.charges) {
      await drawCharge(builder, charge, container);
    }
  }
}
