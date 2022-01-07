import { Direction, FillerModel } from "@/generator/model.type";
import { OutlineVisualData } from "@/service/OutlineData";
import * as paper from "paper";
import { SimpleShape } from "../type";

export interface RotationDef {
  angle: number;
  center: paper.Point;
  direction: Direction;
}

export interface StripOutlineData {
  outline1: OutlineVisualData;
  outline2: OutlineVisualData;
  outline2Shifted: boolean;
}

export interface StripData {
  root: SimpleShape;
  stripWidth: number;
  stripLength: number;
  filler: FillerModel;
  outline: StripOutlineData;
}
