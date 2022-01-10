import { OutlineId, StripSize } from "@/model/charge";
import { Direction } from "@/model/misc";
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
