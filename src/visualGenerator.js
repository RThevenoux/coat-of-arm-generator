export default function generateVisual(description, configuration) {
  let borderSize = 3;

  let form = configuration.form;

  let viewBoxSize = {
    x: -borderSize,
    y: -borderSize,
    width: parseInt(form.width) + borderSize * 2,
    height: parseInt(form.height) + borderSize * 2,
  }

  let defs = buildDefs(form);

  let color = configuration.colors[description.color].rgb;
  let background = "<use xlink:href=\"#shape\" style=\"fill:#" + color + "\"/>";
  let border = "<use xlink:href=\"#shape\" style=\"fill:none;stroke:#000;stroke-width:3\"/>";
  let reflect = "<use xlink:href=\"#shape\" fill=\"url(#gradient-reflect)\"/>";

  let svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + form.width + "\" height=\"" + form.height + "\""
    + "viewBox=\"" + viewBoxSize.x + " " + viewBoxSize.y + " " + viewBoxSize.width + " " + viewBoxSize.height + "\""
    + ">"
    + defs
    + background
    + border + reflect
    + "</svg>";

  return svg;
}

function buildDefs(form) {
  let cx = form.width / 3;
  let cy = form.height / 3;
  let radius = form.width * 2 / 3;

  let gradient = "<radialGradient id=\"gradient-reflect\" gradientUnits=\"userSpaceOnUse\" cx=\"" + cx + "\" cy=\"" + cy + "\" r=\"" + radius + "\">" +
    "<stop style=\"stop-color:#fff;stop-opacity:0.31\" offset=\"0\"/>" +
    "<stop style=\"stop-color:#fff;stop-opacity:0.25\" offset=\"0.19\"/>" +
    "<stop style=\"stop-color:#6b6b6b;stop-opacity:0.125\" offset=\"0.6\"/>" +
    "<stop style=\"stop-color:#000;stop-opacity:0.125\" offset=\"1\"/>" +
    "</radialGradient>";
  let clipPath = "<clipPath id=\"shape_cut\">" +
    "<path id=\"shape\" d=\"" + form.shape + "\"/>" +
    "</clipPath>";

  return "<defs>" + gradient + clipPath + "</defs>";
}