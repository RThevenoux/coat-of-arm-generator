import { FieldModel } from "../model.type";
import { VisualConfModel } from "./VisualConfModel";
import { getEscutcheonPath } from "../../service/EscutcheonService";

import SvgBuilder from "./SvgBuilder";
import getPalette from "../../service/PaletteService";
import * as paper from "paper";
import drawField from "./field-drawer";
import { FieldShape } from "./type";

export async function generateVisual(
  model: FieldModel,
  configuration: VisualConfModel
): Promise<string> {
  console.log("generateVisual...");

  // ?? TODO Improve paper.Project management ??
  const xSize = new paper.Size(500, 500);
  const x = new paper.Project(xSize);
  // --

  const borderSize = configuration.border.size;
  const defaultStrokeSize = configuration.defaultStrokeSize;
  const outputSize = configuration.outputSize;

  const escutcheonData = getEscutcheonPath(configuration.escutcheon);
  const escutcheonPath = new paper.Path(escutcheonData);
  const rootField: FieldShape = { type: "field", path: escutcheonPath };

  const palette = getPalette(configuration.palette);

  // Create the border to compute viewBox
  const viewBow = computeViewBox(escutcheonPath, borderSize);

  const builder = new SvgBuilder(viewBow, palette, defaultStrokeSize);

  // Draw
  await drawField(builder, model, rootField);

  // Visual effet
  const mainShapeId = _definePath(builder, escutcheonPath);
  _addBorder(builder, borderSize, mainShapeId);
  if (configuration.reflect) {
    _addReflect(builder, viewBow, mainShapeId);
  }

  return builder.container
    .att("width", outputSize.width)
    .att("height", outputSize.height)
    .end();
}

function computeViewBox(
  escutcheonPath: paper.Path,
  borderSize: number
): paper.Rectangle {
  const clone = escutcheonPath.clone();
  clone.strokeWidth = borderSize;
  return clone.strokeBounds;
}

function _definePath(builder: SvgBuilder, path: paper.Path): string {
  const id = "main-shape";
  builder.defs.ele("path").att("id", id).att("d", path.pathData);
  return id;
}

function _addBorder(
  builder: SvgBuilder,
  borderSize: number,
  mainShapeId: string
): void {
  builder.container
    .ele("use")
    .att("href", "#" + mainShapeId)
    .att("style", "fill:none;stroke:#000;stroke-width:" + borderSize);
}

function _addReflect(
  builder: SvgBuilder,
  bounds: paper.Rectangle,
  mainShapeId: string
): void {
  const gradienId = "gradient-reflect";

  const cx = bounds.width / 3;
  const cy = bounds.height / 3;
  const radius = (bounds.width * 2) / 3;

  const gradient = builder.defs
    .ele("radialGradient")
    .att("id", gradienId)
    .att("gradientUnits", "userSpaceOnUse")
    .att("cx", cx)
    .att("cy", cy)
    .att("r", radius);

  gradient
    .ele("stop")
    .att("style", "stop-color:#fff;stop-opacity:0.31")
    .att("offset", 0);
  gradient
    .ele("stop")
    .att("style", "stop-color:#fff;stop-opacity:0.25")
    .att("offset", 0.19);
  gradient
    .ele("stop")
    .att("style", "stop-color:#6b6b6b;stop-opacity:0.125")
    .att("offset", 0.6);
  gradient
    .ele("stop")
    .att("style", "stop-color:#000;stop-opacity:0.125")
    .att("offset", 1);

  builder.container
    .ele("use")
    .att("href", "#" + mainShapeId)
    .att("fill", "url(#" + gradienId + ")");
}
