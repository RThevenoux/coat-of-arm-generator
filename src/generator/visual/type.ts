import { Direction } from "../model.type";

export interface SymbolShape {
  type: "symbol";
  item: paper.Item;
}

export type SimpleShape = FieldShape | StripShape | BorderShape | OtherShape;

export interface FieldShape {
  type: "field";
  path: paper.Path;
}
export interface StripShape {
  type: "strip";
  path: paper.Path;
  direction: Direction;
  angle: number; // in radian "pal" = PI/2, "fasce" = 0;
  width: number;
  patternAnchor: paper.Point; // This point can be use to align pattern. The point may be outside of the path, after the strip is clipped by its container
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
