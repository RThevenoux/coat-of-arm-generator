import { FillerSeme } from "@/generator/model.type";
import { getSemeVisualInfo } from "@/service/ChargeService";
import {
  addUse,
  fillColorStyle,
  PatternTransform,
  strokeStyle,
  svgTranslate,
} from "../svg/SvgHelper";
import SvgBuilder from "../svg/SvgBuilder";
import { SimpleShape, SymbolShape } from "../type";
import { createPatternTransfrom } from "./util";
import { ChargeVisualInfo, SemeVisualInfo } from "@/service/visual.type";

export async function createSemeFiller(
  builder: SvgBuilder,
  model: FillerSeme,
  container: SimpleShape | SymbolShape
): Promise<string> {
  const seme = await getSemeVisualInfo(model.chargeId);

  const patternTransform = computeTransform(container, seme);

  const tx = seme.tx;
  const ty = seme.ty;

  // compute each copy position
  const copyTransforms = createChargeTransforms(seme.charge, tx, ty);

  const w = tx * 2;
  const h = ty * 2;

  const pattern = builder.createPattern(w, h, patternTransform);

  pattern.addBackground(model.fieldColor);

  // Get Symbol definition id (create definition if necessary)
  const symbolId = builder.getSymbolId(seme.charge);

  // Add each copy to the pattern
  const chargeColor = builder.palette.getColor(model.chargeColor);
  const style =
    fillColorStyle(chargeColor) + strokeStyle(builder.defaultStrokeWidth);
  for (const copyTransform of copyTransforms) {
    addUse(pattern.node, symbolId, undefined, style, copyTransform);
  }

  return pattern.id;
}

function createChargeTransforms(
  charge: ChargeVisualInfo,
  tx: number,
  ty: number
) {
  const y0 = -charge.height / 2;
  const x0 = -charge.width / 2;

  const center = svgTranslate(x0 + tx, y0 + ty);
  const bottomLeft = svgTranslate(x0, y0 + 2 * ty);
  const bottomRigth = svgTranslate(x0 + 2 * tx, y0 + 2 * ty);
  const topLeft = svgTranslate(x0, y0);
  const topRigth = svgTranslate(x0 + 2 * tx, y0);

  return [center, bottomLeft, bottomRigth, topLeft, topRigth];
}

function computeTransform(
  container: SimpleShape | SymbolShape,
  seme: SemeVisualInfo
): PatternTransform {
  const semeWidth = seme.tx * 2;
  const semeHeight = seme.ty * 2;
  const chargeFullWidth = container.root.path.bounds.width / seme.repetition;
  const chargeFullHeight = (chargeFullWidth * semeHeight) / semeWidth;

  if (container.type == "strip") {
    let scale;
    if (container.stripDirection == "fasce") {
      scale = computeSemeScale(
        container.stripWidth,
        semeHeight,
        chargeFullHeight
      );
    } else {
      scale = computeSemeScale(
        container.stripWidth,
        semeWidth,
        chargeFullWidth
      );
    }

    let rotation;
    if (
      container.stripDirection == "bande" ||
      container.stripDirection == "barre"
    ) {
      rotation = container.stripAngle;
    }

    return createPatternTransfrom(container.patternAnchor, scale, rotation);
  } else if (container.type == "cross") {
    const scale = computeSemeScale(
      container.stripWidth,
      semeWidth,
      chargeFullWidth
    );
    return createPatternTransfrom(container.patternAnchor, scale);
  } else {
    const bounds = (
      container.type == "symbol" ? container.item : container.path
    ).bounds;

    const scale = computeSemeScale(bounds.width, semeWidth, chargeFullWidth);

    return createPatternTransfrom(bounds.topLeft, scale);
  }
}

function computeSemeScale(
  targetSize: number,
  patternSize: number,
  fullSize: number
): number {
  const n = Math.ceil(targetSize / fullSize);
  const scale = targetSize / (n * patternSize);
  return scale;
}
