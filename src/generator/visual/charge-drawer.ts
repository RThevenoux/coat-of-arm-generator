import { createStrips } from "./shape/StripFactory";
import { createCross, createCrossSaltire } from "./shape/CrossFactory";
import drawSymbol from "./symbol-drawer";
import SvgBuilder from "./svg/SvgBuilder";
import { ChargeCross, ChargeModel, ChargeStrip } from "../model.type";
import { FieldShape } from "./type";

export default async function drawCharge(
  builder: SvgBuilder,
  charge: ChargeModel,
  container: FieldShape
): Promise<void> {
  switch (charge.type) {
    case "strip":
      return drawStrip(builder, charge, container);
    case "cross":
      return drawCross(builder, charge, container);
    case "symbol":
      return drawSymbol(builder, charge, container);
    default:
      console.log("-- unsupported charge-type: " + JSON.stringify(charge));
      break;
  }
}

async function drawStrip(
  builder: SvgBuilder,
  stripModel: ChargeStrip,
  container: FieldShape
): Promise<void> {
  const strips = createStrips(
    container,
    stripModel.direction,
    stripModel.count
  );
  for (const stripShape of strips) {
    await builder.fill(stripModel.filler, stripShape);
  }
}

function drawCross(
  builder: SvgBuilder,
  charge: ChargeCross,
  container: FieldShape
): Promise<void> {
  if (charge.direction === "barre" || charge.direction === "bande") {
    const shape = createCrossSaltire(container);
    return builder.fill(charge.filler, shape);
  } else {
    const shape = createCross(container);
    return builder.fill(charge.filler, shape);
  }
}
