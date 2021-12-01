export interface SvgStyle {
  fillerId?: string;
  color?: string;
  strokeWidth?: number;
}

export interface PatternTransform {
  x: number;
  y: number;
  transformList: TransformList;
}

export type TransformList = Transform[];
export type Transform = Translate | Scale | Rotate;

export interface Translate {
  type: "translate";
  tx: number;
  ty: number;
}

export interface Scale {
  type: "scale";
  sx: number;
  sy?: number;
}

export interface Rotate {
  type: "rotate";
  angle: number; //in degre, clock-wise
}
