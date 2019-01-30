import partitionShape from './partitionner';
import drawCharge from './charge-drawer';

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
  builder.fill(model.filler, containerPath);
  if (model.charges) {
    model.charges.forEach(charge => drawCharge(builder, charge, containerPath));
  }
}