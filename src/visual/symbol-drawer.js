import getCharge from './charge-manager';
import { getIncircle } from './path-tool'

export default function drawSymbol(builder, charge, containerPath) {
  let chargeDef = getCharge(charge.chargeId);

  let fillerId = builder._getFillerId(charge.filler, containerPath.bounds);

  let inCircle = getIncircle(containerPath);
  let chargeRadius = _distance(chargeDef.width, chargeDef.height) / 2;

  let scaleCoef = inCircle.radius / chargeRadius;

  let x = inCircle.center.x - chargeDef.width * scaleCoef / 2;
  let y = inCircle.center.y - chargeDef.height * scaleCoef / 2;

  let transform = "scale(" + scaleCoef + "," + scaleCoef + ") translate(" + x / scaleCoef + "," + y / scaleCoef + ")";

  let strokeWidth = builder.defaultStrokeWidth / scaleCoef;
  let symbolId = builder.addSymbol(chargeDef);
  builder.container.ele("use")
    .att("xlink:href", "#" + symbolId)
    .att("transform", transform)
    .att("fill", "url(#" + fillerId + ")")
    .att("style", builder._stroke(strokeWidth));
}

function _distance(a, b) {
  return Math.sqrt(a * a + b * b);
}