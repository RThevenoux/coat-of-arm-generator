import partitionShape from './partitionner';
import addCharge from './charge-drawer';

export default function drawField(builder, model, containerPath) {
  switch (model.type) {
    case "partition": drawPartitionField(builder, model, containerPath); break;
    case "field": drawSimpleField(builder, model.field, containerPath); break;
    default: drawError(containerPath); break;
  }
}

function drawError(containerPath) {
  builder.fill("none", containerPath);
}

function drawPartitionField(builder, model, containerPath) {
  let subFieldPaths = partitionShape(containerPath, model.partitionType);
  if (subFieldPaths.length == 0) {
    drawError(containerPath);
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
    model.charges.forEach(item => {
      addCharge(builder, item.model, containerPath);
    });
  }
}