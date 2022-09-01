import { ChargeStripCore } from "@/model/charge";
import { FillerModel } from "@/model/filler";
import { getGemelPotentedVisualInfo } from "@/service/OutlineService";
import { StripData, StripOutlineData } from "../../shape/strip.type";
import { point } from "../../tool/point";
import { SimpleShape } from "../../type";
import { StripCompositionBuilder } from "./StripCompositionBuilder";
import { getStripOutlineData, straightOutline } from "./stripOutline.helper";
import { StripRotationHelper } from "./StripRotationHelper";
import { createSingleStrip } from "./stripSingle.factory";
import { StripComposition, StripItem } from "./type";

export function getStripByGroup(model: ChargeStripCore): number {
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

export function createGroup(
  model: ChargeStripCore,
  x0: number,
  groupWidth: number,
  rotation: StripRotationHelper,
  container: SimpleShape
): StripItem {
  const stripByGroup = getStripByGroup(model);
  if (stripByGroup == 2 && model.outline.type == "gemelPotented") {
    return createGemelPotentedGroup(
      x0,
      groupWidth,
      model.filler,
      rotation,
      container
    );
  } else {
    return createSimpleGroup(model, x0, groupWidth, rotation, container);
  }
}

function createSimpleGroup(
  model: ChargeStripCore,
  x0: number,
  groupWidth: number,
  rotation: StripRotationHelper,
  container: SimpleShape
): StripComposition {
  const outline = getStripOutlineData(model.outline);
  const stripByGroup = getStripByGroup(model);

  const filler = model.filler;
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
