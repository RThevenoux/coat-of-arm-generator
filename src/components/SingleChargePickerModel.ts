import { Outline } from "@/generator/visual/shape/Outline.type";
import { CrossSize, Direction, StripSize } from "../generator/model.type";
import { FillerEditorModel } from "./FillerEditorModel";

export interface SingleChargePickerModel {
  type: "strip" | "cross" | "symbol";
  filler: FillerEditorModel;
  strip: {
    angle: Direction;
    count: number;
    size: StripSize;
    outline1: Outline;
    outline2: Outline;
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
