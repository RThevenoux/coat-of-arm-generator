import { uncountableCharge, countableCharge } from './charge-labeller';

let colorNames = require("./data/colorNames.json");
let patterns = require("./data/patterns.json");
let semes = require("./data/semes.json");
let partitions = require("./data/partitions.json");

export default function generateBlazon(model) {
  let label = _getPartitionning(model);

  // Capitalize first letter
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function _getPartitionning(model) {
  if (!model) {
    return "[empty]";
  }

  let partitionDef = partitions[model.type];
  if (!partitionDef) {
    return "unsupported partitionning '" + model.type + "'";
  }

  let count = partitionDef.match(/\{\}/g).length;
  for (let i = 0; i < count; i++) {
    partitionDef = partitionDef.replace("{}", _getPartition(model.partitions[i].model));
  }
  return partitionDef;
}

function _getPartition(model) {
  if (!model || model == "none") {
    return "[of-empty]";
  }
  let fillerLabel = _getFiller(model.filler);

  if (model.charges.length > 0) {
    let chargesLabel = _chargeList(model.charges);
    return fillerLabel + " " + chargesLabel;
  } else {
    return fillerLabel;
  }
}

function _chargeList(charges) {
  return charges.map(item => _singleCharge(item.model)).join(", ");
}

function _singleCharge(charge) {
  let chargeId= _getChargeId(charge);
  let chargeLabel = countableCharge(chargeId, charge.count);
  return chargeLabel + " " + _getColor(charge.color);
}

function _getChargeId(charge) {
  if (charge.type == "stripe") {
    switch (charge.angle) {
      case "0": return 'fasce';
      case "45": return 'barre';
      case "90": return 'pal';
      case "135": return 'bande';
      default: return 'strip:' + charge.angle;
    }
  }
  return "[invalid-type:" + charge.type + "]";
}

function _getFiller(model) {
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
  let semeDef = semes[model.chargeId];
  if (semeDef) {
    for (let aCase of semeDef.cases) {
      if (aCase.colors[0] == model.fieldColor && aCase.colors[1] == model.chargeColor) {
        return aCase.label;
      }
    }
    // else case
    return _simpleSeme(model.fieldColor, semeDef.else, model.chargeColor);
  } else {
    let semeLabel = "semé " + uncountableCharge(model.chargeId);
    return _simpleSeme(model.fieldColor, semeLabel, model.chargeColor);
  }
}

function _simpleSeme(fieldColor, semeLabel, chargeColor) {
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