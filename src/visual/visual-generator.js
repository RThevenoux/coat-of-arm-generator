import SvgBuilder from './svg-builder';

let patterns = require("./patterns.json");

export default function generateVisual(description, configuration) {

  let shape = configuration.shape;
  let borderSize = configuration.borderSize;
  let palette = configuration.palette;

  let viewBoxSize = {
    x: -borderSize,
    y: -borderSize,
    width: parseInt(shape.width) + borderSize * 2,
    height: parseInt(shape.height) + borderSize * 2,
  };

  let shapeBox = {
    width: shape.width,
    height: shape.height
  }

  let builder = new SvgBuilder(viewBoxSize, palette);

  let mainShapeId = definePath(builder, shape.path);

  addField(builder, description, mainShapeId, shapeBox);
  addBorder(builder, borderSize, mainShapeId);

  if (configuration.reflect) {
    addReflect(builder, shapeBox, mainShapeId);
  }

  // Static size of 300x300 for the image
  // Should be more dynamic
  return builder.container
    .att("width", 300)
    .att("height", 300)
    .end();
}

function definePath(builder, path) {
  let id = "main-shape";
  builder.defs
    .ele("path")
    .att("id", id)
    .att("d", path);
  return id;
}

function addField(builder, description, mainShapeId, shapeBox) {

  let fillerId = getFiller(builder, description, shapeBox);

  if (fillerId) {
    builder.container.ele("use")
      .att("xlink:href", "#" + mainShapeId)
      .att("fill", "url(#" + fillerId + ")");
  }
}

function getFiller(builder, description, shapeBox) {
  switch (description.type) {
    case "plein": {
      return builder.getSolidFiller(description.color);
    };
    case "pattern": {
      let pattern = patterns[description.patternName];
      let parameters = getPatternParameters(description, shapeBox);
      return builder.addPattern(pattern, parameters);
    };
    default: {
      console.log("unsupported-type:" + description.type);
      return builder.getDefaultFiller();
    }
  }
}

function getPatternParameters(description, shapeBox) {
  let param = {
    backgroundColor: description.color1,
    patternColor: description.color2,
    shapeWidth: shapeBox.width
  }

  if (description.angle) {
    switch (description.angle) {
      case "bande": param.rotation = -45; break;
      case "barre": param.rotation = 45; break;
      case "defaut": break;
      default: console.log("Invalid angle" + description.angle);
    }
  }

  return param;
}

function addBorder(builder, borderSize, mainShapeId) {
  builder.container.ele("use")
    .att("xlink:href", "#" + mainShapeId)
    .att("style", "fill:none;stroke:#000;stroke-width:" + borderSize);
}

function addReflect(builder, shapeBox, mainShapeId) {
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