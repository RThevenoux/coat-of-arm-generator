import { Direction } from "../generator/model.type";
import { FillerEditorModel } from "./FillerEditorModel";

export interface SingleChargePickerModel {
  type: "strip" | "cross" | "symbol";
  filler: FillerEditorModel;
  strip: {
    angle: Direction;
    count: number;
  };
  cross: {
    angle: Direction;
  };
  symbol: {
    chargeId: string;
    count: number;
  };
}
