import { FillerModel } from "@/model/filler";
import { origin, point } from "../../tool/point";
import { FieldShape, SimpleShape } from "../../type";
import {
  StripData,
  StripOutlineData,
  StripSideOutlineData,
} from "../../shape/strip.type";
import {
  getGemelPotentedVisualInfo,
  getOutlineVisualInfo,
} from "@/service/OutlineService";
import { StripRotationHelper } from "./StripRotationHelper";
import { StripCompositionBuilder } from "./StripCompositionBuilder";
import { StripClones, StripComposition, StripItem, StripSingle } from "./type";
import { createSingleStrip } from "./stripSingle.factory";
import { StripClonesBuilder } from "./StripClonesBuilder";
import { ChargeStrip, StripOutline } from "@/model/charge";

export function convertToStripItem(
  model: ChargeStrip,
  container: FieldShape
): StripItem {
  const rotation = computeRotationDef(container, model);

  const stripByGroup = getStripByGroup(model);

  if (stripByGroup == 1) {
    if (model.count == 1) {
      return createSingle(model, rotation, container);
    } else {
      return createMultiple(model, rotation, container);
    }
  } else {
    if (stripByGroup == 2 && model.outline.type == "gemelPotented") {
      return createGemelPotented(model, rotation, container);
    } else {
      return createGrouped(model, stripByGroup, rotation, container);
    }
  }
}

function computeRotationDef(
  container: FieldShape,
  model: ChargeStrip
): StripRotationHelper {
  const direction = model.direction;

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

function createSingle(
  model: ChargeStrip,
  rotation: StripRotationHelper,
  container: SimpleShape
): StripSingle {
  const bounds = rotation.rotatedBounds;

  const minimalStripRatio = minimalGroupRatio(model);
  const stripWidth = bounds.width / minimalStripRatio;
  const xPosition = bounds.x + (bounds.width - stripWidth) / 2;
  const position = point(xPosition, bounds.y);

  const strip: StripData = {
    filler: model.filler,
    width: stripWidth,
    length: bounds.height,
    root: container.root,
    outline: getStripOutlineData(model.outline),
  };
  return createSingleStrip(position, strip, rotation);
}

function createMultiple(
  model: ChargeStrip,
  rotation: StripRotationHelper,
  container: SimpleShape
): StripClones {
  const bounds = rotation.rotatedBounds;
  const minimalStripRatio = minimalGroupRatio(model);
  // n part by strip + (n+1) empty part
  const partCount = 2 * model.count + 1;
  const partWidth = bounds.width / partCount;

  const stripWidth = bounds.width / Math.max(minimalStripRatio, partCount);

  // Create Strip pattern
  const strip = {
    length: bounds.height,
    width: stripWidth,
    filler: model.filler,
    outline: getStripOutlineData(model.outline),
    root: container.root,
  };
  const stripPattern = createSingleStrip(origin(), strip, rotation);

  const builder = new StripClonesBuilder(stripPattern, rotation);

  // Create clones
  // - first strip position = bounds.x + emptyfirstPart + 1/2(delta)
  const x0 = bounds.x + partWidth + (partWidth - stripWidth) / 2;
  for (let i = 0; i < model.count; i++) {
    const xPosition = x0 + 2 * i * partWidth;
    builder.addClone(point(xPosition, bounds.y));
  }

  return builder.build();
}

function createGrouped(
  model: ChargeStrip,
  stripByGroup: number,
  rotation: StripRotationHelper,
  container: SimpleShape
): StripItem {
  const bounds = rotation.rotatedBounds;
  const outline = getStripOutlineData(model.outline);
  const groupCount = model.count;

  const minimalStripRatio = minimalGroupRatio(model);
  // n part by group + (n+1) empty part
  const partCount = 2 * groupCount + 1;
  const partWidth = bounds.width / partCount;

  const groupWidth = bounds.width / Math.max(minimalStripRatio, partCount);
  const x0 = bounds.x + partWidth + (partWidth - groupWidth) / 2;

  // Return a single group
  if (groupCount == 1) {
    return createGroup(
      x0,
      groupWidth,
      stripByGroup,
      outline,
      model.filler,
      rotation,
      container
    );
  }

  // Create stripPattern and clone it
  const stripPattern = createGroup(
    0,
    groupWidth,
    stripByGroup,
    outline,
    model.filler,
    rotation,
    container
  );
  const builder = new StripClonesBuilder(stripPattern, rotation);

  // Add clone
  for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
    const xPosition = x0 + 2 * groupIndex * partWidth;
    builder.addClone(point(xPosition, bounds.y));
  }
  return builder.build();
}

