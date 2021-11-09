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

export interface ChargeTextualInfo {
  one: string;
  plural: string;
  genre: string;
  elision: boolean;
  seme?: LabelInfo;
}
