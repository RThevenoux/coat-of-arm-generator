import { Direction, ColorId } from "../model/misc";

export interface FillerEditorModel {
  type: "none" | "plein" | "seme" | "pattern" | "strip";
  color1: ColorId;
  color2: ColorId;
  patternAngle: "defaut" | "bande" | "barre";
  patternName: string;
  semeChargeId: string;
  stripAngle: Direction;
  stripCount: number;
}
