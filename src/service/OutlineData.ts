export interface OutlineVisualData {
  patternData: string;
  scale: number;
  reverseShifted: boolean;
}

export interface OutlineTextualData {
  masculine: {
    one: string;
    plural: string;
  };
  feminine: {
    one: string;
    plural: string;
  };
}
