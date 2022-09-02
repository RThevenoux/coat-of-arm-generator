import { FieldShape } from "../../type";
import { StripCompositionBuilder } from "./StripCompositionBuilder";
import { StripItem } from "./type";
import { ChargeStrip, ChargeStripCore } from "@/model/charge";
import { createGroup, getStripByGroup } from "./stripGroup.factory";
import { getStripOutlineData } from "./stripOutline.helper";
import { StripHelper } from "./StripHelper";

export function convertToStripItem(
  model: ChargeStrip,
  container: FieldShape
): StripItem {
  const helper = new StripHelper(container, model.direction);

  const pattern = createClonePattern(model, helper);
  const patternWidth = pattern.__bounds.width;

  const count = model.count;
  const spacing = (helper.width() - patternWidth * count) / (count + 1);

  // Create clones
  const cloneBuilder = helper.cloneBuilder(pattern);
  const x0 = spacing;
  for (let i = 0; i < count; i++) {
    const xPosition = x0 + (spacing + patternWidth) * i;
    cloneBuilder.addClone(xPosition);
  }

  return cloneBuilder.build();
}

function createClonePattern(
  model: ChargeStrip,
  helper: StripHelper
): StripItem {
  const bounds = helper.rotation.rotatedBounds;
  const stripByGroup = getStripByGroup(model);

  // n part by strip + (n+1) empty part
  const partCount = 2 * model.count + 1;
  const partWidth = bounds.width / partCount;

  let centerStrips;
  if (stripByGroup > 1) {
    centerStrips = createGroup(model, 0, partWidth, helper);
  } else {
    const minimalStripRatio = getMinimalGroupRatio(model);
    const stripWidth = bounds.width / Math.max(minimalStripRatio, partCount);
    const outline = getStripOutlineData(model.outline);
    centerStrips = helper.createSingleStrip(
      0,
      stripWidth,
      model.filler,
      outline
    );
  }

  if (!model.companion) {
    return centerStrips;
  }

  const companion = model.companion;

  const centerWidth = centerStrips.__bounds.width;

  const space = partWidth / 12; // magic number

  const companionRatio = getMinimalGroupRatio(companion);
  const groupSize = partWidth / companionRatio;

  const leftCompanionStart = -space - groupSize;
  const leftStrips = createGroup(
    companion,
    leftCompanionStart,
    groupSize,
    helper
  );

  const rightCompanionStart = centerWidth + space;
  const rigthStrips = createGroup(
    companion,
    rightCompanionStart,
    groupSize,
    helper
  );

  const builder = new StripCompositionBuilder();
  builder.add(leftStrips);
  builder.add(centerStrips);
  builder.add(rigthStrips);

  return builder.build();
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
