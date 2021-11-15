import * as paper from "paper";
import { Direction, FillerStrip } from "@/generator/model.type";
import { XMLElement } from "xmlbuilder";
import { Palette } from "../Palette";
import { addPattern, addRectangle } from "../svg/SvgHelper";
import { SimpleShape, SymbolShape } from "../type";

export function createStripFiller(
  model: FillerStrip,
  container: SimpleShape | SymbolShape,
  defNode: XMLElement,
  id: string,
  palette: Palette,
) {

  const item = container.type == "symbol" ? container.item : container.path;

  const angle = _getStripAngle(model.direction, item.bounds);

  const clone = item.clone();
  clone.rotate(-angle, new paper.Point(0, 0));

  const pathHeight = clone.bounds.height;
  const scaleCoef = pathHeight / model.count;

  const x = 0;
  const y =
    (-Math.sin((angle * Math.PI) / 180) * item.bounds.x +
      Math.cos((angle * Math.PI) / 180) * item.bounds.y) /
    scaleCoef;
  const transform = `scale(${scaleCoef},${scaleCoef})rotate(${angle})`;

  const color1 = palette.getColor(model.color1);
  const color2 = palette.getColor(model.color2);
  const patternNode = addPattern(defNode, id, x, y, 1, 1, transform);

  addRectangle(patternNode, 0, 0, 1, 1, color1);
  addRectangle(patternNode, 0, 0.5, 1, 0.5, color2);

  return id;
}

function _getStripAngle(
  direction: Direction,
  bounds: paper.Rectangle
): number {
  const pathAngle = (Math.atan(bounds.height / bounds.width) * 180) / Math.PI;
  switch (direction) {
    case "0":
      return 0;
    case "45":
      return pathAngle;
    case "90":
      return -90;
    case "135":
      return -pathAngle;
  }
}