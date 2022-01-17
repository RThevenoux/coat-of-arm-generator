export type LabelInfo<T> = SimpleCase<T> | ColorSwitch<T>;

export interface CaseByColor<T> {
  colors: string[];
  value: T;
}

export interface SimpleCase<T> {
  type: "simple";
  value: T;
}

export interface ColorSwitch<T> {
  type: "switch";
  cases: CaseByColor<T>[];
  else: T;
}

export interface PartitionTextualInfo {
  pattern: string;
  slotCount: number;
}

export type AdjectiveId = string;
export type NounId = string;

export type FrenchAdjective =
  | RegularVariableAdjective
  | IrregularVariableAdjective
  | InvariableAdjective;

export interface InvariableAdjective {
  type: "invariant";
  invariant: string;
}
export interface RegularVariableAdjective {
  type: "regular";
  base: string;
}

export interface IrregularVariableAdjective {
  type: "irregular";
  masculine: {
    one: string;
    plural: string;
  };
  feminine: {
    one: string;
    plural: string;
  };
}
export interface FrenchNoun {
  one: string;
  plural: string;
  genre: "m" | "f";
  elision: boolean;
}
