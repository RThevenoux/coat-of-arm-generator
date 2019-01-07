import SvgBuilder from './svg-builder';

var patterns = {
  echiquete: {
    patternWidth: 10,
    patternHeight: 10,
    patternRepetition: 3,
    path: "M 5,0 L 10,0 10,5 0,5 0,10 5,10 z"
  },
  losange: {
    patternWidth: 10,
    patternHeight: 10,
    patternRepetition: 4,
    path: "M 0,0 L 10,10 L 10,0 L 0,10 z"
  },
  fusele: {
    patternWidth: 20,
    patternHeight: 50,
    patternRepetition: 5,
    path: "M 10,0 L 0,25 L 10,50 L 20,25 z"
  }
}

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
      //TODO should use Promise ?
      console.log("unsupported-type:" + description.type);
      return null;
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