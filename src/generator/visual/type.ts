import { ColorId } from "../model.type";

export interface FillerPatternParameters {
  backgroundColor: ColorId;
  patternColor: ColorId;
  shapeWidth: number;
  rotation?: number;
}
