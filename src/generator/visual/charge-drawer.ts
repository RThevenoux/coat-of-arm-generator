import * as paper from "paper";
import { createStrips } from "./factory/StripFactory";
import createCross from "./factory/CrossFactory";
import drawSymbol from "./symbol-drawer";
import SvgBuilder from "./SvgBuilder";
import { ChargeCross, ChargeModel, ChargeStrip } from "../model.type";
import { OtherShape, FieldShape, StripShape } from "./type";

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
    container.path.bounds,
    stripModel.angle,
    stripModel.count
  );
  for (const strip of strips) {
    const stripPath = container.path.intersect(strip);
    if (!(stripPath instanceof paper.Path)) {
      throw new Error("Clipped strip is not a simple Path");
    }
    const stripShape: StripShape = { type: "strip", path: stripPath };
    await builder.fill(stripModel.filler, stripShape);
  }
}

function drawCross(
  builder: SvgBuilder,
  charge: ChargeCross,
  container: FieldShape
): Promise<void> {
  const rotate = charge.angle === "45";
  const cross = createCross(container.path.bounds, rotate);
  const path = container.path.intersect(cross);
  const shape: OtherShape = { type: "other", path: path };
  return builder.fill(charge.filler, shape);
}
