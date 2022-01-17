import { FillerModel } from "@/model/filler";
import { OutlineVisualInfo } from "@/service/visual.type";
import { SimpleShape } from "../type";

export type StripSideOutlineData = OutlineVisualInfo | "straight";

export interface StripOutlineData {
  outline1: StripSideOutlineData;
  outline2: StripSideOutlineData;
  outline2Shifted: boolean;
}

export interface StripData {
  root: SimpleShape;
  width: number;
  length: number;
  filler: FillerModel;
  outline: StripOutlineData;
}
