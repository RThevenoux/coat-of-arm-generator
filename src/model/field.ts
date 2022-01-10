import { ChargeModel } from "./charge";
import { FillerModel } from "./filler";

export type FieldModel = PlainFieldModel | MultiFieldModel;

export interface PlainFieldModel {
  type: "plain";
  filler: FillerModel;
  charges: ChargeModel[];
  border?: BorderModel;
}

export interface MultiFieldModel {
  type: "partition";
  partitionType: string;
  fields: FieldModel[];
}

export interface BorderModel {
  filler: FillerModel;
}
