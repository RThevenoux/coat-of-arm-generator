import { Angle, ColorId } from "../generator/model.type";

export interface FillerEditorModel {
  type: "none" | "plein" | "seme" | "pattern" | "strip";
  pleinColor: ColorId;
  patternColor1: ColorId;
  patternColor2: ColorId;
  patternAngle: "defaut" | "bande" | "barre";
  patternName: string;
  semeChargeId: string;
  semeFieldColor: ColorId;
  semeChargeColor: ColorId;
  stripAngle: Angle;
  stripColor1: ColorId;
  stripColor2: ColorId;
  stripCount: number;
}
