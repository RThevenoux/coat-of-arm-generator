import { origin, point } from "../../tool/point";
import { FieldShape, SimpleShape } from "../../type";
import { StripRotationHelper } from "./StripRotationHelper";
import { StripCompositionBuilder } from "./StripCompositionBuilder";
import { StripItem } from "./type";
import { createSingleStrip } from "./stripSingle.factory";
import { StripClonesBuilder } from "./StripClonesBuilder";
import { ChargeStrip, ChargeStripCore } from "@/model/charge";
import { createGroup, getStripByGroup } from "./stripGroup.factory";
import { getStripOutlineData } from "./stripOutline.helper";

export function convertToStripItem(
  model: ChargeStrip,
  container: FieldShape
): StripItem {
  const rotation = computeRotationDef(container, model);

  const { pattern, patternWidth } = createClonePattern(
    model,
    rotation,
    container
  );

  const bounds = rotation.rotatedBounds;
  const count = model.count;
  const spacing = (bounds.width - patternWidth * count) / (count + 1);

  // Create clones
  const builder = new StripClonesBuilder(pattern, rotation);

  const x0 = bounds.x + spacing;
  for (let i = 0; i < count; i++) {
    const xPosition = x0 + (spacing + patternWidth) * i;
    builder.addClone(point(xPosition, bounds.y));
  }

  const s = builder.build();
  console.log("stripItem", s);
  return s;
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

function createClonePattern(
  model: ChargeStrip,
  rotation: StripRotationHelper,
  container: SimpleShape
): { pattern: StripItem; patternWidth: number } {
  const bounds = rotation.rotatedBounds;
  const stripByGroup = getStripByGroup(model);

  // n part by strip + (n+1) empty part
  const partCount = 2 * model.count + 1;
  const partWidth = bounds.width / partCount;

  if (stripByGroup > 1) {
    const pattern = createGroup(model, 0, partWidth, rotation, container);
    return { pattern, patternWidth: partWidth };
  } else {
    const minimalStripRatio = getMinimalGroupRatio(model);
    const stripWidth = bounds.width / Math.max(minimalStripRatio, partCount);
    const strip = {
      length: bounds.height,
      width: stripWidth,
      filler: model.filler,
      outline: getStripOutlineData(model.outline),
      root: container.root,
    };

    // If NO companion, return single strip
    if (!model.companion) {
      const pattern = createSingleStrip(origin(), strip, rotation);
      return { pattern, patternWidth: stripWidth };
    }

    // Else, compose the single strip with left&rigth companion
    const companion = model.companion;
    const builder = new StripCompositionBuilder();
    const mainStrip = createSingleStrip(point(0, bounds.y), strip, rotation);
    builder.add(mainStrip);

    const space = partWidth / 12; // magic number

    const companionRatio = getMinimalGroupRatio(companion);
    const groupSize = partWidth / companionRatio;

    const leftCompanionStart = -space - groupSize;
    const rightCompanionStart = stripWidth + space;

    const left = createGroup(
      companion,
      leftCompanionStart,
      groupSize,
      rotation,
      container
    );
    builder.add(left);

    const rigth = createGroup(
      companion,
      rightCompanionStart,
      groupSize,
      rotation,
      container
    );

    builder.add(rigth);
    const pattern = builder.build();
    const patternWidth = stripWidth + 2 * (space + groupSize);
    return { pattern, patternWidth };
  }
}

function getMinimalGroupRatio(model: ChargeStripCore): number {
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
