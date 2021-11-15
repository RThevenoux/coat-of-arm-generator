import { ColorId } from "../generator/model.type";

export type PaletteData = Record<ColorId, string>;

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
  xml: string;
};

export type SemeVisualInfo = {
  charge: ChargeVisualInfo;
  width: number;
  height: number;
  repetition: number;
  copies: string[];
};
