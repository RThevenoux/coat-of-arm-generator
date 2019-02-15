import partitionShape from './partitionner';
import drawCharge from './charge-drawer';
import createBorder from './border-creator';

export default function drawField(builder, model, containerPath) {
  if (!model || !model.type) {
    drawError(builder, containerPath);
    return;
  }
  switch (model.type) {
    case "simple": drawSimpleField(builder, model, containerPath); break;
    case "partition": drawPartitionField(builder, model, containerPath); break;
    default: drawError(builder, containerPath); break;
  }
}

function drawError(builder, containerPath) {
  builder.fill("none", containerPath);
}

function drawPartitionField(builder, model, containerPath) {
  let subFieldPaths = partitionShape(containerPath, model.partitionType);
  if (subFieldPaths.length == 0) {
    drawError(builder, containerPath);
    return;
  }

  for (let i = 0; i < subFieldPaths.length; i++) {
    let subFieldModel = model.fields[i];
    let subFieldPath = subFieldPaths[i];
    drawField(builder, subFieldModel, subFieldPath);
  }
}

function drawSimpleField(builder, model, containerPath) {
  if (model.border) {
    let borderSize = Math.min(containerPath.bounds.height, containerPath.bounds.width) / 6;
    let border = createBorder(containerPath, borderSize);

    builder.fill(model.border.filler, border);

    let inner = containerPath.subtract(border);
    builder.fill(model.filler, inner);
    if (model.charges) {
      model.charges.forEach(charge => drawCharge(builder, charge, inner));
    }
  } else {
    builder.fill(model.filler, containerPath);
    if (model.charges) {
      model.charges.forEach(charge => drawCharge(builder, charge, containerPath));
    }
  }
}