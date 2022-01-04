import { createStrips } from "./shape/StripsFactory";
import { createCross } from "./shape/CrossFactory";
import drawSymbol from "./symbol-drawer";
import SvgBuilder from "./svg/SvgBuilder";
import {
  ChargeCross,
  ChargeModel,
  ChargeStrip,
  FillerModel,
} from "../model.type";
import { FieldShape, StripItem } from "./type";
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
  const item = createStrips(strip, container);
  const element = await drawStripItem(builder, strip.filler, item);
  clip(builder, element, container);
}

async function drawStripItem(
  builder: SvgBuilder,
  filler: FillerModel,
  item: StripItem,
  parent?: XMLElement
): Promise<XMLElement> {
  if (item.type == "strip") {
    return builder.fill(filler, item, parent);
  } else {
    const group = builder.createGroup(parent);
    for (const subItem of item.stripItems) {
      await drawStripItem(builder, filler, subItem, group);
    }
    return group;
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
