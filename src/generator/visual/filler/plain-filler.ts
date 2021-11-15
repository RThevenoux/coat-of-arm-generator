import { FillerPlein } from "@/generator/model.type";
import { addSolidGradient } from "../svg/SvgHelper";
import SvgBuilder from "../SvgBuilder";

export function createPlainFiller(
  builder: SvgBuilder,
  model: FillerPlein,
  id: string
): string {
  const color = builder.palette.getColor(model.color);
  addSolidGradient(builder.defs, id, color);
  return id;
}
