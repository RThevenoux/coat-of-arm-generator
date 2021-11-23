import { FillerEditorModel } from "@/components/FillerEditorModel";

export interface IFillerPicker {
  fillerModelUnselect(): void;
  getFillerModel(): FillerEditorModel;
}