function createGroup(
  x0: number,
  groupWidth: number,
  stripByGroup: number,
  outline: StripOutlineData,
  filler: FillerModel,
  rotation: StripRotationHelper,
  container: SimpleShape
): StripComposition {
  const bounds = rotation.rotatedBounds;

  const stripWidth = groupWidth / (2 * stripByGroup - 1);
  const strip = {
    width: stripWidth,
    length: bounds.height,
    root: container.root,
    filler,
    outline,
  };

  const builder = new StripCompositionBuilder();
  for (let stripIndex = 0; stripIndex < stripByGroup; stripIndex++) {
    const xPosition = x0 + stripWidth * 2 * stripIndex;
    const position = point(xPosition, bounds.y);
    const singleStrip = createSingleStrip(position, strip, rotation);
    builder.add(singleStrip);
  }

  return builder.build();
}

function createGemelPotented(
  model: ChargeStrip,
  rotation: StripRotationHelper,
  container: SimpleShape
) {
  const bounds = rotation.rotatedBounds;

  const groupCount = model.count;

  // n part by group + (n+1) empty part
  const partCount = 2 * groupCount + 1;
  const partWidth = bounds.width / partCount;

  const x0 = bounds.x + partWidth;

  // Return a single group
  if (groupCount == 1) {
    return createGemelPotentedGroup(
      x0,
      partWidth,
      model.filler,
      rotation,
      container
    );
  }

  // Create stripPattern and clone it
  const stripPattern = createGemelPotentedGroup(
    0,
    partWidth,
    model.filler,
    rotation,
    container
  );
  const builder = new StripClonesBuilder(stripPattern, rotation);

  // Add clone
  for (let groupIndex = 0; groupIndex < groupCount; groupIndex++) {
    const xPosition = x0 + 2 * groupIndex * partWidth;
    builder.addClone(point(xPosition, bounds.y));
  }
  return builder.build();
}

function createGemelPotentedGroup(
  x0: number,
  groupWidth: number,
  filler: FillerModel,
  rotation: StripRotationHelper,
  container: SimpleShape
): StripComposition {
  const builder = new StripCompositionBuilder();

  const bounds = rotation.rotatedBounds;

  const stripWidth = groupWidth / 7;

  const outlineA: StripOutlineData = {
    outline1: getGemelPotentedVisualInfo(),
    outline2: straightOutline(),
    outline2Shifted: false,
  };
  const stripAData: StripData = {
    width: stripWidth,
    length: bounds.height,
    root: container.root,
    filler,
    outline: outlineA,
  };
  const positionA = point(x0, bounds.y);
  const stripA = createSingleStrip(positionA, stripAData, rotation);
  builder.add(stripA);

  const outlineB: StripOutlineData = {
    outline1: straightOutline(),
    outline2: getGemelPotentedVisualInfo(),
    outline2Shifted: true,
  };
  const stripBData: StripData = {
    width: stripWidth,
    length: bounds.height,
    root: container.root,
    filler,
    outline: outlineB,
  };
  const positionB = point(x0 + stripWidth * 6, bounds.y);
  const stripB = createSingleStrip(positionB, stripBData, rotation);
  builder.add(stripB);

  return builder.build();
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
      const info = getOutlineVisualInfo(model.outlineId);
      const outline2Shifted = model.shifted != info.reverseShifted; // XOR
      // shifted => true if :
      // - model.shifted=true  && info.reverseShifted=false
      // - model.shifted=false && info.reverseShifted=true

      return {
        outline1: info,
        outline2: info,
        outline2Shifted,
      };
    }
    case "double":
      return {
        outline1: model.outlineId1
          ? getOutlineVisualInfo(model.outlineId1)
          : straightOutline(),
        outline2: model.outlineId2
          ? getOutlineVisualInfo(model.outlineId2)
          : straightOutline(),
        outline2Shifted: false,
      };
    case "straight":
    default:
      return {
        outline1: straightOutline(),
        outline2: straightOutline(),
        outline2Shifted: false,
      };
  }
}

function straightOutline(): StripSideOutlineData {
  return "straight";
}
