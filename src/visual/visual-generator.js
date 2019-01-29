import SvgBuilder from './svg-builder';
import drawField from './field-drawer';
import paper from 'paper-jsdom';
import getEscutcheonPath from './escutcheon-manager';
import getPalette from './palette-manager';

export default function generateVisual(model, configuration) {

  // ?? TODO Improve paper.Project management ??
  new paper.Project();
  // --
  console.log("generateVisual. configuration= "+JSON.stringify(configuration));
  let escutcheonPath = getEscutcheonPath(configuration.escutcheon);
  let palette = getPalette(configuration.palette);
  let borderSize = configuration.borderSize;
  let defaultStrokeSize = configuration.defaultStrokeSize;
  let outputSize = { width: 300, height: 300 };

  // Create the border to compute viewBox
  let clone = escutcheonPath.clone();
  clone.strokeWidth = borderSize;
  clone.strokeColor = "black";

  let builder = new SvgBuilder(clone.strokeBounds, palette, defaultStrokeSize);

  // Draw
  drawField(builder, model, escutcheonPath);

  // Visual effet
  let mainShapeId = _definePath(builder, escutcheonPath);
  _addBorder(builder, borderSize, mainShapeId);
  if (configuration.reflect) {
    _addReflect(builder, clone.strokeBounds, mainShapeId);
  }

  return builder.container
    .att("width", outputSize.width)
    .att("height", outputSize.height)
    .end();
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

function _addReflect(builder, bounds, mainShapeId) {
  let gradienId = "gradient-reflect";

  let cx = bounds.width / 3;
  let cy = bounds.height / 3;
  let radius = bounds.width * 2 / 3;

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