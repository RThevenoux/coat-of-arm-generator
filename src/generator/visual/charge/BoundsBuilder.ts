import * as paper from "paper";

export class BoundsBuilder {
  private union: paper.Rectangle | undefined = undefined;
  add(bounds: paper.Rectangle): void {
    if (this.union) {
      this.union = this.union.unite(bounds);
    } else {
      this.union = bounds;
    }
  }

  build(): paper.Rectangle {
    if (!this.union) {
      throw new Error("Bounds is empty");
    }
    return this.union;
  }
}
