import paper from "paper";
import { origin, point } from "../tool/point";
import { StripData } from "./strip.type";
import { createOutline } from "./outline.factory";

export function createHorizontalStripPath(strip: StripData): paper.Path {
  const topPath = createOutline(
    strip.length,
    strip.width,
    strip.outline.outline1,
    false
  );

  const bottomPath = createOutline(
    strip.length,
    strip.width,
    strip.outline.outline2,
    strip.outline.outline2Shifted
  );
  bottomPath.scale(1, -1, origin());
  bottomPath.reverse();
  bottomPath.translate(point(0, strip.width));

  const path = new paper.Path();
  path.join(topPath);
  path.lineTo(bottomPath.firstCurve.point1);
  path.join(bottomPath);
  path.lineTo(topPath.firstCurve.point1);
  path.closePath();

  // Clip path to remove before 'x=0' and after 'x=length'
  const margin = 10; // ad hoc value for vertical margin
  const rectangle = new paper.Rectangle(
    0,
    path.bounds.y - margin,
    strip.length,
    path.bounds.height + 2 * margin
  );
  const clipper = new paper.Path.Rectangle(rectangle);
  const clipped = path.intersect(clipper) as paper.Path;

  return clipped.reduce({});
}

export function createVerticalStripPath(data: StripData): paper.Path {
  const path = createHorizontalStripPath(data);
  path.rotate(90, origin());
  path.translate(point(data.width, 0));
  return path;
}
