import { ChargeTextualInfo } from "@/service/textual.type";

export interface ChargeData {
  id: string;
  default?: boolean;
  visual: ChargeVisualData;
  blazon: ChargeTextualInfo;
}

export interface ChargeVisualData {
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
