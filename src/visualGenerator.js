import builder from 'xmlbuilder';

export default function generateVisual(description, configuration) {
  let borderSize = 3;

  let form = configuration.form;

  let viewBoxSize = {
    x: -borderSize,
    y: -borderSize,
    width: parseInt(form.width) + borderSize * 2,
    height: parseInt(form.height) + borderSize * 2,
  };

  let svg = builder.create('svg', { headless: true })
    .att("xmlns", "http://www.w3.org/2000/svg")
    .att("width", form.width)
    .att("height", form.height)
    .att("viewBox", viewBoxSize.x + " " + viewBoxSize.y + " " + viewBoxSize.width + " " + viewBoxSize.height);

  buildDefs(form, svg);

  let color = configuration.colors[description.color].rgb;
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

function buildDefs(form, svg) {
  let defs = svg.ele("defs");

  let cx = form.width / 3;
  let cy = form.height / 3;
  let radius = form.width * 2 / 3;

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
    .att("d", form.shape);
}