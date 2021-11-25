import { Direction } from "../model.type";

export interface SymbolShape {
  type: "symbol";
  item: paper.Item;
}

export type SimpleShape =
  | FieldShape
  | StripShape
  | BorderShape
  | CrossShape
  | OtherShape;

export interface FieldShape {
  type: "field";
  path: paper.Path;
}
export interface StripShape {
  type: "strip";
  path: paper.Path;
  stripDirection: Direction;
  stripAngle: number; // in degre "pal" == 0, "barre" ~= 45, "bande" ~= -45
  stripWidth: number;
  patternAnchor: paper.Point; // This point can be use to align pattern. The point may be outside of the path, after the strip is clipped by its container
}

export interface CrossShape {
  type: "cross";
  path: paper.Path;
  stripWidth: number;
  patternAnchor: paper.Point; // This point can be use to align pattern. Top-Left of center square.
}

export interface BorderShape {
  type: "border";
  path: paper.PathItem;
  inner: FieldShape;
}

export interface OtherShape {
  type: "other";
  path: paper.PathItem;
}
