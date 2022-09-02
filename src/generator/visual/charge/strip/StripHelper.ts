import { FillerModel } from "@/model/filler";
import { Direction } from "@/model/misc";
import { createVerticalStripPath } from "../../shape/strip.factory";
import { StripData, StripOutlineData } from "../../shape/strip.type";
import { point } from "../../tool/point";
import { FieldShape, StripShape } from "../../type";
import { StripClonesBuilder } from "./StripClonesBuilder";
import { StripRotationHelper } from "./StripRotationHelper";
import { StripItem, StripSingle } from "./type";

export class StripHelper {
  readonly rotation: StripRotationHelper;

  constructor(readonly container: FieldShape, direction: Direction) {
    this.rotation = computeRotationHelper(container, direction);
  }

  width(): number {
    return this.rotation.rotatedBounds.width;
  }

  cloneBuilder(pattern: StripItem): StripClonesBuilder {
    return new StripClonesBuilder(pattern, this.rotation);
  }

  createSingleStrip(
    x: number,
    width: number,
    filler: FillerModel,
    outline: StripOutlineData
  ): StripSingle {
    const bounds = this.rotation.rotatedBounds;
    const data: StripData = {
      width,
      length: bounds.height,
      root: this.container.root,
      filler,
      outline,
    };
    const position = point(x, bounds.y);

    const stripPath = createVerticalStripPath(data);
    stripPath.translate(position);
    const __bounds = stripPath.bounds;

    this.rotation.rotatePath(stripPath);
    const anchor = this.rotation.rotatePoint(position);

    const shape: StripShape = {
      type: "strip",
      path: stripPath,
      root: data.root,
      stripDirection: this.rotation.direction,
      stripAngle: this.rotation.angle,
      stripWidth: data.width,
      patternAnchor: anchor,
    };

    return {
      type: "stripSingle",
      filler: data.filler,
      shape,
      __bounds,
    };
  }
}

function computeRotationHelper(
  container: FieldShape,
  direction: Direction
): StripRotationHelper {
  if (direction == "pal") {
    return new StripRotationHelper(0, direction, container);
  } else if (direction == "fasce") {
    return new StripRotationHelper(90, direction, container);
  }

  const bounds = container.path.bounds;

  const angleRad = Math.atan2(bounds.height, bounds.width);
  const angleDeg = (angleRad * 180) / Math.PI;
  const angle = direction == "barre" ? 90 - angleDeg : angleDeg - 90;

  return new StripRotationHelper(angle, direction, container);
}
