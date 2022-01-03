import { ChargeStrip, Direction } from "@/generator/model.type";
import { point } from "../tool/point";
import { FieldShape, StripShape } from "../type";
import { RotationDef } from "./StripFactoryData.type";

interface SingleStripe {
  path: paper.Path;
  patternAnchor: paper.Point;
}

export class StripHelper {
  private readonly mainDelta: number;
  private readonly groupOrigin: number;
  private readonly groupCount: number;
  private readonly stripByGroup: number;
  private readonly stripDirection: Direction;
  private readonly stripAngle: number;
  private readonly fixedOrigin: number;
  readonly stripWidth: number;
  readonly stripLength: number;

  constructor(
    model: ChargeStrip,
    private readonly container: FieldShape,
    private readonly rotation: RotationDef | "pal" | "fasce"
  ) {
    let totalSize: number;
    let origin: number;

    if (rotation == "fasce") {
      const bounds = container.path.bounds;
      totalSize = bounds.height;
      origin = bounds.y;
      this.fixedOrigin = bounds.x;
      this.stripLength = bounds.width;
      this.stripDirection = "fasce";
      this.stripAngle = 90;
    } else if (rotation == "pal") {
      const bounds = container.path.bounds;
      totalSize = bounds.width;
      origin = bounds.x;
      this.fixedOrigin = bounds.y;
      this.stripLength = bounds.height;
      this.stripDirection = "pal";
      this.stripAngle = 0;
    } else {
      const containerClone = container.path.clone();
      containerClone.rotate(-rotation.angle, rotation.center);

      const bounds = containerClone.bounds;
      totalSize = bounds.width;
      origin = bounds.x;
      this.fixedOrigin = bounds.y;
      this.stripLength = bounds.height;
      this.stripDirection = rotation.angle > 0 ? "barre" : "bande";
      this.stripAngle = rotation.angle;
    }

    this.groupCount = model.count;

    const minimalStripRatio = this._minimalGroupRatio(model);

    const groupWidth =
      totalSize / Math.max(minimalStripRatio, 2 * this.groupCount + 1);
    this.mainDelta = totalSize / (2 * this.groupCount + 1);
    this.stripByGroup = this._stripByGroup(model);

    this.stripWidth = groupWidth / (2 * this.stripByGroup - 1);
    this.groupOrigin = origin + (this.mainDelta - groupWidth) / 2;
  }

  private stripPosition(groupIndex: number, stripIndex: number): number {
    const groupPosition =
      this.groupOrigin + (2 * groupIndex + 1) * this.mainDelta;
    return groupPosition + this.stripWidth * 2 * stripIndex;
  }

  public build(pattern: paper.Path): StripShape[] {
    const result: StripShape[] = [];

    for (let groupIndex = 0; groupIndex < this.groupCount; groupIndex++) {
      for (let stripIndex = 0; stripIndex < this.stripByGroup; stripIndex++) {
        const position = this.stripPosition(groupIndex, stripIndex);
        const topLeft = this.getTopLeft(position);
        const singleStrip = createSingleStrip(topLeft, pattern, this.rotation);

        result.push({
          type: "strip",
          path: singleStrip.path,
          root: this.container.root,
          stripDirection: this.stripDirection,
          stripAngle: this.stripAngle,
          stripWidth: this.stripWidth,
          patternAnchor: singleStrip.patternAnchor,
        });
      }
    }
    return result;
  }

  _stripByGroup(model: ChargeStrip): number {
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

  _minimalGroupRatio(model: ChargeStrip): number {
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

  getTopLeft(position: number): paper.Point {
    if (this.stripDirection == "fasce") {
      return point(this.fixedOrigin, position);
    } else {
      return point(position, this.fixedOrigin);
    }
  }
}

function createSingleStrip(
  topLeft: paper.Point,
  stripPattern: paper.Path,
  rotation: RotationDef | "pal" | "fasce"
): SingleStripe {
  const stripPath = stripPattern.clone();
  stripPath.translate(topLeft);
  if (rotation == "pal" || rotation == "fasce") {
    return {
      path: stripPath,
      patternAnchor: topLeft,
    };
  } else {
    stripPath.rotate(rotation.angle, rotation.center);
    const anchor = topLeft.rotate(-rotation.angle, rotation.center); // Not clear why rotation must be negate...
    return {
      path: stripPath,
      patternAnchor: anchor,
    };
  }
}
