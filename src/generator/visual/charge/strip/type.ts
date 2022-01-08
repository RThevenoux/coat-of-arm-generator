import { FillerModel } from "@/generator/model.type";
import { StripShape } from "../../type";

export type StripItem = StripSingle | StripComposition | StripClones;

export interface StripComposition {
  type: "stripComposition";
  stripItems: StripItem[];
  __bounds: paper.Rectangle; //unrotated total bounds
}

export interface StripClones {
  type: "stripClones";
  pattern: StripItem;
  cloneBounds: paper.Rectangle[];
  __bounds: paper.Rectangle; //unrotated bounds
}

export interface StripSingle {
  type: "stripSingle";
  shape: StripShape;
  filler: FillerModel;
  __bounds: paper.Rectangle; //unrotated bounds
}
