import { point } from "../tool/point";
import { StripItem, StripShape } from "../type";
import { StripGroupData } from "./strip.type";

class StripItemBuilder {
  private readonly items: StripItem[] = [];

  add(item: StripItem): void {
    this.items.push(item);
  }

  build(): StripItem {
    if (this.items.length == 1) {
      return this.items[0];
    }

    return {
      type: "stripGroup",
      stripItems: this.items,
    };
  }
}

export function buildStripShapes(
  data: StripGroupData,
  pattern: paper.Path
): StripItem {
  const builder = new StripItemBuilder();

  for (let groupIndex = 0; groupIndex < data.groupCount; groupIndex++) {
    const innerItems = buildInnerGroup(data, pattern, groupIndex);
    builder.add(innerItems);
  }

  return builder.build();
}

function buildInnerGroup(
  data: StripGroupData,
  pattern: paper.Path,
  groupIndex: number
): StripItem {
  const builder = new StripItemBuilder();

  for (let stripIndex = 0; stripIndex < data.stripByGroup; stripIndex++) {
    const position = stripPosition(data, groupIndex, stripIndex);
    const singleStrip = createSingleStrip(position, pattern, data);
    builder.add(singleStrip);
  }

  return builder.build();
}

function stripPosition(
  data: StripGroupData,
  groupIndex: number,
  stripIndex: number
): number {
  const groupPosition =
    data.groupOrigin + (2 * groupIndex + 1) * data.mainDelta;
  return groupPosition + data.stripWidth * 2 * stripIndex;
}

function createSingleStrip(
  position: number,
  stripPattern: paper.Path,
  data: StripGroupData
): StripShape {
  const topLeft = point(position, data.fixedOrigin);

  const stripPath = stripPattern.clone();
  stripPath.translate(topLeft);

  const rotation = data.rotation;
  stripPath.rotate(rotation.angle, rotation.center);
  const anchor = topLeft.rotate(-rotation.angle, rotation.center); // Not clear why rotation must be negate...

  return {
    type: "strip",
    path: stripPath,
    root: data.root,
    stripDirection: data.rotation.direction,
    stripAngle: data.rotation.angle,
    stripWidth: data.stripWidth,
    patternAnchor: anchor,
  };
}
