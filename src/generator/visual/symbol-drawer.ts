import paper from "paper";
import { getChargeVisualInfo } from "../../service/ChargeService";
import { ChargeSymbol } from "../model.type";
import SvgBuilder from "./SvgBuilder";
import { getIncircle } from "./tool/path-tool";

export default async function drawSymbol(
  builder: SvgBuilder,
  charge: ChargeSymbol,
  containerPath: paper.PathItem
): Promise<void> {
  const chargeDef = await getChargeVisualInfo(charge.chargeId);
  const chargeSize = new paper.Size(chargeDef.width, chargeDef.height);
  const chargeRadius = _radius(chargeSize);

  // Get filler and symbol Ids
  const chargeBounds = new paper.Size(chargeDef.width, chargeDef.height);
  const fillerId = await builder._getFillerId(charge.filler, chargeBounds);
  const symbolId = builder.addSymbol(chargeDef);

  // Incircle
  const inCircle = getIncircle(containerPath);

  if (charge.count == 1) {
    // Compute scaleCoef
    const itemRadius = inCircle.radius;
    const scaleCoef = itemRadius / chargeRadius;

    _drawOneFromCenter(
      builder,
      symbolId,
      inCircle.center,
      chargeSize,
      scaleCoef,
      fillerId
    );
  } else if (charge.count == 2) {
    // Compute scaleCoef
    const itemRadius = inCircle.radius / 2;
    const scaleCoef = itemRadius / chargeRadius;

    // Compute Position
    const p1 = inCircle.center.add(new paper.Point(0, -inCircle.radius / 2));
    _drawOneFromCenter(builder, symbolId, p1, chargeSize, scaleCoef, fillerId);

    const p2 = inCircle.center.add(new paper.Point(0, +inCircle.radius / 2));
    _drawOneFromCenter(builder, symbolId, p2, chargeSize, scaleCoef, fillerId);
  } else {
    const sin = Math.sin(Math.PI / charge.count);
    const itemRadius = (inCircle.radius * sin) / (1 + sin);
    const positionRadius = inCircle.radius / (1 + sin);

    const scaleCoef = itemRadius / chargeRadius;

    for (let i = 0; i < charge.count; i++) {
      const angle = Math.PI * ((2 * i + 1) / charge.count + 1 / 2);
      const x = Math.cos(angle) * positionRadius;
      const y = -Math.sin(angle) * positionRadius;
      const p = inCircle.center.add(new paper.Point(x, y));
      _drawOneFromCenter(builder, symbolId, p, chargeSize, scaleCoef, fillerId);
    }
  }
}

function _drawOneFromCenter(
  builder: SvgBuilder,
  symbolId: string,
  center: paper.Point,
  originalSize: paper.Size,
  scaleCoef: number,
  fillerId: string
): void {
  const scaledSize = originalSize.multiply(scaleCoef);
  const deltaSize = scaledSize.divide(2);
  const origin = center.add(
    new paper.Point(-deltaSize.width, -deltaSize.height)
  );
  _drawOne(builder, symbolId, origin, scaleCoef, fillerId);
}

function _drawOne(
  builder: SvgBuilder,
  symbolId: string,
  position: paper.Point,
  scaleCoef: number,
  fillerId: string
): void {
  const strokeWidth = builder.defaultStrokeWidth / scaleCoef;
  const transform =
    "scale(" +
    scaleCoef +
    "," +
    scaleCoef +
    ") translate(" +
    position.x / scaleCoef +
    "," +
    position.y / scaleCoef +
    ")";
  builder.container
    .ele("use")
    .att("xlink:href", "#" + symbolId)
    .att("transform", transform)
    .att("fill", "url(#" + fillerId + ")")
    .att("style", builder._stroke(strokeWidth));
}

function _radius(size: paper.Size): number {
  return Math.sqrt(size.width * size.width + size.height * size.height) / 2;
}
