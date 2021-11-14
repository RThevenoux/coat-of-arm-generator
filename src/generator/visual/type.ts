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
  angle: number /*in radian*/ | "pal" | "fasce";
  width: number;
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
