import { FillerModel } from "@/generator/model.type";
import { OutlineVisualData } from "@/service/OutlineData";
import { SimpleShape } from "../type";

export interface StripOutlineData {
  outline1: OutlineVisualData;
  outline2: OutlineVisualData;
  outline2Shifted: boolean;
}

export interface StripData {
  root: SimpleShape;
  width: number;
  length: number;
  filler: FillerModel;
  outline: StripOutlineData;
}
