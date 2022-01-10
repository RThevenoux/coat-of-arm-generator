import { FillerSeme } from "@/model/filler";
import { getSemeVisualInfo } from "@/service/ChargeService";
import { SvgBuilder } from "../svg/SvgBuilder";
import { SimpleShape, MobileChargeShape } from "../type";
import { createPatternTransfrom, getItem } from "./util";
import { ChargeVisualInfo, SemeVisualInfo } from "@/service/visual.type";
import { MyStyle } from "../svg/MyStyle";
import { PatternTransform, Transform, Translate } from "../svg/svg.type";

export async function createSemeFiller(
  builder: SvgBuilder,
  model: FillerSeme,
  container: SimpleShape | MobileChargeShape
): Promise<string> {
  const seme = await getSemeVisualInfo(model.chargeId);

  const patternTransform = computeTransform(container, seme);

  const tx = seme.tx;
  const ty = seme.ty;

  // compute each copy position
  const copiesTranslate = createChargeTransforms(seme.charge, tx, ty);

  const w = tx * 2;
  const h = ty * 2;

  const pattern = builder.createPattern(w, h, patternTransform);

  pattern.addBackground({ colorId: model.fieldColor });

  // Get Symbol definition id (create definition if necessary)
  const symbolId = builder.getChargeSymbolId(seme.charge);

  // Add each copy to the pattern
  const style: MyStyle = { colorId: model.chargeColor, border: true };

  for (const copyTranslate of copiesTranslate) {
    pattern.addUse(symbolId, [copyTranslate], style);
  }

  return pattern.id;
}

function createChargeTransforms(
  charge: ChargeVisualInfo,
  tx: number,
  ty: number
): Transform[] {
  const y0 = -charge.height / 2;
  const x0 = -charge.width / 2;

  const center = translate(x0 + tx, y0 + ty);
  const bottomLeft = translate(x0, y0 + 2 * ty);
  const bottomRigth = translate(x0 + 2 * tx, y0 + 2 * ty);
  const topLeft = translate(x0, y0);
  const topRigth = translate(x0 + 2 * tx, y0);

  return [center, bottomLeft, bottomRigth, topLeft, topRigth];
}

function translate(tx: number, ty: number): Translate {
  return { type: "translate", tx, ty };
}

function computeTransform(
  container: SimpleShape | MobileChargeShape,
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
    const bounds = getItem(container).bounds;
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
