import { OutlineId, StripSize } from "@/model/charge";
import { Direction } from "@/model/misc";
import { FillerEditorModel } from "../FillerEditorModel";

export type StripEditorModel = StripEditorCoreModel & {
  angle: Direction;
  companion: boolean;
  companionModel: StripEditorCoreModel;
};

export interface StripEditorCoreModel {
  count: number;
  size: StripSize;
  filler: FillerEditorModel;
  outlineType: "straight" | "simple" | "double" | "gemel-potented";
  simpleOutline: OutlineId;
  doubleOutline1: OutlineId;
  doubleOutline2: OutlineId;
  shifted: boolean;
}
