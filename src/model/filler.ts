import { ColorId, Direction } from "./misc";

export type FillerModel =
  | FillerPlein
  | FillerSeme
  | FillerStrip
  | FillerPattern
  | { type: "invalid" };

export interface FillerPlein {
  type: "plein";
  color: ColorId;
}

export interface FillerSeme {
  type: "seme";
  chargeId: string;
  chargeColor: ColorId;
  fieldColor: ColorId;
}

export interface FillerStrip {
  type: "strip";
  direction: Direction;
  count: number;
  color1: ColorId;
  color2: ColorId;
}

export interface FillerPattern {
  type: "pattern";
  patternName: string;
  color1: ColorId;
  color2: ColorId;
  direction?: "bande" | "barre"; // for 'fusele' only
}
