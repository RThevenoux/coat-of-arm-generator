import builder from 'xmlbuilder';

export default function generateVisual(description, configuration) {

  let shape = configuration.shape;

  let builder = create(shape, configuration);

  addField(builder, description);
  addBorder(builder, configuration.borderSize);
  if (configuration.reflect) {
    addReflect(builder, shape);
  }

  return builder.container.end();
}

function addField(builder, description) {
  builder.container.ele("use")
    .att("xlink:href", "#main-shape")
    .att("style", builder.fillColor(description.color));
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

function create(shape, configuration) {
  let borderSize = configuration.borderSize;
  let viewBoxSize = {
    x: -borderSize,
    y: -borderSize,
    width: parseInt(shape.width) + borderSize * 2,
    height: parseInt(shape.height) + borderSize * 2,
  };

  let svg = builder.create('svg', { headless: true })
    .att("xmlns", "http://www.w3.org/2000/svg")
    .att("width", shape.width)
    .att("height", shape.height)
    .att("viewBox", viewBoxSize.x + " " + viewBoxSize.y + " " + viewBoxSize.width + " " + viewBoxSize.height);

  // Create "defs" section with "main-shape"
  let defs = svg.ele("defs");

  defs
    .ele("path")
    .att("id", "main-shape")
    .att("d", shape.path);

  return {
    container: svg,
    defs: defs,
    fillColor: (key) => "fill:#" + configuration.palette[key]
  }
}