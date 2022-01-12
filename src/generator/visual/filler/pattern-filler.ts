import { getPatternVisualInfo } from "@/service/PatternService";
import { PatternVisualInfo } from "@/service/visual.type";
import { FillerPattern } from "../../../model/filler";
import { SvgBuilder } from "../svg/SvgBuilder";
import { SimpleShape, MobileChargeShape } from "../type";
import { createPatternTransfrom, getItem } from "./util";

export function createPatternFiller(
  builder: SvgBuilder,
  fillerModel: FillerPattern,
  container: SimpleShape | MobileChargeShape
): string {
  const rotation = _getPatternRotation(fillerModel);
  const patternInfo = getPatternVisualInfo(fillerModel.patternName);

  const transform = getPatternTransform(container, patternInfo, rotation);

  const w = patternInfo.patternWidth;
  const h = patternInfo.patternHeight;
  const pattern = builder.createPattern(w, h, transform);

  pattern.addBackground({ colorId: fillerModel.color1 });

  const originalId = pattern.addPath(patternInfo.path, {
    colorId: fillerModel.color2,
  });

  if (patternInfo.copies) {
    for (const copyTransform of patternInfo.copies) {
      pattern.addUse(originalId, copyTransform);
    }
  }

  return pattern.id;
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

function getPatternTransform(
  container: SimpleShape | MobileChargeShape,
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
      rotation = container.stripAngle + (rotation ? rotation : 0);
    }

    return createPatternTransfrom(container.patternAnchor, scale, rotation);
  } else if (container.type == "cross") {
    const n = Math.ceil(pattern.patternRepetition / 3);
    const scale = container.stripWidth / (w * n);
    return createPatternTransfrom(container.patternAnchor, scale, rotation);
  } else {
    const bounds = getItem(container).bounds;
    const scale = bounds.width / (w * pattern.patternRepetition);
    return createPatternTransfrom(bounds.topLeft, scale, rotation);
  }
}
