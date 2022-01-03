import { createStrips } from "./shape/StripFactory";
import { createCross } from "./shape/CrossFactory";
import drawSymbol from "./symbol-drawer";
import SvgBuilder from "./svg/SvgBuilder";
import { ChargeCross, ChargeModel, ChargeStrip } from "../model.type";
import { FieldShape } from "./type";
import { XMLElement } from "xmlbuilder";
import { addClipPathAttribute } from "./svg/SvgHelper";

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
  strip: ChargeStrip,
  container: FieldShape
): Promise<void> {
  const strips = createStrips(strip, container);
  for (const stripShape of strips) {
    const path = await builder.fill(strip.filler, stripShape);
    clip(builder, path, container);
  }
}

async function drawCross(
  builder: SvgBuilder,
  cross: ChargeCross,
  container: FieldShape
): Promise<void> {
  const shape = createCross(cross, container);
  await builder.fill(cross.filler, shape);
}

function clip(
  builder: SvgBuilder,
  element: XMLElement,
  container: FieldShape
): void {
  const clipPathId = builder.getClipPathId(container);
  addClipPathAttribute(element, clipPathId);
}
