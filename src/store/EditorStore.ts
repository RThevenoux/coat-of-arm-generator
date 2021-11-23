import { FillerEditorModel } from "@/components/FillerEditorModel";
import { EditorStoreListener } from "./EditorStoreListener";
import { IFillerPicker } from "./IFillerPicker";

const listeners: EditorStoreListener[] = [];
let selected: IFillerPicker | null = null;

export function addEditorStoreListener(listener: EditorStoreListener): void {
  listeners.push(listener);
}

export function getSelectedFillerModel(): FillerEditorModel | undefined {
  return selected?.getFillerModel();
}

export function fillerPickerSelected(wrapper: IFillerPicker): void {
  if (selected) {
    selected.fillerModelUnselect();
  }
  updateSelected(wrapper);
}

export function fillerPickerDestroyed(wrapper: IFillerPicker): void {
  if (selected == wrapper) {
    updateSelected(null);
  } else {
    console.log("destroyed not selected");
  }
}

function updateSelected(newValue: IFillerPicker | null): void {
  selected = newValue;
  listeners.forEach((listener) => listener.editorStoreUpdated());
}
