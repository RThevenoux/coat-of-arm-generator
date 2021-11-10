import { ChargeVisualInfo } from "@/service/visual.type";
import { ColorId } from "../model.type";

export interface FillerPatternParameters {
  backgroundColor: ColorId;
  patternColor: ColorId;
  shapeWidth: number;
  rotation?: number;
}

export interface FillerSemeParameters {
  charge: ChargeVisualInfo;
  color: ColorId;
  seme: {
    width: number;
    height: number;
    repetition: number;
    copies: string[];
  };
  fieldColor: ColorId;
}
