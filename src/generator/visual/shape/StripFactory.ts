import * as paper from "paper";
import { ChargeStrip } from "../../model.type";
import { FieldShape, StripShape } from "../type";

export function createStrips(
  strip: ChargeStrip,
  container: FieldShape
): StripShape[] {
  switch (strip.direction) {
    case "fasce":
      return createFasces(container, strip);
    case "pal":
      return createPals(container, strip);
    case "bande":
    case "barre":
      return createDiagonals(container, strip);
    default:
      console.log("invalid angle " + strip.direction);
      return [];
  }
}

function createFasces(container: FieldShape, model: ChargeStrip): StripShape[] {
  const bounds = container.path.bounds;
  const helper = new StripHelper(model, bounds.height, bounds.y);
  return helper.build((yStrip, stripWidth) =>
    createStraight(yStrip, stripWidth, container, "fasce")
  );
}

function createPals(container: FieldShape, model: ChargeStrip): StripShape[] {
  const bounds = container.path.bounds;
  const helper = new StripHelper(model, bounds.width, bounds.x);
  return helper.build((xStrip, stripWidth) =>
    createStraight(xStrip, stripWidth, container, "pal")
  );
}

function createStraight(
  position: number,
  stripWidth: number,
  container: FieldShape,
  direction: "fasce" | "pal"
): StripShape {
  const bounds = container.path.bounds;

  const topLeft =
    direction == "pal"
      ? new paper.Point(position, bounds.y)
      : new paper.Point(bounds.x, position);
  const strip = new paper.Path.Rectangle({
    point: topLeft,
    size:
      direction == "pal"
        ? [stripWidth, bounds.height]
        : [bounds.width, stripWidth],
  });

  const clippedStrip = _clip(strip, container);

  return {
    type: "strip",
    path: clippedStrip,
    root: container.root,
    stripDirection: direction,
    stripAngle: direction == "pal" ? 0 : 90,
    stripWidth: stripWidth,
    patternAnchor: topLeft,
  };
}

function createDiagonals(container: FieldShape, model: ChargeStrip) {
  const rotation = computeDiagonalRotation(container, model);

  const clone = container.path.clone();
  clone.rotate(-rotation.angle, rotation.center);

  const bounds = clone.bounds;

  const helper = new StripHelper(model, bounds.width, bounds.x);

  return helper.build((xStrip, stripWidth) => {
    const stripData = createDiagonalData(xStrip, stripWidth, clone, rotation);
    return createDiagonalShape(
      stripData,
      container,
      stripWidth,
      rotation.angle
    );
  });
}

function computeDiagonalRotation(
  container: FieldShape,
  model: ChargeStrip
): RotationDef {
  const path = container.path;

  const angleRad = Math.atan2(path.bounds.height, path.bounds.width);
  const angleDeg = (angleRad * 180) / Math.PI;
  const angle = model.direction == "barre" ? 90 - angleDeg : angleDeg - 90;
  const center = new paper.Point(0, 0);
  return { angle, center };
}

function createDiagonalData(
  x: number,
  stripWidth: number,
  clone: paper.Path,
  rotation: RotationDef
): {
  stripPath: paper.Path;
  anchor: paper.Point;
} {
  const bounds = clone.bounds;

  const topLeft = new paper.Point(x, bounds.y);
  const stripPath = new paper.Path.Rectangle({
    point: topLeft,
    size: [stripWidth, bounds.height],
  });
  stripPath.rotate(rotation.angle, rotation.center);
  const anchor = topLeft.rotate(-rotation.angle, rotation.center); // Not clear why rotation must be negate...

  return { stripPath, anchor };
}

function createDiagonalShape(
  data: { stripPath: paper.Path; anchor: paper.Point },
  container: FieldShape,
  stripWidth: number,
  angle: number
): StripShape {
  const clippedStrip = _clip(data.stripPath, container);

  return {
    type: "strip",
    path: clippedStrip,
    root: container.root,
    stripDirection: angle > 0 ? "barre" : "bande",
    stripAngle: angle,
    stripWidth: stripWidth,
    patternAnchor: data.anchor,
  };
}

interface RotationDef {
  angle: number;
  center: paper.Point;
}

function _clip(path: paper.Path, container: FieldShape) {
  const clippedStrip = container.path.intersect(path);
  if (!(clippedStrip instanceof paper.Path)) {
    throw new Error("Clipped strip is not a simple Path");
  }
  return clippedStrip;
}

class StripHelper {
  private readonly mainDelta: number;
  private readonly groupOrigin: number;
  private readonly groupCount: number;
  private readonly stripByGroup: number;
  private readonly stripWidth: number;

  constructor(model: ChargeStrip, totalSize: number, origin: number) {
    this.groupCount = model.count;

    const minimalStripRatio = _minimalGroupRatio(model);

    const groupWidth =
      totalSize / Math.max(minimalStripRatio, 2 * this.groupCount + 1);
    this.mainDelta = totalSize / (2 * this.groupCount + 1);
    this.stripByGroup = _stripByGroup(model);

    this.stripWidth = groupWidth / (2 * this.stripByGroup - 1);
    this.groupOrigin = origin + (this.mainDelta - groupWidth) / 2;
  }

  private stripPosition(groupIndex: number, stripIndex: number): number {
    const groupPosition =
      this.groupOrigin + (2 * groupIndex + 1) * this.mainDelta;
    return groupPosition + this.stripWidth * 2 * stripIndex;
  }

  public build(
    stripBuilder: (postion: number, width: number) => StripShape
  ): StripShape[] {
    const result = [];

    for (let groupIndex = 0; groupIndex < this.groupCount; groupIndex++) {
      for (let stripIndex = 0; stripIndex < this.stripByGroup; stripIndex++) {
        const position = this.stripPosition(groupIndex, stripIndex);
        const strip = stripBuilder(position, this.stripWidth);
        result.push(strip);
      }
    }

    return result;
  }
}

function _stripByGroup(model: ChargeStrip): number {
  switch (model.size) {
    case "default":
    case "reduced":
    case "minimal":
      return 1;
    case "gemel":
      return 2;
    case "triplet":
      return 3;
  }
}

function _minimalGroupRatio(model: ChargeStrip): number {
  switch (model.size) {
    case "default":
    case "gemel":
    case "triplet":
      return 3;
    case "reduced":
      return 6;
    case "minimal":
      return 12;
  }
}
