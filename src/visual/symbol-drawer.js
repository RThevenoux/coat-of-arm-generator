import paper from 'paper-jsdom';

import getCharge from './charge-manager';
import { getIncircle } from './path-tool';

export default function drawSymbol(builder, charge, containerPath) {
  let chargeDef = getCharge(charge.chargeId);
  let chargeSize = new paper.Size(chargeDef.width, chargeDef.height);
  let chargeRadius = _radius(chargeSize);

  // Get filler and symbol Ids
  let chargeBounds = {
    width: chargeDef.width,
    height: chargeDef.height
  };
  let fillerId = builder._getFillerId(charge.filler, chargeBounds);
  let symbolId = builder.addSymbol(chargeDef);

  // Incircle
  let inCircle = getIncircle(containerPath);

  if (charge.count == 1) {
    // Compute scaleCoef
    let itemRadius = inCircle.radius;
    let scaleCoef = itemRadius / chargeRadius;
    
    _drawOneFromCenter(builder, symbolId, inCircle.center, chargeSize, scaleCoef, fillerId);
  } else if (charge.count == 2) {
    // Compute scaleCoef
    let itemRadius = inCircle.radius / 2;
    let scaleCoef = itemRadius / chargeRadius;

    // Compute Position
    let p1 = inCircle.center.add([0, -inCircle.radius / 2]);
    _drawOneFromCenter(builder, symbolId, p1, chargeSize, scaleCoef, fillerId);
   
    let p2 = inCircle.center.add([0, +inCircle.radius / 2]);
    _drawOneFromCenter(builder, symbolId, p2, chargeSize, scaleCoef, fillerId);
  } else {
    let sin = Math.sin(Math.PI / (charge.count));
    let itemRadius = inCircle.radius * sin / (1 + sin);
    let positionRadius = inCircle.radius / (1 + sin);

    let scaleCoef = itemRadius / chargeRadius;

    for (let i = 0; i < charge.count; i++) {
      let angle = Math.PI * ((2 * i + 1) / (charge.count) + 1 / 2);
      let x = Math.cos(angle) * positionRadius;
      let y = -Math.sin(angle) * positionRadius;
      let p = inCircle.center.add([x, y]);
      _drawOneFromCenter(builder, symbolId, p, chargeSize, scaleCoef, fillerId);
    }
  }
}

function _drawOneFromCenter(builder, symbolId, center, originalSize, scaleCoef, fillerId) {
  let scaledSize = originalSize.multiply(scaleCoef);
  let origin = center.subtract(scaledSize.divide(2));
  _drawOne(builder, symbolId, origin, scaleCoef, fillerId);
}

function _drawOne(builder, symbolId, position, scaleCoef, fillerId) {
  let strokeWidth = builder.defaultStrokeWidth / scaleCoef;
  let transform = "scale(" + scaleCoef + "," + scaleCoef + ") translate(" + position.x / scaleCoef + "," + position.y / scaleCoef + ")";
  builder.container.ele("use")
    .att("xlink:href", "#" + symbolId)
    .att("transform", transform)
    .att("fill", "url(#" + fillerId + ")")
    .att("style", builder._stroke(strokeWidth));
}

function _radius(size) {
  return Math.sqrt(size.width * size.width + size.height * size.height) / 2;
}