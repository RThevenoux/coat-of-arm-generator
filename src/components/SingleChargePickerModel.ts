import { CrossSize } from "@/model/charge";
import { FillerEditorModel } from "./FillerEditorModel";
import { StripEditorModel } from "./strip/StripModel";

export interface SingleChargePickerModel {
  type: "strip" | "cross" | "symbol";
  strip: StripEditorModel;
  cross: {
    filler: FillerEditorModel;
    diagonal: "false" | "true";
    size: CrossSize;
  };
  symbol: {
    filler: FillerEditorModel;
    chargeId: string;
    count: number;
  };
}
