import { PartitionFieldEditorModel } from "./PartitionFieldEditorModel";
import { SimpleFieldEditorModel } from "./SimpleFieldEditorModel";

export interface FieldEditorModel {
  type: "simple" | "partition";
  partition: PartitionFieldEditorModel;
  simple: SimpleFieldEditorModel;
}
