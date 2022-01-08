import { Direction } from "../model.type";

export interface MobileChargeShape {
  type: "mobileCharge";
  item: paper.Item;
  root: SimpleShape;
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
  root: SimpleShape;
  clipPathId?: string;
}

export interface StripShape {
  type: "strip";
  path: paper.PathItem;
  root: SimpleShape;
  stripDirection: Direction;
  stripAngle: number; // in degre "pal" == 0, "barre" ~= 45, "bande" ~= -45
  stripWidth: number;
  patternAnchor: paper.Point; // This point can be use to align pattern. The point may be outside of the path, after the strip is clipped by its container
}

export interface CrossShape {
  type: "cross";
  path: paper.Path;
  root: SimpleShape;
  stripWidth: number;
  patternAnchor: paper.Point; // This point can be use to align pattern. Top-Left of center square.
}

export interface BorderShape {
  type: "border";
  path: paper.PathItem;
  root: SimpleShape;
  inner: FieldShape;
}

export interface OtherShape {
  type: "other";
  path: paper.PathItem;
  root: SimpleShape;
}

export class EscutcheonShape implements FieldShape {
  readonly type = "field";

  constructor(readonly path: paper.Path) {}

  get root(): EscutcheonShape {
    return this;
  }
}
