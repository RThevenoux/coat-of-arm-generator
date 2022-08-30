import { StripEditorCoreModel, StripEditorModel } from "./StripModel";
import { getDefaultOutlineId } from "@/service/OutlineService";
import { ChargeStrip, ChargeStripCore, StripOutline } from "@/model/charge";
import { STRAIGHT_OPTION_ID } from "../OutlineTool";
import { fillerToModel, initialFiller } from "../EditorTool";

export async function initialStripModel(): Promise<StripEditorModel> {
  return {
    ...(await initialStripCoreModel()),
    angle: "pal",
    companion: false,
    companionModel: await initialStripCoreModel(),
  };
}

export async function initialStripCoreModel(): Promise<StripEditorCoreModel> {
  return {
    count: 1,
    size: "default",
    filler: await initialFiller(),
    outlineType: "straight",
    simpleOutline: getDefaultOutlineId(),
    doubleOutline1: STRAIGHT_OPTION_ID,
    doubleOutline2: STRAIGHT_OPTION_ID,
    shifted: false,
  };
}

function stripOutlineToModel(model: StripEditorCoreModel): StripOutline {
  switch (model.outlineType) {
    case "simple":
      return {
        type: "simple",
        outlineId: model.simpleOutline,
        shifted: model.shifted,
      };
    case "double":
      if (model.doubleOutline1 == model.doubleOutline2) {
        if (model.doubleOutline1 == STRAIGHT_OPTION_ID) {
          return { type: "straight" };
        } else {
          return {
            type: "simple",
            outlineId: model.doubleOutline1,
            shifted: false,
          };
        }
      }
      return {
        type: "double",
        outlineId1:
          model.doubleOutline1 != STRAIGHT_OPTION_ID
            ? model.doubleOutline1
            : undefined,
        outlineId2:
          model.doubleOutline2 != STRAIGHT_OPTION_ID
            ? model.doubleOutline2
            : undefined,
      };
    case "gemel-potented":
      return { type: "gemelPotented" };
    case "straight":
    default:
      return { type: "straight" };
  }
}

export function stripToModel(strip: StripEditorModel): ChargeStrip {
  const companion: ChargeStripCore | undefined = strip.companion
    ? {
        count: strip.companionModel.count,
        filler: fillerToModel(strip.companionModel.filler),
        size: strip.companionModel.size,
        outline: stripOutlineToModel(strip.companionModel),
      }
    : undefined;

  return {
    type: "strip",
    direction: strip.angle,
    count: strip.count,
    filler: fillerToModel(strip.filler),
    size: strip.size,
    outline: stripOutlineToModel(strip),
    companion,
  };
}
