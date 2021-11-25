import { FillerSeme } from "@/generator/model.type";
import { getSemeVisualInfo } from "@/service/ChargeService";
import {
  addPattern,
  addRectangle,
  addUse,
  fillColorStyle,
  strokeStyle,
  svgTranslate,
} from "../svg/SvgHelper";
import SvgBuilder from "../SvgBuilder";
import { SimpleShape, SymbolShape } from "../type";
import { createPatternTransfrom } from "./util";
import { SemeVisualInfo } from "@/service/visual.type";

export async function createSemeFiller(
  builder: SvgBuilder,
  model: FillerSeme,
  container: SimpleShape | SymbolShape,
  id: string
): Promise<string> {
  const seme = await getSemeVisualInfo(model.chargeId);

  const transformParam = computeTransform(container, seme);

  const tx = seme.tx;
  const ty = seme.ty;

  const w = tx * 2;
  const h = ty * 2;

  const patternNode = addPattern(builder.defs, id, w, h, transformParam);

  // Add background to the pattern
  const backgroundColor = builder.palette.getColor(model.fieldColor);
  addRectangle(patternNode, 0, 0, w, h, backgroundColor);

  // Get Symbol definition id (create definition if necessary)
  const symbolId = builder._addSymbol(seme.charge);

  // compute each copy position
  const y0 = -seme.charge.height / 2;
  const x0 = -seme.charge.width / 2;

  const center = svgTranslate(x0 + tx, y0 + ty);
  const bottomLeft = svgTranslate(x0, y0 + 2 * ty);
  const bottomRigth = svgTranslate(x0 + 2 * tx, y0 + 2 * ty);
  const topLeft = svgTranslate(x0, y0);
  const topRigth = svgTranslate(x0 + 2 * tx, y0);
  const copyTransforms = [center, bottomLeft, bottomRigth, topLeft, topRigth];

  // Add each copy to the pattern
  const chargeColor = builder.palette.getColor(model.chargeColor);
  const style =
    fillColorStyle(chargeColor) + strokeStyle(builder.defaultStrokeWidth);
  for (const copyTransform of copyTransforms) {
    addUse(patternNode, symbolId, undefined, style, copyTransform);
  }

  return id;
}

function computeTransform(
  container: SimpleShape | SymbolShape,
  seme: SemeVisualInfo
) {
  if (container.type == "strip") {
    // Compute scaling to display 2 pattern on the strip width
    const scale = container.stripWidth / (2 * seme.tx * 2);

    let rotation = 0;
    if (
      container.stripDirection == "bande" ||
      container.stripDirection == "barre"
    ) {
      rotation = container.stripAngle;
    }

    return createPatternTransfrom(container.patternAnchor, scale, rotation);
  } else if (container.type == "cross") {
    const scale = container.stripWidth / (2 * seme.tx * 2);
    return createPatternTransfrom(container.patternAnchor, scale);
  } else {
    const bounds = (
      container.type == "symbol" ? container.item : container.path
    ).bounds;
    const scale = bounds.width / (seme.repetition * seme.tx * 2);
    return createPatternTransfrom(bounds.topLeft, scale);
  }
}
