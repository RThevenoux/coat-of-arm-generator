import { Outline } from "./visual/shape/Outline.type";

export type ColorId = string;

export type Direction = "fasce" | "barre" | "pal" | "bande";

//
// Field
//
export type FieldModel = PlainFieldModel | MultiFieldModel;

export interface PlainFieldModel {
  type: "plain";
  filler: FillerModel;
  charges: ChargeModel[];
  border?: BorderModel;
}

export interface MultiFieldModel {
  type: "partition";
  partitionType: string;
  fields: FieldModel[];
}

export interface BorderModel {
  filler: FillerModel;
}

//
// Filler
//
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
  angle?: "defaut" | "bande" | "barre"; // for 'fusele' only
}

//
// Charge
//
export type ChargeModel = ChargeStrip | ChargeCross | ChargeSymbol;

export type StripSize = "default" | "reduced" | "minimal" | "gemel" | "triplet";
export type CrossSize = "default" | "reduced" | "minimal";

export interface ChargeStrip {
  type: "strip";
  direction: Direction;
  count: number;
  filler: FillerModel;
  size: StripSize;
  outline1: Outline;// Fasce: Top side - Other: Left
  outline2: Outline;// Fasce: Bottom side - Other: Right
}

export interface ChargeCross {
  type: "cross";
  count: 1;
  direction: Direction;
  filler: FillerModel;
  size: CrossSize;
}

export interface ChargeSymbol {
  type: "symbol";
  count: number;
  chargeId: string;
  filler: FillerModel;
}
