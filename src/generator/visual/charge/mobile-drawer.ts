import paper from "paper";
import { SvgBuilder } from "../svg/SvgBuilder";
import { ChargeVisualInfo } from "@/service/visual.type";
import { getChargeVisualInfo } from "@/service/ChargeService";
import { FillerModel } from "@/model/filler";
import { ChargeSymbol } from "@/model/charge";
import { getIncircle } from "../tool/path-tool";
import { point } from "../tool/point";
import { FieldShape } from "../type";

export async function drawMobileCharge(
  builder: SvgBuilder,
  charge: ChargeSymbol,
  container: FieldShape
): Promise<void> {
  const chargeDef = await getChargeVisualInfo(charge.chargeId);
  const chargeSize = new paper.Size(chargeDef.width, chargeDef.height);
  const chargeRadius = _radius(chargeSize);

  // Incircle
  const inCircle = getIncircle(container.path);

  if (charge.count == 1) {
    // Compute scaleCoef
    const itemRadius = inCircle.radius;
    const scaleCoef = itemRadius / chargeRadius;

    _drawOneFromCenter(
      builder,
      chargeDef,
      inCircle.center,
      chargeSize,
      scaleCoef,
      charge.filler
    );
  } else if (charge.count == 2) {
    // Compute scaleCoef
    const itemRadius = inCircle.radius / 2;
    const scaleCoef = itemRadius / chargeRadius;

    // Compute Position
    const p1 = inCircle.center.add(point(0, -inCircle.radius / 2));
    _drawOneFromCenter(
      builder,
      chargeDef,
      p1,
      chargeSize,
      scaleCoef,
      charge.filler
    );

    const p2 = inCircle.center.add(point(0, +inCircle.radius / 2));
    _drawOneFromCenter(
      builder,
      chargeDef,
      p2,
      chargeSize,
      scaleCoef,
      charge.filler
    );
  } else {
    const sin = Math.sin(Math.PI / charge.count);
    const itemRadius = (inCircle.radius * sin) / (1 + sin);
    const positionRadius = inCircle.radius / (1 + sin);

    const scaleCoef = itemRadius / chargeRadius;

    for (let i = 0; i < charge.count; i++) {
      const angle = Math.PI * ((2 * i + 1) / charge.count + 1 / 2);
      const x = Math.cos(angle) * positionRadius;
      const y = -Math.sin(angle) * positionRadius;
      const p = inCircle.center.add(point(x, y));
      _drawOneFromCenter(
        builder,
        chargeDef,
        p,
        chargeSize,
        scaleCoef,
        charge.filler
      );
    }
  }
}

function _drawOneFromCenter(
  builder: SvgBuilder,
  chargeDef: ChargeVisualInfo,
  center: paper.Point,
  originalSize: paper.Size,
  scaleCoef: number,
  filler: FillerModel
): void {
  const scaledSize = originalSize.multiply(scaleCoef);
  const deltaSize = scaledSize.divide(2);
  const origin = center.add(point(-deltaSize.width, -deltaSize.height));
  builder.drawCharge(chargeDef, origin, scaleCoef, filler);
}

function _radius(size: paper.Size): number {
  return Math.sqrt(size.width * size.width + size.height * size.height) / 2;
}
