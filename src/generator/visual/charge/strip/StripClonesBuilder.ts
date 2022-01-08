import paper from "paper";
import { StripRotationHelper } from "./StripRotationHelper";
import { origin } from "../../tool/point";
import { BoundsBuilder } from "../BoundsBuilder";
import { StripClones, StripItem } from "./type";

export class StripClonesBuilder {
  private readonly cloneBounds: paper.Rectangle[] = [];
  private readonly boundsBuilder = new BoundsBuilder();
  private readonly patternBoundsPath: paper.Path.Rectangle;

  constructor(
    private readonly pattern: StripItem,
    private readonly rotation: StripRotationHelper
  ) {
    this.patternBoundsPath = new paper.Path.Rectangle(
      origin(),
      pattern.__bounds.size
    );
  }

  public addClone(position: paper.Point): void {
    const boundsClone = this.patternBoundsPath.clone();
    boundsClone.translate(position);

    // update rotatedBounds
    this.boundsBuilder.add(boundsClone.bounds);

    // rotate back
    this.rotation.rotatePath(boundsClone);
    this.cloneBounds.push(boundsClone.bounds);
  }

  public build(): StripClones {
    return {
      type: "stripClones",
      pattern: this.pattern,
      cloneBounds: this.cloneBounds,
      __bounds: this.boundsBuilder.build(),
    };
  }
}
