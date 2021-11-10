import { createStrips } from "./factory/StripFactory";
import createCross from "./factory/CrossFactory";
import drawSymbol from "./symbol-drawer";
import SvgBuilder from "./SvgBuilder";
import { ChargeCross, ChargeModel, ChargeStrip } from "../model.type";

export default async function drawCharge(
  builder: SvgBuilder,
  charge: ChargeModel,
  containerPath: paper.Path
): Promise<void> {
  switch (charge.type) {
    case "strip":
      return drawStrip(builder, charge, containerPath);
    case "cross":
      return drawCross(builder, charge, containerPath);
    case "symbol":
      return drawSymbol(builder, charge, containerPath);
    default:
      console.log("-- unsupported charge-type: " + JSON.stringify(charge));
      break;
  }
}

async function drawStrip(
  builder: SvgBuilder,
  charge: ChargeStrip,
  containerPath: paper.Path
): Promise<void> {
  const strips = createStrips(containerPath.bounds, charge.angle, charge.count);
  for (const strip of strips) {
    const path = containerPath.intersect(strip);
    await builder.fill(charge.filler, path);
  }
}

function drawCross(
  builder: SvgBuilder,
  charge: ChargeCross,
  containerPath: paper.Path
): Promise<void> {
  const rotate = charge.angle === "45";
  const cross = createCross(containerPath.bounds, rotate);
  const path = containerPath.intersect(cross);
  return builder.fill(charge.filler, path);
}
