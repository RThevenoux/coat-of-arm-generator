import { getOutlineInfo } from "@/service/OutlineService";
import * as paper from "paper";
import { ChargeStrip, StripOutline } from "../../model.type";
import { origin, point } from "../tool/point";
import { FieldShape, StripItem } from "../type";
import { RotationDef, StripeOutlineData, StripGroupData } from "./strip.type";
import { createOutline } from "./OutlineFactory";
import { buildStripShapes } from "./strip.helper";

export function createStrips(
  model: ChargeStrip,
  container: FieldShape
): StripItem {
  const rotation = computeRotationDef(container, model);
  const data = computeData(model, container, rotation);

  const outline = getStripOutlineData(model.outline);
  const stripPattern = createVerticalStripPath(
    data.stripWidth,
    data.stripLength,
    outline
  );

  return buildStripShapes(data, stripPattern);
}

function computeRotationDef(
  container: FieldShape,
  model: ChargeStrip
): RotationDef {
  const center = origin();

  if (model.direction == "pal") {
    return {
      angle: 0,
      center,
      direction: model.direction,
    };
  } else if (model.direction == "fasce") {
    return {
      angle: 90,
      center,
      direction: model.direction,
    };
  }

  const path = container.path;

  const angleRad = Math.atan2(path.bounds.height, path.bounds.width);
  const angleDeg = (angleRad * 180) / Math.PI;
  const angle = model.direction == "barre" ? 90 - angleDeg : angleDeg - 90;

  return { angle, center, direction: model.direction };
}

function createHorizontalStripPath(
  stripWidth: number,
  stripHeight: number,
  outline: StripeOutlineData
): paper.Path {
  const topPath = createOutline(
    stripWidth,
    stripHeight,
    outline.outline1,
    false
  );

  const bottomPath = createOutline(
    stripWidth,
    stripHeight,
    outline.outline2,
    outline.outline2Shifted
  );
  bottomPath.scale(1, -1, origin());
  bottomPath.reverse();
  bottomPath.translate(point(0, stripHeight));

  const path = new paper.Path();
  path.join(topPath);
  path.lineTo(bottomPath.firstCurve.point1);
  path.join(bottomPath);
  path.lineTo(topPath.firstCurve.point1);
  path.closePath();

  return path.reduce({});
}

function createVerticalStripPath(
  stripWidth: number,
  stripHeight: number,
  outline: StripeOutlineData
): paper.Path {
  const path = createHorizontalStripPath(stripHeight, stripWidth, outline);
  path.rotate(90, origin());
  path.translate(point(stripWidth, 0));
  return path;
}

function getStripOutlineData(model: StripOutline): StripeOutlineData {
  switch (model.type) {
    case "simple": {
      const info = getOutlineInfo(model.outline);
      const defaultReversed =
        info.type == "pattern" ? info.reverseShifted : false;
      const outline2Shifted = model.shifted != defaultReversed; // XOR
      // shifted => true if :
      // - model.shifted=true  && defaultReversed=false
      // - model.shifted=false && defaultReversed=true

      return {
        outline1: info,
        outline2: info,
        outline2Shifted,
      };
    }
    case "double":
      return {
        outline1: getOutlineInfo(model.outline1),
        outline2: getOutlineInfo(model.outline2),
        outline2Shifted: false,
      };
    case "straight":
    default:
      return {
        outline1: { type: "straight" },
        outline2: { type: "straight" },
        outline2Shifted: false,
      };
  }
}

function computeData(
  model: ChargeStrip,
  container: FieldShape,
  rotation: RotationDef
): StripGroupData {
  const containerClone = container.path.clone();
  containerClone.rotate(-rotation.angle, rotation.center);

  const bounds = containerClone.bounds;
  const totalSize = bounds.width;
  const origin = bounds.x;

  const minimalStripRatio = minimalGroupRatio(model);

  const groupWidth =
    totalSize / Math.max(minimalStripRatio, 2 * model.count + 1);
  const mainDelta = totalSize / (2 * model.count + 1);
  const stripByGroup = getStripByGroup(model);
  const stripWidth = groupWidth / (2 * stripByGroup - 1);
  const groupOrigin = origin + (mainDelta - groupWidth) / 2;

  return {
    fixedOrigin: bounds.y,
    groupCount: model.count,
    groupOrigin,
    mainDelta,
    rotation,
    root: container.root,
    stripByGroup,
    stripLength: bounds.height,
    stripWidth,
  };
}

function getStripByGroup(model: ChargeStrip): number {
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

function minimalGroupRatio(model: ChargeStrip): number {
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
