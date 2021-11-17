import { addPattern, addRectangle } from "../svg/SvgHelper";
import SvgBuilder from "../SvgBuilder";

export function createDefaultFiller(builder: SvgBuilder, id: string): string {
  const size = 50;
  const half = size / 2;
  const color1 = "white";
  const color2 = "grey";

  const patternNode = addPattern(builder.defs, id, size, size);

  addRectangle(patternNode, 0, 0, size, size, color1);
  addRectangle(patternNode, half, 0, half, half, color2);
  addRectangle(patternNode, 0, half, half, half, color2);

  return id;
}
