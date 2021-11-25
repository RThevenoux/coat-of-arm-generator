import { getPatternVisualInfo } from "@/service/PatternService";
import { PatternVisualInfo } from "@/service/visual.type";
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
import { createPatternTransfrom } from "./util";

export function createPatternFiller(
  builder: SvgBuilder,
  fillerModel: FillerPattern,
  container: SimpleShape | SymbolShape,
  id: string
): string {
  const rotation = _getPatternRotation(fillerModel);
  const pattern = getPatternVisualInfo(fillerModel.patternName);

  const transform = getPatternTransform(container, pattern, rotation);

  const w = pattern.patternWidth;
  const h = pattern.patternHeight;
  const patternNode = addPattern(builder.defs, id, w, h, transform);

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

  return id;
}

/* Rotation is only used by "fusele" */
function _getPatternRotation(description: FillerPattern): number | undefined {
  if (!description.angle) {
    return undefined;
  }
  switch (description.angle) {
    case "bande":
      return 45;
    case "barre":
      return -45;
    case "defaut":
      return undefined;
    default:
      console.log("Invalid angle" + description.angle);
      return undefined;
  }
}

function getPatternTransform(
  container: SimpleShape | SymbolShape,
  pattern: PatternVisualInfo,
  rotation?: number
) {
  const w = pattern.patternWidth;

  if (container.type == "strip") {
    const n = Math.ceil(pattern.patternRepetition / 3);
    const scale = container.stripWidth / (w * n);
    if (
      container.stripDirection == "bande" ||
      container.stripDirection == "barre"
    ) {
      rotation =
        (container.stripAngle * 180) / Math.PI - 90 + (rotation ? rotation : 0);
    }
    return createPatternTransfrom(container.patternAnchor, scale, rotation);
  } else if (container.type == "cross") {
    const n = Math.ceil(pattern.patternRepetition / 3);

    const scale = container.stripWidth / (w * n);

    return createPatternTransfrom(container.patternAnchor, scale, rotation);
  } else {
    const bounds = (
      container.type == "symbol" ? container.item : container.path
    ).bounds;
    const scale = bounds.width / (w * pattern.patternRepetition);
    return createPatternTransfrom(bounds.topLeft, scale, rotation);
  }
}
