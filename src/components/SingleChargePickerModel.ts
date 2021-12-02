import { CrossSize, Direction, StripSize } from "../generator/model.type";
import { FillerEditorModel } from "./FillerEditorModel";

export interface SingleChargePickerModel {
  type: "strip" | "cross" | "symbol";
  filler: FillerEditorModel;
  strip: {
    angle: Direction;
    count: number;
    size: StripSize;
  };
  cross: {
    angle: Direction;
    size: CrossSize;
  };
  symbol: {
    chargeId: string;
    count: number;
  };
}
