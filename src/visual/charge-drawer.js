import { getStrips } from './strip-drawer';
import getCross from './cross-drawer';
import addSymbol from './symbol-drawer';

export default function addCharge(builder, charge, containerPath) {
  switch (charge.type) {
    case 'strip': {
      let strips = getStrips(containerPath.bounds, charge.angle, charge.count);
      strips.forEach(strip => {
        let path = containerPath.intersect(strip);
        builder.fill(charge.filler, path);
      });
    } break;
    case 'cross': {
      let rotate = (charge.angle == "45");
      let cross = getCross(containerPath.bounds, rotate);
      let path = containerPath.intersect(cross);
      builder.fill(charge.filler, path);
    } break;
    case 'symbol': addSymbol(builder, charge, containerPath); break;
    default: console.log("-- unsupported charge-type: " + JSON.stringify(charge)); break;
  }
}