import { addGradientStop, addRadialGradient } from "../svg/SvgHelper";
import { SvgBuilder } from "../svg/SvgBuilder";

export function createReflect(
  builder: SvgBuilder,
  path: paper.Path,
  id: string
): string {
  const bounds = path.bounds;

  const cx = bounds.width / 3;
  const cy = bounds.height / 3;
  const radius = (bounds.width * 2) / 3;

  const gradient = addRadialGradient(builder.defs, id, cx, cy, radius);

  addGradientStop(gradient, 0.0, "#fff", 0.31);
  addGradientStop(gradient, 0.19, "#fff", 0.25);
  addGradientStop(gradient, 0.6, "#6b6b6b", 0.125);
  addGradientStop(gradient, 1.0, "#000", 0.125);

  return id;
}
