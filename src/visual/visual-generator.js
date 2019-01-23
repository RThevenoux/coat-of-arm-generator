import SvgBuilder from './svg-builder';
import partitionShape from './partitionner';
import addCharge from './charge-drawer';
import paper from 'paper-jsdom';

let escutcheons = require("./data/escutcheons.json");
let palettes = require("./data/palettes.json");

export default function generateVisual(model, configuration) {

  // ?? TODO Improve paper.Project management ??
  new paper.Project();
  // --

  let escutcheon = escutcheons[configuration.escutcheon];
  let escutcheonPath = new paper.Path(escutcheon.path);

  let palette = palettes[configuration.palette];
  let borderSize = configuration.borderSize;
  let defaultStrokeSize = configuration.defaultStrokeSize;

  // Create the border to compute viewBox
  let clone = escutcheonPath.clone();
  clone.strokeWidth = borderSize;
  clone.strokeColor = "black";

  let builder = new SvgBuilder(clone.strokeBounds, palette, defaultStrokeSize);

  // Draw
  let partitionPaths = partitionShape(escutcheonPath, model.type);
  if (partitionPaths.length == 0) {
    //Error case
    builder.fill("none", escutcheonPath);
  } else {
    for (let i = 0; i < partitionPaths.length; i++) {
      let partitionModel = model.partitions[i].model;
      let partitionPath = partitionPaths[i];
      _addPartition(builder, partitionModel, partitionPath);
    }
  }

  // Visual effet
  let mainShapeId = _definePath(builder, escutcheonPath);
  _addBorder(builder, borderSize, mainShapeId);
  if (configuration.reflect) {
    _addReflect(builder, escutcheon, mainShapeId);
  }

  // Static size of 300x300 for the image
  // Should be more dynamic
  return builder.container
    .att("width", 300)
    .att("height", 300)
    .end();
}

function _addPartition(builder, model, partitionPath) {
  builder.fill(model.filler, partitionPath);

  if (model.charges) {
    model.charges.forEach(item => {
      addCharge(builder, item.model, partitionPath);
    });
  }
}

function _definePath(builder, path) {
  let id = "main-shape";
  builder.defs
    .ele("path")
    .att("id", id)
    .att("d", path.pathData);
  return id;
}

function _addBorder(builder, borderSize, mainShapeId) {
  builder.container
    .ele("use")
    .att("xlink:href", "#" + mainShapeId)
    .att("style", "fill:none;stroke:#000;stroke-width:" + borderSize);
}

function _addReflect(builder, shapeBox, mainShapeId) {
  let gradienId = "gradient-reflect";

  let cx = shapeBox.width / 3;
  let cy = shapeBox.height / 3;
  let radius = shapeBox.width * 2 / 3;

  let gradient = builder.defs.ele("radialGradient")
    .att("id", gradienId)
    .att("gradientUnits", "userSpaceOnUse")
    .att("cx", cx).att("cy", cy).att("r", radius);

  gradient.ele("stop").att("style", "stop-color:#fff;stop-opacity:0.31").att("offset", 0);
  gradient.ele("stop").att("style", "stop-color:#fff;stop-opacity:0.25").att("offset", 0.19);
  gradient.ele("stop").att("style", "stop-color:#6b6b6b;stop-opacity:0.125").att("offset", 0.6);
  gradient.ele("stop").att("style", "stop-color:#000;stop-opacity:0.125").att("offset", 1);

  builder.container.ele("use")
    .att("xlink:href", "#" + mainShapeId)
    .att("fill", "url(#" + gradienId + ")");
}