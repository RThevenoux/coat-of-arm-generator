let colorNames = require("./colorNames.json");
let patterns = require("./patterns.json");
let meubles = require("./meubles.json");
let semes = require("./semes.json");

export default function generateBlazon(model) {

  let label = getFiller(model)

  // Capitalize first letter
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getFiller(model) {
  switch (model.type) {
    case "plein": return _plein(model);
    case "pattern": return _pattern(model);
    case "seme": return _seme(model);
    default: return "unsupported-type:" + model.type;
  }
}

function _getColor(key) {
  return colorNames[key];
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
  let semeDef = semes[model.meuble];
  console.log("semeDef:" + semeDef);
  if (semeDef) {
    for (let aCase of semeDef.cases) {
      if (aCase.colors[0] == model.fieldColor && aCase.colors[1] == model.meubleColor) {
        return aCase.label;
      }
    }
    // else case
    return _simpleSeme(model.fieldColor, semeDef.else, model.meubleColor);
  } else {
    let semeLabel = "semé " + _getMeubleDe(model.meuble);
    return _simpleSeme(model.fieldColor, semeLabel, model.meubleColor);
  }
}

function _simpleSeme(fieldColor, semeLabel, meubleColor) {
  return _getColor(fieldColor) + " " + semeLabel + " " + _getColor(meubleColor);
}

function _getMeubleDe(meubleKey) {
  let meubleDef = meubles[meubleKey]
  if (!meubleDef) {
    return "de [?]";
  }

  if (meubleDef.label.elision) {
    return "d'" + meubleDef.label.plural;
  } else {
    return "de " + meubleDef.label.plural;
  }
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