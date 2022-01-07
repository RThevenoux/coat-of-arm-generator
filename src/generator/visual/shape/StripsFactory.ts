import * as paper from "paper";
import { ChargeStrip, StripOutline } from "../../model.type";
import { origin, point } from "../tool/point";
import {
  FieldShape,
  SimpleShape,
  StripClones,
  StripComposition,
  StripItem,
  StripSingle,
} from "../type";
import { RotationDef, StripOutlineData } from "./strip.type";
import { createSingleStrip, createStripClones } from "./strip.helper";
import { getOutlineInfo } from "@/service/OutlineService";

export function createStrips(
  model: ChargeStrip,
  container: FieldShape
): StripItem {
  const rotation = computeRotationDef(container, model);

  const containerClone = container.path.clone();
  containerClone.rotate(-rotation.angle, rotation.center);
  const bounds = containerClone.bounds;

  const stripByGroup = getStripByGroup(model);

  if (stripByGroup == 1 && model.count == 1) {
    return getSingleStripData(model, bounds, rotation, container);
  }
  if (stripByGroup == 1) {
    return getSimpleCloneData(model, bounds, rotation, container);
  }

  //
  // Gemelles & tierces
  //
  return getGroupCloneData(model, stripByGroup, bounds, rotation, container);
}

function computeRotationDef(
  container: FieldShape,
  model: ChargeStrip
): RotationDef {
  const center = origin();
  const direction = model.direction;

  if (direction == "pal") {
    const angle = 0;
    return { angle, center, direction };
  } else if (direction == "fasce") {
    const angle = 90;
    return { angle, center, direction };
  }

  const bounds = container.path.bounds;

  const angleRad = Math.atan2(bounds.height, bounds.width);
  const angleDeg = (angleRad * 180) / Math.PI;
  const angle = direction == "barre" ? 90 - angleDeg : angleDeg - 90;

  return { angle, center, direction };
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

function getSingleStripData(
  model: ChargeStrip,
  bounds: paper.Rectangle,
  rotation: RotationDef,
  container: SimpleShape
): StripSingle {
  const minimalStripRatio = minimalGroupRatio(model);
  const stripWidth = bounds.width / minimalStripRatio;
  const xPosition = bounds.x + (bounds.width - stripWidth) / 2;
  const position = point(xPosition, bounds.y);

  const outline = getStripOutlineData(model.outline);

  const strip = {
    filler: model.filler,
    stripWidth: stripWidth,
    stripLength: bounds.height,
    root: container.root,
    outline,
  };
  return createSingleStrip(position, strip, rotation);
}

function getSimpleCloneData(
  model: ChargeStrip,
  bounds: paper.Rectangle,
  rotation: RotationDef,
  container: SimpleShape
): StripClones {
  const minimalStripRatio = minimalGroupRatio(model);
  // n part by strip + (n+1) empty part
  const partCount = 2 * model.count + 1;
  const partWidth = bounds.width / partCount;

  const stripWidth = bounds.width / Math.max(minimalStripRatio, partCount);

  // First strip position
  // bounds.x + emptyfirstPart + 1/2(delta)
  const x0 = bounds.x + partWidth + (partWidth - stripWidth) / 2;

  const positions: paper.Point[] = [];
  for (let i = 0; i < model.count; i++) {
    const xPosition = x0 + 2 * i * partWidth;
    positions.push(point(xPosition, bounds.y));
  }

  const outline = getStripOutlineData(model.outline);

  const clone = {
    root: container.root,
    stripLength: bounds.height,
    stripWidth,
    filler: model.filler,
    outline,
  };

  const clonePattern = createSingleStrip(origin(), clone, rotation);
  return createStripClones(positions, clonePattern, rotation);
}

function getGroupCloneData(
  model: ChargeStrip,
  stripByGroup: number,
  bounds: paper.Rectangle,
  rotation: RotationDef,
  container: SimpleShape
): StripClones {
  const groupCount = model.count;

  const minimalStripRatio = minimalGroupRatio(model);
  // n part by group + (n+1) empty part
  const partCount = 2 * groupCount + 1;
  const partWidth = bounds.width / partCount;

  const groupWidth = bounds.width / Math.max(minimalStripRatio, partCount);

  const stripWidth = groupWidth / (2 * stripByGroup - 1);
  const x0 = bounds.x + (partWidth - groupWidth) / 2;

  const stripPositions: paper.Point[] = [];
  for (let stripIndex = 0; stripIndex < stripByGroup; stripIndex++) {
    const xPosition = stripWidth * 2 * stripIndex;
    stripPositions.push(point(xPosition, 0));
  }

  const groupPositions: paper.Point[] = [];
  for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
    const xPosition = x0 + (2 * groupIndex + 1) * partWidth;
    groupPositions.push(point(xPosition, bounds.y));
  }

  const groupBounds = new paper.Rectangle(0, 0, groupWidth, bounds.height);

  const outline = getStripOutlineData(model.outline);

  const group = {
    positions: stripPositions,
    strip: {
      stripWidth,
      stripLength: bounds.height,
      root: container.root,
      filler: model.filler,
      outline,
    },
  };

  const items: StripItem[] = [];
  for (const position of group.positions) {
    const singleStrip = createSingleStrip(position, group.strip, rotation);
    items.push(singleStrip);
  }
  const clonePattern: StripComposition = {
    type: "stripComposition",
    stripItems: items,
    __bounds: groupBounds,
  };

  return createStripClones(groupPositions, clonePattern, rotation);
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

function getStripOutlineData(model: StripOutline): StripOutlineData {
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
