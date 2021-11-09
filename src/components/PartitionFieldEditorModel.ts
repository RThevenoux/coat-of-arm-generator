import { FieldEditorModel } from "./FieldEditorModel";

export interface PartitionFieldEditorModel {
  partitionType: string;
  partitions: {
    number: number;
    model: FieldEditorModel;
  }[];
}
