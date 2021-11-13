import { ColorId } from "../model.type";

export interface FillerPatternParameters {
  backgroundColor: ColorId;
  patternColor: ColorId;
  shapeWidth: number;
  rotation?: number;
}

export type MyShape = FieldShape | StripShape | BorderShape | OtherShape;

export interface FieldShape {
  type: "field";
  path: paper.Path;
}
export interface StripShape {
  type: "strip";
  path: paper.Path;
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
