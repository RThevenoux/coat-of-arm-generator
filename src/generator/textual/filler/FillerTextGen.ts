import { FillerModel } from "@/model/filler";
import { getColorText } from "@/service/ColorService";
import { _strip } from "./StripFillerTextGen";
import { _seme } from "./SemeFillerTextGen";
import { _pattern } from "./PatternFillerTextGen";

export async function fillerToLabel(
  model: FillerModel,
  masculine: boolean,
  plural: boolean
): Promise<string> {
  if (!model) {
    console.log("getFiller() : model is undefined");
    return "[?]";
  }
  switch (model.type) {
    case "plein":
      return getColorText(model.color);
    case "pattern":
      return _pattern(model, masculine, plural);
    case "seme":
      return _seme(model, masculine, plural);
    case "strip":
      return _strip(model, masculine, plural);
    case "invalid":
      return "[no-filler]";
    default:
      return "[!filler-error]";
  }
}
