import { Angle } from "../generator/model.type";
import { FillerEditorModel } from "./FillerEditorModel";

export interface SingleChargePickerModel {
  type: "strip" | "cross" | "symbol";
  strip: {
    angle: Angle;
    count: number;
    filler: FillerEditorModel;
  };
  cross: {
    angle: Angle;
    filler: FillerEditorModel;
  };
  symbol: {
    chargeId: string;
    count: number;
    filler: FillerEditorModel;
  };
}
