import { FillerEditorModel } from "./FillerEditorModel";
import { SingleChargePickerModel } from "./SingleChargePickerModel";

export interface FieldEditorModel {
  partitionType: string;
  partitions: {
    number: number;
    img: string;
    model: FieldEditorModel;
  }[];
  plain: PlainFieldEditorModel;
}

export interface PlainFieldEditorModel {
  filler: FillerEditorModel;
  border: {
    present: boolean;
    filler: FillerEditorModel;
  };
  charges: { model: SingleChargePickerModel }[];
}
