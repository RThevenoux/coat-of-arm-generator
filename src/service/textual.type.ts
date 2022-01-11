export type LabelInfo = SimpleLabelInfo | SwitchLabelInfo;

export interface LabelCaseByColor {
  colors: string[];
  label: string;
}

export interface SimpleLabelInfo {
  type: "simple";
  label: string;
}

export interface SwitchLabelInfo {
  type: "switch";
  cases: LabelCaseByColor[];
  else: string;
}

export interface PartitionTextualInfo {
  pattern: string;
  slotCount: number;
}

export interface ChargeTextualInfo extends TextualInfo {
  seme?: LabelInfo;
}

export interface TextualInfo {
  one: string;
  plural: string;
  genre: "m" | "f";
  elision: boolean;
}
