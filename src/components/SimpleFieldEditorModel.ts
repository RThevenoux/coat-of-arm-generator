import { FillerEditorModel } from "./FillerEditorModel";
import { SingleChargePickerModel } from "./SingleChargePickerModel";

export interface SimpleFieldEditorModel {
  filler: FillerEditorModel;
  border: {
    present: boolean;
    filler: FillerEditorModel;
  };
  charges: { model: SingleChargePickerModel }[];
}
