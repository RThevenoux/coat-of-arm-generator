import * as paper from "paper";
import { getPatternVisualInfo } from "@/service/PatternService";
import { PatternVisualInfo } from "@/service/visual.type";
import { FillerPattern } from "../../model.type";
import {
  addPath,
  addPattern,
  addRectangle,
  addUse,
  fillColorStyle,
  PatternTransform,
  svgTransform,
} from "../svg/SvgHelper";
import SvgBuilder from "../SvgBuilder";
import { SimpleShape, StripShape, SymbolShape } from "../type";
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
  if (container.type == "strip") {
    return getStripPatternTransform(container, pattern, rotation);
  } else if (container.type == "symbol") {
    return getDefaultPatternTranfrom(container.item.bounds, pattern, rotation);
  } else {
    return getDefaultPatternTranfrom(container.path.bounds, pattern, rotation);
  }
}

function getDefaultPatternTranfrom(
  bounds: paper.Rectangle,
  pattern: PatternVisualInfo,
  rotation?: number
) {
  const w = pattern.patternWidth;
  const scale = bounds.width / (w * pattern.patternRepetition);
  return createPatternTransfrom(bounds.topLeft, scale, rotation);
}

function getStripPatternTransform(
  strip: StripShape,
  pattern: PatternVisualInfo,
  rotation?: number
): PatternTransform {
  const w = pattern.patternWidth;
  const n = pattern.patternRepetition;
  const scale = strip.width / (w * n);

  switch (strip.direction) {
    case "bande":
    case "barre": {
      rotation = (strip.angle * 180) / Math.PI - 90 + (rotation ? rotation : 0);

      const clone = strip.path.clone();
      clone.rotate(rotation, new paper.Point(0, 0));

      const x = clone.bounds.x / scale;
      const y = 0; // Do not try to align on y-translation

      const transform = svgTransform(scale, rotation);
      return { x, y, transform };
    }
    case "pal":
    case "fasce":
    default: {
      const anchor = strip.path.bounds.topLeft;
      return createPatternTransfrom(anchor, scale, rotation);
    }
  }
}
