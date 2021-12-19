import { Direction, OutlineId, StripSize } from "@/generator/model.type";
import { FillerEditorModel } from "./FillerEditorModel";

export interface StripEditorModel {
  angle: Direction;
  count: number;
  size: StripSize;
  filler: FillerEditorModel;
  outlineType: "straight" | "simple" | "double" | "gemel-potency";
  outline1: OutlineId;
  outline2: OutlineId;
  shifted: boolean;
}
