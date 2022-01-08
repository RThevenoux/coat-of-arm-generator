import { BoundsBuilder } from "../BoundsBuilder";
import { StripComposition, StripItem } from "./type";

export class StripCompositionBuilder {
  items: StripItem[] = [];
  boundsBuilder = new BoundsBuilder();

  public add(item: StripItem): void {
    this.boundsBuilder.add(item.__bounds);
    this.items.push(item);
  }

  public build(): StripComposition {
    return {
      type: "stripComposition",
      stripItems: this.items,
      __bounds: this.boundsBuilder.build(),
    };
  }
}
