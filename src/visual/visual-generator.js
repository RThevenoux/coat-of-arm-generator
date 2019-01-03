import builder from 'xmlbuilder';

export default function generateVisual(description, configuration) {
  let borderSize = 3;

  let shape = configuration.shape;

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

  buildDefs(shape, svg);

  let color = configuration.palette[description.color];
  svg.ele("use")
    .att("xlink:href", "#shape")
    .att("style", "fill:#" + color);
  svg.ele("use")
    .att("xlink:href", "#shape")
    .att("style", "fill:none;stroke:#000;stroke-width:3");
  svg.ele("use")
    .att("xlink:href", "#shape")
    .att("fill", "url(#gradient-reflect)");

  return svg.end();
}

function buildDefs(shape, svg) {
  let defs = svg.ele("defs");

  let cx = shape.width / 3;
  let cy = shape.height / 3;
  let radius = shape.width * 2 / 3;

  let gradient = defs.ele("radialGradient")
    .att("id", "gradient-reflect")
    .att("gradientUnits", "userSpaceOnUse")
    .att("cx", cx).att("cy", cy).att("r", radius);

  gradient.ele("stop").att("style", "stop-color:#fff;stop-opacity:0.31").att("offset", 0);
  gradient.ele("stop").att("style", "stop-color:#fff;stop-opacity:0.25").att("offset", 0.19);
  gradient.ele("stop").att("style", "stop-color:#6b6b6b;stop-opacity:0.125").att("offset", 0.6);
  gradient.ele("stop").att("style", "stop-color:#000;stop-opacity:0.125").att("offset", 1);

  defs.ele("clipPath").att("id", "shape_cut")
    .ele("path")
    .att("id", "shape")
    .att("d", shape.path);
}