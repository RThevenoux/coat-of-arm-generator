import { Direction } from "@/model/misc";
import { origin } from "../../tool/point";
import { SimpleShape } from "../../type";

export class StripRotationHelper {
  private readonly center: paper.Point;
  public readonly rotatedBounds: paper.Rectangle;

  constructor(
    readonly angle: number,
    readonly direction: Direction,
    container: SimpleShape
  ) {
    this.center = origin();
    const containerClone = container.path.clone();
    containerClone.rotate(-angle, this.center);
    this.rotatedBounds = containerClone.bounds;
  }

  public rotatePoint(point: paper.Point): paper.Point {
    return point.rotate(-this.angle, this.center); // Not clear why rotation must be negate...
  }

  public rotatePath(path: paper.PathItem): void {
    path.rotate(this.angle, this.center);
  }
}
