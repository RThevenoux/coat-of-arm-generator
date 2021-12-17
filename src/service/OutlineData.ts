export type OutlineVisualData = OutlinePattern | OutlineStraight;

export interface OutlinePattern {
  type: "pattern";
  patternData: "string";
  scale: number;
}

export interface OutlineStraight {
  type: "straight";
}
