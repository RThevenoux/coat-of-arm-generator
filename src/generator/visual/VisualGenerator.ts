import { FieldModel } from "../model.type";
import { VisualConfModel } from "./VisualConfModel";
import { getEscutcheonPath } from "../../service/EscutcheonService";

import SvgBuilder from "./SvgBuilder";
import getPaletteData from "../../service/PaletteService";
import * as paper from "paper";
import drawField from "./field-drawer";
import { FieldShape } from "./type";
import { Palette } from "./Palette";

export async function generateVisual(
  model: FieldModel,
  configuration: VisualConfModel
): Promise<string> {
  console.log("generateVisual...");

  // ?? TODO Improve paper.Project management ??
  const xSize = new paper.Size(500, 500);
  new paper.Project(xSize);
  // --

  const escutcheonData = getEscutcheonPath(configuration.escutcheon);
  const escutcheonPath = new paper.Path(escutcheonData);

  const paletteData = getPaletteData(configuration.palette);
  const palette = new Palette(paletteData);

  const builder = new SvgBuilder(
    escutcheonPath,
    palette,
    configuration.defaultStrokeSize
  );

  // Draw
  const rootField: FieldShape = { type: "field", path: escutcheonPath };
  await drawField(builder, model, rootField);

  builder.addBorder(configuration.border.size);
  if (configuration.reflect) {
    builder.addReflect();
  }

  return builder.build(configuration.outputSize);
}
