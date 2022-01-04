import { Direction } from "@/generator/model.type";
import { OutlineVisualData } from "@/service/OutlineData";
import * as paper from "paper";
import { SimpleShape } from "../type";

export interface RotationDef {
  angle: number;
  center: paper.Point;
  direction: Direction;
}

export interface StripeOutlineData {
  outline1: OutlineVisualData;
  outline2: OutlineVisualData;
  outline2Shifted: boolean;
}

export interface StripGroupData {
  fixedOrigin: number;
  groupOrigin: number;
  groupCount: number;
  mainDelta: number;
  rotation: RotationDef;
  root: SimpleShape;
  stripByGroup: number;
  stripLength: number;
  stripWidth: number;
}
