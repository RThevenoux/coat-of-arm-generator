import getCharge from './charge-manager';

let patterns = require("./data/patterns.json");

export default function getFiller(builder, filler, shapeBox) {
  if (!filler) {
    return builder.getDefaultFiller();
  }

  switch (filler.type) {
    case "plein": {
      return builder.getSolidFiller(filler.color);
    };
    case "pattern": {
      let patternDef = patterns[filler.patternName];
      let parameters = _getPatternParameters(filler, shapeBox);
      return builder.addPattern(patternDef, parameters);
    };
    case "seme": {
      let parameters = _getSemeParameters(filler);
      return builder.addSeme(parameters, shapeBox.width);
    }
    default: {
      console.log("visual-generator - unsupported-filler-type:" + filler.type);
      return builder.getDefaultFiller();
    }
  }
}

function _getSemeParameters(description) {
  let chargeDef = getCharge(description.chargeId);

  let tx = chargeDef.seme.tx;
  let ty = chargeDef.seme.ty;
  let h = chargeDef.height;
  let w = chargeDef.width;

  let parameters = {
    charge: {
      id: description.chargeId,
      xml: chargeDef.xml,
      color: description.chargeColor,
      width: w,
      height: h
    },
    seme: {
      width: tx * 2,
      height: ty * 2,
      repetition: chargeDef.seme.repetition,
      copies: [
        "translate(" + (-w / 2 + tx) + "," + (-h / 2 + ty) + ")",
        "translate(" + (-w / 2) + "," + (-h / 2) + ")",
        "translate(" + (-w / 2) + "," + (-h / 2 + 2 * ty) + ")",
        "translate(" + (-w / 2 + 2 * tx) + "," + (-h / 2) + ")",
        "translate(" + (-w / 2 + 2 * tx) + "," + (-h / 2 + 2 * ty) + ")"
      ]
    },
    fieldColor: description.fieldColor
  }
  return parameters;
}

function _getPatternParameters(description, shapeBox) {
  let param = {
    backgroundColor: description.color1,
    patternColor: description.color2,
    shapeWidth: shapeBox.width
  }

  if (description.angle) {
    switch (description.angle) {
      case "bande": param.rotation = -45; break;
      case "barre": param.rotation = 45; break;
      case "defaut": break;
      default: console.log("Invalid angle" + description.angle);
    }
  }

  return param;
}
