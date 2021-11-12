import { ChargeTextualInfo } from "@/service/textual.type";

export interface ChargeData {
  id: string;
  default?: boolean;
  visual: ChargeVisualData;
  blazon: ChargeTextualInfo;
}

export type ChargeVisualData = SVGVisualData | CalculateVisualData;

export interface CalculateVisualData {
  type: "calculate";
}

export interface SVGVisualData {
  type: "svg";
  file?: string;
  xml?: string;
  width: number;
  height: number;
  seme: SemeData;
}

export interface SemeData {
  tx: number;
  ty: number;
  repetition: number;
}
