export type ColorId = string;

export type Angle = "0" | "45" | "90" | "135";

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
  angle: Angle;
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

export interface ChargeStrip {
  type: "strip";
  angle: Angle;
  count: number;
  filler: FillerModel;
}

export interface ChargeCross {
  type: "cross";
  count: 1;
  angle: Angle;
  filler: FillerModel;
}

export interface ChargeSymbol {
  type: "symbol";
  count: number;
  chargeId: string;
  filler: FillerModel;
}
