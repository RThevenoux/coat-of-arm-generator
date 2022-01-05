import { SvgBuilder } from "../svg/SvgBuilder";
import { ChargeStrip, FillerModel } from "@/generator/model.type";
import { XMLElement } from "xmlbuilder";
import { createStrips } from "../shape/StripsFactory";
import { addClipPathAttribute, addUse } from "../svg/SvgHelper";
import { FieldShape, StripItem } from "../type";

export async function drawStripCharge(
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
  } else if (item.type == "stripClones") {
    const symbol = builder.addSymbol();
    drawStripItem(builder, filler, item.clonePattern, symbol.node);

    const group = builder.createGroup(parent);
    for (const position of item.clonePositions) {
      const useNode = addUse(group, symbol.symbolId);
      useNode.att("x", position.x);
      useNode.att("y", position.y);
    }
    return group;
  } else {
    // stripGroup
    const group = builder.createGroup(parent);
    for (const subItem of item.stripItems) {
      await drawStripItem(builder, filler, subItem, group);
    }
    return group;
  }
}

function clip(
  builder: SvgBuilder,
  element: XMLElement,
  container: FieldShape
): void {
  const clipPathId = builder.getClipPathId(container);
  addClipPathAttribute(element, clipPathId);
}
