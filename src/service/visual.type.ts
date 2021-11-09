import { ColorId } from "../generator/model.type";

export type Palette = Record<ColorId, string>;

export interface PatternVisualInfo {
  patternWidth: number;
  patternHeight: number;
  patternRepetition: number;
  path: string;
  copies?: string[];
}

export interface PartitionVisualInfo {
  paths: string[];
  width: number;
  height: number;
}

export type ChargeVisualInfo = {
  id: string;
  width: number;
  height: number;
  seme: {
    tx: number;
    ty: number;
    repetition: number;
  };
  xml: string;
};
