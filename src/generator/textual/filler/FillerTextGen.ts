import { FillerModel } from "@/model/filler";
import { getColorAdjective } from "@/service/ColorService";
import { addFillerStrip } from "./StripFillerTextGen";
import { addFillerSeme } from "./SemeFillerTextGen";
import { addFillerPattern } from "./PatternFillerTextGen";
import { NominalGroupBuilder } from "../util";
import { ColorId } from "@/model/misc";

export async function addFiller(
  model: FillerModel,
  builder: NominalGroupBuilder
): Promise<void> {
  if (!model) {
    console.log("getFiller() : model is undefined");
    builder.addText("[?]");
    return;
  }

  switch (model.type) {
    case "plein":
      _plain(model.color, builder);
      return;
    case "pattern":
      addFillerPattern(model, builder);
      return;
    case "seme":
      await addFillerSeme(model, builder);
      return;
    case "strip":
      addFillerStrip(model, builder);
      return;
  }

  // if model.type do not match valid values
  console.log("getFiller(): invalid filler type:" + model.type);
  builder.addText("[?]");
  return;
}

function _plain(colorId: ColorId, builder: NominalGroupBuilder): void {
  builder.addAdjective(getColorAdjective(colorId));
}
