import { OutlineId, StripSize } from "@/model/charge";
import { Direction } from "@/model/misc";
import { FillerEditorModel } from "../FillerEditorModel";

export type StripEditorModel = StripEditorCoreModel & {
  angle: Direction;
  count: number;
  companion: { present: boolean } & StripEditorCoreModel;
};

export interface StripEditorCoreModel {
  size: StripSize;
  filler: FillerEditorModel;
  outlineType: "straight" | "simple" | "double" | "gemel-potented";
  simpleOutline: OutlineId;
  doubleOutline1: OutlineId;
  doubleOutline2: OutlineId;
  shifted: boolean;
}
