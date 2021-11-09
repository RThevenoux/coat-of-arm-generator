import { SimpleFieldEditorModel } from "./SimpleFieldEditorModel";

export interface FieldEditorModel {
  partitionType: string;
  partitions: {
    number: number;
    model: FieldEditorModel;
  }[];
  simple: SimpleFieldEditorModel;
}
