import { FillerModel } from "./filler";
import { Direction } from "./misc";

export type ChargeModel = ChargeStrip | ChargeCross | ChargeSymbol;

// Strip

export type StripSize = "default" | "reduced" | "minimal" | "gemel" | "triplet";
export type OutlineId = string;
export type StripOutline =
  | StraightStripOutline
  | SimpleStripOutline
  | DoubleStripOutline
  | GemelPotentedStripOutline;

export interface StraightStripOutline {
  type: "straight";
}

export interface SimpleStripOutline {
  type: "simple";
  outline: OutlineId;
  shifted: boolean;
}

export interface DoubleStripOutline {
  type: "double";
  outline1?: OutlineId; // Fasce: Top side - Other: Left
  outline2?: OutlineId; // Fasce: Bottom side - Other: Right
}

export interface GemelPotentedStripOutline {
  type: "gemelPotented";
}

export interface ChargeStrip {
  type: "strip";
  direction: Direction;
  count: number;
  filler: FillerModel;
  size: StripSize;
  outline: StripOutline;
}

// Cross

export type CrossSize = "default" | "reduced" | "minimal";
export interface ChargeCross {
  type: "cross";
  count: 1;
  direction: Direction;
  filler: FillerModel;
  size: CrossSize;
}

// Symbol
export interface ChargeSymbol {
  type: "symbol";
  count: number;
  chargeId: string;
  filler: FillerModel;
}
