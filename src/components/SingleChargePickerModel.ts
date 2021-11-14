import { Direction } from "../generator/model.type";
import { FillerEditorModel } from "./FillerEditorModel";

export interface SingleChargePickerModel {
  type: "strip" | "cross" | "symbol";
  strip: {
    angle: Direction;
    count: number;
    filler: FillerEditorModel;
  };
  cross: {
    angle: Direction;
    filler: FillerEditorModel;
  };
  symbol: {
    chargeId: string;
    count: number;
    filler: FillerEditorModel;
  };
}
