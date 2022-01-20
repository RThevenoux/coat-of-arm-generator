import { FillerModel } from "@/model/filler";
import { getColorText } from "@/service/ColorService";
import { _strip } from "./StripFillerTextGen";
import { _seme } from "./SemeFillerTextGen";
import { _pattern } from "./PatternFillerTextGen";
import { NominalGroup } from "../util";

export async function fillerToLabel(
  model: FillerModel,
  nominalGroup: NominalGroup
): Promise<string> {
  if (!model) {
    console.log("getFiller() : model is undefined");
    return "[?]";
  }
  switch (model.type) {
    case "plein":
      return getColorText(model.color);
    case "pattern":
      return _pattern(model, nominalGroup);
    case "seme":
      return _seme(model, nominalGroup);
    case "strip":
      return _strip(model, nominalGroup);
    case "invalid":
      return "[no-filler]";
    default:
      return "[!filler-error]";
  }
}
