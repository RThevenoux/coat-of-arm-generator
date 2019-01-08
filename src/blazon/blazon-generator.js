var colorNames = require("./colorNames.json");
var patterns = require("./patterns.json");

export default function generateBlazon(model) {

  let label = getFiller(model)

  // Capitalize first letter
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getFiller(model) {
  switch (model.type) {
    case "plein": {
      return colorNames[model.color];
    }
    case "pattern": {
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
    default: {
      return "unsupported-type:" + model.type;
    }
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
  string += " " + colorNames[model.color1] + " et " + colorNames[model.color2];
  return string;

}