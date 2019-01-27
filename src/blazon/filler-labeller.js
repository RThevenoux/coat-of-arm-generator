import { getSemeDefinition } from './charge-labeller';

let color = require("./data/colors.json");
let patterns = require("./data/patterns.json");

export default function getFiller(model) {
  if (!model) {
    console.log("getFiller() : model is undefined");
    return "[?]";
  }
  switch (model.type) {
    case "plein": return _plein(model);
    case "pattern": return _pattern(model);
    case "seme": return _seme(model);
    case "strip": return _strip(model);
    default: return "unsupported-filler-type:" + model.type;
  }
}

function _getColor(key) {
  return color[key];
}

function _plein(model) {
  return _getColor(model.color);
}

function _pattern(model) {
  let pattern = patterns[model.patternName];
  if (typeof pattern === 'string' || pattern instanceof String) {
    return _simplePattern(model, pattern);
  } else {
    for (let aCase of pattern.cases) {
      if (aCase.colors[0] == model.color1 && aCase.colors[1] == model.color2) {
        return aCase.label;
      }
    }
    // else (if colors match no case)
    return _simplePattern(model, pattern.else);
  }
}

function _seme(model) {
  let semeDef = getSemeDefinition(model.chargeId);

  if (semeDef.type == "case") {
    for (let aCase of semeDef.cases) {
      if (aCase.colors[0] == model.fieldColor && aCase.colors[1] == model.chargeColor) {
        return aCase.label;
      }
    }
    // else case
    return _simpleSeme(semeDef.else, model.fieldColor, model.chargeColor);
  }

  return _simpleSeme(semeDef.label, model.fieldColor, model.chargeColor);
}

function _simpleSeme(semeLabel, fieldColor, chargeColor) {
  return _getColor(fieldColor) + " " + semeLabel + " " + _getColor(chargeColor);
}

function _simplePattern(model, label) {
  let string = label;
  if (model.angle) {
    switch (model.angle) {
      case "bande": string += " en bande"; break;
      case "barre": string += " en barre"; break;
      case "defaut": break;
      default: return "invalid-angle:" + model.angle;
    }
  }
  string += " " + _getColor(model.color1) + " et " + _getColor(model.color2);
  return string;
}

function _strip(model) {
  let label = "";
  switch (model.angle) {
    case "0": label = "fascé"; break;
    case "45": label = "barré"; break;
    case "90": label = "palé"; break;
    case "135": label = "bandé"; break;
  }

  label += " " + _getColor(model.color1) + " et " + _getColor(model.color2);
  if (model.count != 3) {
    label += " de " + model.count * 2 + " pièces";
  }

  return label;
}