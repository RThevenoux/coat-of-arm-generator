import {
  FillerModel,
  FillerPattern,
  FillerPlein,
  FillerSeme,
  FillerStrip,
} from "@/model/filler";
import { ColorId, Direction } from "@/model/misc";
import { getColorText } from "@/service/ColorService";
import { getPatternTextualInfo } from "@/service/PatternService";
import { LabelInfo, SwitchLabelInfo } from "@/service/textual.type";
import { getChargeTextualInfo } from "@/service/ChargeService";
import { directionToLabel, uncountableChargeToLabel } from "./util";

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
    const matching = _searchMatchingLabel(
      labelInfo,
      model.color1,
      model.color2
    );
    return matching ? matching : _simplePattern(model, labelInfo.else);
  } else {
    return _simplePattern(model, labelInfo.label);
  }
}

async function _seme(model: FillerSeme): Promise<string> {
  const labelInfo = await _getSemeLabelInfo(model.chargeId);

  if (labelInfo.type == "switch") {
    const matching = _searchMatchingLabel(
      labelInfo,
      model.fieldColor,
      model.chargeColor
    );
    return matching ? matching : _simpleSeme(labelInfo.else, model);
  } else {
    return _simpleSeme(labelInfo.label, model);
  }
}

function _searchMatchingLabel(
  labelInfo: SwitchLabelInfo,
  color1: ColorId,
  color2: ColorId
): string | undefined {
  for (const aCase of labelInfo.cases) {
    if (aCase.colors[0] == color1 && aCase.colors[1] == color2) {
      return aCase.label;
    }
  }
  return undefined;
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
  direction: "bande" | "barre" | "defaut" | undefined,
  label: string
): string {
  if (direction == "bande" || direction == "barre") {
    const directionLabel = directionToLabel(direction);
    return `${label} ${directionLabel}`;
  } else {
    return label;
  }
}

function _strip(model: FillerStrip): string {
  const stripText = _stripFillerText(model.direction);
  const color1 = getColorText(model.color1);
  const color2 = getColorText(model.color2);

  if (model.count == 3) {
    return `${stripText} ${color1} et ${color2}`;
  } else {
    const stripCount = model.count * 2;
    return `${stripText} ${color1} et ${color2} de ${stripCount} pièces`;
  }
}

function _stripFillerText(direction: Direction): string {
  switch (direction) {
    case "fasce":
      return "fascé";
    case "barre":
      return "barré";
    case "pal":
      return "palé";
    case "bande":
      return "bandé";
  }
}

async function _getSemeLabelInfo(chargeId: string): Promise<LabelInfo> {
  const chargeDef = await getChargeTextualInfo(chargeId);

  if (chargeDef.seme) {
    return chargeDef.seme;
  }

  return {
    type: "simple",
    label: `semé ${uncountableChargeToLabel(chargeDef)}`,
  };
}
