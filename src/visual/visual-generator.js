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

  let builder = new SvgBuilder(shape, configuration);

  addField(builder, description, shape);
  addBorder(builder, configuration.borderSize);
  if (configuration.reflect) {
    addReflect(builder, shape);
  }

  return builder.container.end();
}

function addField(builder, description, shape) {
  switch (description.type) {
    case "plein": {
      builder.container.ele("use")
        .att("xlink:href", "#main-shape")
        .att("style", builder.fillColor(description.color));
    }; break;
    case "pattern": {
      let pattern = patterns[description.patternName];
      let parameters = getPatternParameters(description, shape);
      let patternId = builder.addPattern(pattern, parameters);

      builder.container.ele("use")
        .att("xlink:href", "#main-shape")
        .att("fill", "url(#" + patternId + ")");
    };
    default: {
      console.log("unsupported-type:" + description.type);
    }
  }
}

function getPatternParameters(description, shape) {
  let param = {
    backgroundColor: description.color1,
    patternColor: description.color2,
    shapeWidth: shape.width
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

function addBorder(builder, borderSize) {
  builder.container.ele("use")
    .att("xlink:href", "#main-shape")
    .att("style", "fill:none;stroke:#000;stroke-width:" + borderSize);
}

function addReflect(builder, shape) {
  let cx = shape.width / 3;
  let cy = shape.height / 3;
  let radius = shape.width * 2 / 3;

  let gradient = builder.defs.ele("radialGradient")
    .att("id", "gradient-reflect")
    .att("gradientUnits", "userSpaceOnUse")
    .att("cx", cx).att("cy", cy).att("r", radius);

  gradient.ele("stop").att("style", "stop-color:#fff;stop-opacity:0.31").att("offset", 0);
  gradient.ele("stop").att("style", "stop-color:#fff;stop-opacity:0.25").att("offset", 0.19);
  gradient.ele("stop").att("style", "stop-color:#6b6b6b;stop-opacity:0.125").att("offset", 0.6);
  gradient.ele("stop").att("style", "stop-color:#000;stop-opacity:0.125").att("offset", 1);

  builder.container.ele("use")
    .att("xlink:href", "#main-shape")
    .att("fill", "url(#gradient-reflect)");
}