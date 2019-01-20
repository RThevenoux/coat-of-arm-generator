import SvgBuilder from './svg-builder';
import partitionShape from './partitionner';
import getFiller from './filler-builder';
import addStrip from './strip-drawer';
import paper from 'paper-jsdom';

let escutcheons = require("./data/escutcheons.json");
let palettes = require("./data/palettes.json");

export default function generateVisual(model, configuration) {

  // ?? Improve paper.Project management ??
  new paper.Project();
  // --

  let escutcheon = escutcheons[configuration.escutcheon];
  let palette = palettes[configuration.palette];
  let borderSize = configuration.borderSize;
  let defaultStrokeSize = configuration.defaultStrokeSize;

  let viewBoxSize = {
    x: -borderSize,
    y: -borderSize,
    width: parseInt(escutcheon.width) + borderSize * 2,
    height: parseInt(escutcheon.height) + borderSize * 2,
  };

  let builder = new SvgBuilder(viewBoxSize, palette, defaultStrokeSize);

  // Draw 
  let subShapes = partitionShape(escutcheon, model.type);
  if (subShapes.length == 0) {
    //Error case
    _addField(builder, "none", escutcheon);
  } else {
    for (let i = 0; i < subShapes.length; i++) {
      let partitionModel = model.partitions[i].model;
      let subShape = subShapes[i];
      _addPartition(builder, partitionModel, subShape);
    }
  }

  // Visual effet
  let mainShapeId = _definePath(builder, escutcheon.path);
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

function _addPartition(builder, model, shape) {
  _addField(builder, model.filler, shape);
  if (model.charges) {
    model.charges.forEach(item => {
      _addCharge(builder, item.model, shape);
    });
  }
}

function _addCharge(builder, charge, shape) {
  if (charge.type == 'stripe') {
    addStrip(builder, charge, shape);
  } else {
    console.log("-- unsupported charge-type: " + JSON.stringify(charge));
  }
}

function _definePath(builder, path) {
  let id = "main-shape";
  builder.defs
    .ele("path")
    .att("id", id)
    .att("d", path);
  return id;
}

function _addField(builder, filler, shape) {
  let fillerId = getFiller(builder, filler, shape);
  builder.container
    .ele("path")
    .att("d", shape.path)
    .att("fill", "url(#" + fillerId + ")");
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