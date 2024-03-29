import { partitionShape } from "./partitionner";
import { drawCharge } from "./charge/charge-drawer";
import { createBorder } from "./shape/border.factory";
import { SvgBuilder } from "./svg/SvgBuilder";
import { FieldShape, SimpleShape } from "./type";
import {
  BorderModel,
  FieldModel,
  MultiFieldModel,
  PlainFieldModel,
} from "@/model/field";

export async function drawField(
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

async function drawError(
  builder: SvgBuilder,
  containerPath: SimpleShape
): Promise<void> {
  await builder.fill("none", containerPath);
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
    const border = createBorder(container.path, borderSize, container.root);

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
