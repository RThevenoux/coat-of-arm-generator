import { FillerEditorModel } from "./FillerEditorModel";
import { FillerPickerState } from "./FillerPickerModel";

export interface FillerPickerSelectedEvent {
  type: "filler-picker";
  source: {
    state: FillerPickerState;
    model: FillerEditorModel;
  };
}
