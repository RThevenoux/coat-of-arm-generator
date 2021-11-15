import { XMLElement } from "xmlbuilder";
import { addPattern, addRectangle } from "../svg/SvgHelper";

export function createDefaultFiller(defNode: XMLElement, id: string): string {
  const size = 50;
  const half = size / 2;
  const color1 = "white";
  const color2 = "grey";

  const patternNode = addPattern(defNode, id, 0, 0, size, size);

  addRectangle(patternNode, 0, 0, size, size, color1);
  addRectangle(patternNode, half, 0, half, half, color2);
  addRectangle(patternNode, 0, half, half, half, color2);

  return id;
}