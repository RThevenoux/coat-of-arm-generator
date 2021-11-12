import { Angle, ColorId } from "../generator/model.type";

export interface FillerEditorModel {
  type: "none" | "plein" | "seme" | "pattern" | "strip";
  color1:ColorId;
  color2:ColorId;
  patternAngle: "defaut" | "bande" | "barre";
  patternName: string;
  semeChargeId: string;
  stripAngle: Angle;
  stripCount: number;
}
