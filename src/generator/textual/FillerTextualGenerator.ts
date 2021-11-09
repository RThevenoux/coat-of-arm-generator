import {
  FillerModel,
  FillerPattern,
  FillerPlein,
  FillerSeme,
  FillerStrip,
  Angle,
} from "../model.type";
import { getSemeLabelInfo } from "./ChargeTextualGenerator";
import { getColorText } from "../../service/ColorService";
import { getPatternTextualInfo } from "../../service/PatternService";

export async function fillerToLabel(model: FillerModel): Promise<string> {
  if (!model) {
    console.log("getFiller() : model is undefined");
    return "[?]";
  }
  switch (model.type) {
    case "plein":
      return _plein(model);
    case "pattern":
      return _pattern(model);
    case "seme":
      return _seme(model);
    case "strip":
      return _strip(model);
    case "invalid":
      return "[no-filler]";
    default:
      return "[!filler-error]";
  }
}

function _plein(model: FillerPlein): string {
  return getColorText(model.color);
}

function _pattern(model: FillerPattern): string {
  const labelInfo = getPatternTextualInfo(model.patternName);

  if (labelInfo.type == "switch") {
    const color1 = model.color1;
    const color2 = model.color2;
    for (const aCase of labelInfo.cases) {
      if (aCase.colors[0] == color1 && aCase.colors[1] == color2) {
        return aCase.label;
      }
    }
    // else (if colors match no case)
    return _simplePattern(model, labelInfo.else);
  } else {
    return _simplePattern(model, labelInfo.label);
  }
}

async function _seme(model: FillerSeme): Promise<string> {
  const labelInfo = await getSemeLabelInfo(model.chargeId);

  if (labelInfo.type == "switch") {
    const color1 = model.fieldColor;
    const color2 = model.chargeColor;
    for (const aCase of labelInfo.cases) {
      if (aCase.colors[0] == color1 && aCase.colors[1] == color2) {
        return aCase.label;
      }
    }
    // else (if colors match no case)
    return _simpleSeme(labelInfo.else, model);
  } else {
    return _simpleSeme(labelInfo.label, model);
  }
}

function _simpleSeme(semeLabel: string, model: FillerSeme): string {
  const color1 = getColorText(model.fieldColor);
  const color2 = getColorText(model.chargeColor);
  return `${color1} ${semeLabel} ${color2}`;
}

function _simplePattern(model: FillerPattern, label: string): string {
  const pattern = _patternTextWithAngle(model.angle, label);
  const color1 = getColorText(model.color1);
  const color2 = getColorText(model.color2);

  return `${pattern} ${color1} et ${color2}`;
}

function _patternTextWithAngle(
  angle: "bande" | "barre" | "defaut" | undefined,
  label: string
): string {
  if (angle) {
    switch (angle) {
      case "bande":
        return `${label} en bande`;
      case "barre":
        return `${label} en barre`;
      case "defaut":
        return label;
      default:
        return label + " [invalid angle]";
    }
  }
  return label;
}

function _strip(model: FillerStrip): string {
  const stripText = _stripFillerText(model.angle);
  const color1 = getColorText(model.color1);
  const color2 = getColorText(model.color2);

  if (model.count == 3) {
    return `${stripText} ${color1} et ${color2}`;
  } else {
    const stripCount = model.count * 2;
    return `${stripText} ${color1} et ${color2} de ${stripCount} pièces`;
  }
}

function _stripFillerText(angle: Angle): string {
  switch (angle) {
    case "0":
      return "fascé";
    case "45":
      return "barré";
    case "90":
      return "palé";
    case "135":
      return "bandé";
  }
}
