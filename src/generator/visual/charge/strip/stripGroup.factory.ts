import { ChargeStripCore } from "@/model/charge";
import { FillerModel } from "@/model/filler";
import { getGemelPotentedVisualInfo } from "@/service/OutlineService";
import { StripOutlineData } from "../../shape/strip.type";
import { StripCompositionBuilder } from "./StripCompositionBuilder";
import { StripHelper } from "./StripHelper";
import { getStripOutlineData, straightOutline } from "./stripOutline.helper";
import { StripItem } from "./type";

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
  helper: StripHelper
): StripItem {
  const stripByGroup = getStripByGroup(model);
  if (stripByGroup == 2 && model.outline.type == "gemelPotented") {
    return createGemelPotentedGroup(x0, groupWidth, model.filler, helper);
  } else {
    return createSimpleGroup(model, x0, groupWidth, helper);
  }
}

function createSimpleGroup(
  model: ChargeStripCore,
  x0: number,
  groupWidth: number,
  helper: StripHelper
): StripItem {
  const stripByGroup = getStripByGroup(model);
  const stripWidth = groupWidth / (2 * stripByGroup - 1);

  const outline = getStripOutlineData(model.outline);
  const filler = model.filler;

  const builder = new StripCompositionBuilder();
  for (let stripIndex = 0; stripIndex < stripByGroup; stripIndex++) {
    const xPosition = x0 + stripWidth * 2 * stripIndex;
    const singleStrip = helper.createSingleStrip(
      xPosition,
      stripWidth,
      filler,
      outline
    );
    builder.add(singleStrip);
  }

  return builder.build();
}

function createGemelPotentedGroup(
  x0: number,
  groupWidth: number,
  filler: FillerModel,
  helper: StripHelper
): StripItem {
  const builder = new StripCompositionBuilder();

  const stripWidth = groupWidth / 7;

  const outlineA: StripOutlineData = {
    outline1: getGemelPotentedVisualInfo(),
    outline2: straightOutline(),
    outline2Shifted: false,
  };
  const stripA = helper.createSingleStrip(x0, stripWidth, filler, outlineA);
  builder.add(stripA);

  const outlineB: StripOutlineData = {
    outline1: straightOutline(),
    outline2: getGemelPotentedVisualInfo(),
    outline2Shifted: true,
  };
  const stripB = helper.createSingleStrip(
    x0 + stripWidth * 6,
    stripWidth,
    filler,
    outlineB
  );
  builder.add(stripB);

  return builder.build();
}
