import { OutlineVisualData } from "@/service/OutlineData";
import * as paper from "paper";

export interface RotationDef {
  angle: number;
  center: paper.Point;
}

export interface StripeOutlineData {
  outline1: OutlineVisualData;
  outline2: OutlineVisualData;
  outline2Shifted: boolean;
}
