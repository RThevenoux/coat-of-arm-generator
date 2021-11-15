import { getPatternVisualInfo } from "@/service/PatternService";
import { FillerPattern } from "../../model.type";
import {
  addPath,
  addPattern,
  addRectangle,
  addUse,
  fillColorStyle,
} from "../svg/SvgHelper";
import SvgBuilder from "../SvgBuilder";
import { SimpleShape, SymbolShape } from "../type";

export function createPatternFiller(
  builder: SvgBuilder,
  fillerModel: FillerPattern,
  container: SimpleShape | SymbolShape,
  id: string
): string {
  if (container.type == "strip") {
    // Should do special case
    defaultFiller(builder, fillerModel, container.path.bounds, id);
  } else if (container.type == "symbol") {
    defaultFiller(builder, fillerModel, container.item.bounds, id);
  } else {
    defaultFiller(builder, fillerModel, container.path.bounds, id);
  }

  return id;
}

function defaultFiller(
  builder: SvgBuilder,
  fillerModel: FillerPattern,
  bounds: paper.Rectangle,
  id: string
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

  const patternNode = addPattern(builder.defs, id, x, y, w, h, transform);

  const backgroundColor = builder.palette.getColor(fillerModel.color1);
  addRectangle(patternNode, 0, 0, w, h, backgroundColor);

  const originalId = `${id}_original`;
  const patternColor = builder.palette.getColor(fillerModel.color2);
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
