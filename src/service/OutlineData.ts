export type OutlineVisualData = OutlinePattern | OutlineStraight;

export interface OutlinePattern {
  type: "pattern";
  patternData: "string";
}

export interface OutlineStraight {
  type: "straight";
}
