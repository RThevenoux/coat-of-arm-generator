export type OutlineVisualData = OutlinePattern | OutlineStraight;

export interface OutlinePattern {
  type: "pattern";
  patternData: "string";
  scale: number;
  reverseShifted: boolean;
}

export interface OutlineStraight {
  type: "straight";
}
