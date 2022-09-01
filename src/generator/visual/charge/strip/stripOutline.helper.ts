import { StripOutline } from "@/model/charge";
import { getOutlineVisualInfo } from "@/service/OutlineService";
import { StripOutlineData, StripSideOutlineData } from "../../shape/strip.type";

export function getStripOutlineData(model: StripOutline): StripOutlineData {
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

export function straightOutline(): StripSideOutlineData {
  return "straight";
}
