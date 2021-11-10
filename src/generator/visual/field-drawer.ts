import * as paper from "paper";
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

export default async function drawField(
  builder: SvgBuilder,
  model: FieldModel,
  containerPath: paper.Path
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

function drawError(
  builder: SvgBuilder,
  containerPath: paper.Path
): Promise<void> {
  return builder.fill("none", containerPath);
}

async function drawPartitionField(
  builder: SvgBuilder,
  model: MultiFieldModel,
  containerPath: paper.Path
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

async function drawPlainField(
  builder: SvgBuilder,
  model: PlainFieldModel,
  containerPath: paper.Path
): Promise<void> {
  if (model.border) {
    const inner = await drawBorder(builder, model.border, containerPath);
    return drawFieldWithoutBorder(builder, model, inner);
  } else {
    return drawFieldWithoutBorder(builder, model, containerPath);
  }
}

async function drawBorder(
  builder: SvgBuilder,
  model: BorderModel,
  containerPath: paper.Path
): Promise<paper.Path> {
  const borderSize =
    Math.min(containerPath.bounds.height, containerPath.bounds.width) / 6;

  try {
    const border = createBorder(containerPath, borderSize);

    await builder.fill(model.filler, border);

    const inner = containerPath.subtract(border);
    if (inner instanceof paper.Path) {
      return inner;
    } else {
      throw new Error("Border interrior is not a simple Path");
    }
  } catch (err) {
    console.error(err);
    return containerPath;
  }
}

async function drawFieldWithoutBorder(
  builder: SvgBuilder,
  model: PlainFieldModel,
  containerPath: paper.Path
) {
  await builder.fill(model.filler, containerPath);
  if (model.charges) {
    for (const charge of model.charges) {
      await drawCharge(builder, charge, containerPath);
    }
  }
}
