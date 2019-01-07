var colorNames = require("./colorNames.json");

var patterns = {
  echiquete: "échiqueté",
  losange: "losangé",
  fusele: "fuselé"
}

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
      let string = patterns[model.patternName];
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
    default: {
      return "unsupported-type:" + model.type;
    }
  }
}