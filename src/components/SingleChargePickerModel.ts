import { CrossSize, Direction } from "../generator/model.type";
import { FillerEditorModel } from "./FillerEditorModel";
import { StripEditorModel } from "./StripModel";

export interface SingleChargePickerModel {
  type: "strip" | "cross" | "symbol";
  strip: StripEditorModel;
  cross: {
    filler: FillerEditorModel;
    angle: Direction;
    size: CrossSize;
  };
  symbol: {
    filler: FillerEditorModel;
    chargeId: string;
    count: number;
  };
}
