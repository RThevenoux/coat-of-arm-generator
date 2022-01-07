import { SvgBuilder } from "../svg/SvgBuilder";
import { ChargeStrip } from "@/generator/model.type";
import { XMLElement } from "xmlbuilder";
import { createStrips } from "../shape/StripsFactory";
import {
  addClipPathAttribute,
  addUse,
  addViewBoxAndDimensions,
} from "../svg/SvgHelper";
import {
  FieldShape,
  StripClones,
  StripComposition,
  StripItem,
  StripSingle,
} from "../type";
import { BoundsBuilder } from "./BoundsBuilder";

export async function drawStripCharge(
  builder: SvgBuilder,
  model: ChargeStrip,
  container: FieldShape
): Promise<void> {
  const item = createStrips(model, container);
  const strips = await drawStripItem(builder, item);
  clip(builder, strips.node, container);
}

async function drawStripItem(
  builder: SvgBuilder,
  item: StripItem,
  parent?: XMLElement
): Promise<{ node: XMLElement; bounds: paper.Rectangle }> {
  switch (item.type) {
    case "stripSingle":
      return drawSingle(builder, item, parent);
    case "stripClones":
      return drawClones(builder, item, parent);
    case "stripComposition":
      return drawComposition(builder, item, parent);
  }
}

async function drawSingle(
  builder: SvgBuilder,
  item: StripSingle,
  parent?: XMLElement
) {
  const node = await builder.fill(item.filler, item.shape, parent);
  return { node, bounds: item.shape.path.bounds };
}

async function drawComposition(
  builder: SvgBuilder,
  item: StripComposition,
  parent?: XMLElement
): Promise<{ node: XMLElement; bounds: paper.Rectangle }> {
  const boundsBuilder = new BoundsBuilder();
  const group = builder.createGroup(parent);
  for (const subItem of item.stripItems) {
    const strips = await drawStripItem(builder, subItem, group);
    boundsBuilder.add(strips.bounds);
  }
  return { node: group, bounds: boundsBuilder.build() };
}

async function drawClones(
  builder: SvgBuilder,
  item: StripClones,
  parent?: XMLElement
): Promise<{ node: XMLElement; bounds: paper.Rectangle }> {
  const symbol = builder.addSymbol();

  const strips = await drawStripItem(builder, item.clonePattern, symbol.node);
  addViewBoxAndDimensions(symbol.node, strips.bounds);

  const group = builder.createGroup(parent);
  const boundsBuilder = new BoundsBuilder();

  for (const position of item.clonePositions) {
    const useNode = addUse(group, symbol.symbolId);
    useNode.att("x", position.x);
    useNode.att("y", position.y);
    boundsBuilder.add(position);
  }
  return { node: group, bounds: boundsBuilder.build() };
}

function clip(
  builder: SvgBuilder,
  element: XMLElement,
  container: FieldShape
): void {
  const clipPathId = builder.getClipPathId(container);
  addClipPathAttribute(element, clipPathId);
}
