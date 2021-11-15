import { getPatternVisualInfo } from "@/service/PatternService";
import { XMLElement } from "xmlbuilder";
import { FillerPattern } from "../../model.type";
import { Palette } from "../Palette";
import {
  addPath,
  addPattern,
  addRectangle,
  addUse,
  fillColorStyle,
} from "../svg/SvgHelper";
import { SimpleShape, SymbolShape } from "../type";

export function createPatternFiller(
  fillerModel: FillerPattern,
  container: SimpleShape | SymbolShape,
  defNode: XMLElement,
  id: string,
  palette: Palette
): void {
  if (container.type == "strip") {
    // Should do special case
    defaultFiller(fillerModel, container.path.bounds, defNode, id, palette);
  } else if (container.type == "symbol") {
    defaultFiller(fillerModel, container.item.bounds, defNode, id, palette);
  } else {
    defaultFiller(fillerModel, container.path.bounds, defNode, id, palette);
  }
}

function defaultFiller(
  fillerModel: FillerPattern,
  bounds: paper.Rectangle,
  defNode: XMLElement,
  id: string,
  palette: Palette
) {
  const rotation = _getPatternRotation(fillerModel);

  const pattern = getPatternVisualInfo(fillerModel.patternName);
  const w = pattern.patternWidth;
  const h = pattern.patternHeight;

  const scaleCoef = bounds.width / (w * pattern.patternRepetition);
  let transform = `scale(${scaleCoef},${scaleCoef})`;
  if (rotation) {
    transform += `rotate(${rotation})`;
  }

  // Align pattern (fail if rotation is applied)
  const x = bounds.x / scaleCoef;
  const y = bounds.y / scaleCoef;

  const patternNode = addPattern(defNode, id, x, y, w, h, transform);

  const backgroundColor = palette.getColor(fillerModel.color1);
  addRectangle(patternNode, 0, 0, w, h, backgroundColor);

  const originalId = `${id}_original`;
  const patternColor = palette.getColor(fillerModel.color2);
  const style = fillColorStyle(patternColor);
  addPath(patternNode, pattern.path, originalId, undefined, style);

  if (pattern.copies) {
    for (const transform of pattern.copies) {
      addUse(patternNode, originalId, undefined, undefined, transform);
    }
  }
}

/* Rotation is only used by "fusele" */
function _getPatternRotation(description: FillerPattern): number | undefined {
  if (!description.angle) {
    return undefined;
  }
  switch (description.angle) {
    case "bande":
      return -45;
    case "barre":
      return 45;
    case "defaut":
      return undefined;
    default:
      console.log("Invalid angle" + description.angle);
      return undefined;
  }
}
