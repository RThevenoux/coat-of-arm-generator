import { TransformList } from "@/generator/visual/svg/svg.type";
import { ColorId } from "../model/misc";

export type PaletteData = Record<ColorId, string>;

export interface PatternVisualInfo {
  patternWidth: number;
  patternHeight: number;
  patternRepetition: number;
  path: string;
  copies?: TransformList[];
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
  tx: number;
  ty: number;
  repetition: number;
};
