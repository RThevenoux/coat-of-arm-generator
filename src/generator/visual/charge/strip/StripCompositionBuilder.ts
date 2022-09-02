import { BoundsBuilder } from "../BoundsBuilder";
import { StripItem } from "./type";

export class StripCompositionBuilder {
  items: StripItem[] = [];
  boundsBuilder = new BoundsBuilder();

  public add(item: StripItem): void {
    this.boundsBuilder.add(item.__bounds);
    this.items.push(item);
  }

  public build(): StripItem {
    if (this.items.length === 1) {
      return this.items[0];
    }

    return {
      type: "stripComposition",
      stripItems: this.items,
      __bounds: this.boundsBuilder.build(),
    };
  }
}
