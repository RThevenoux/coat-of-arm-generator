let charges = require("./data/charges.json");

export { getCountableChargeLabel, getSemeDefinition }

function getCountableChargeLabel(chargeId, count) {
  let chargeDef = _getDefinition(chargeId);

  if (count > 1) {
    return "à " + count + " " + chargeDef.plural;
  }

  if (chargeDef.elision) {
    return "à l'" + chargeDef.one;
  }

  if (chargeDef.genre == 'm') {
    return "au " + chargeDef.one;
  }

  return "à la " + chargeDef.one;
}

function getSemeDefinition(chargeId) {
  let chargeDef = _getDefinition(chargeId);
  if (chargeDef.seme) {
    let semeDef = chargeDef.seme;

    if (typeof semeDef === 'string' || semeDef instanceof String) {
      return {
        type: "label",
        label: semeDef
      };
    }

    semeDef.type = "case";
    return semeDef;
  }

  return {
    type: "label",
    label: "semé " + _uncountable(chargeDef)
  };
}

function _uncountable(chargeDef) {
  if (chargeDef.elision) {
    return "d'" + chargeDef.plural;
  } else {
    return "de " + chargeDef.plural;
  }
}

function _getDefinition(chargeId) {
  let chargeDef = charges[chargeId];

  if (!chargeDef) {
    console.log("Invalid chargeId:" + chargeId);
    return {
      "one": "[?]",
      "plural": "[?]",
      "genre": "m",
      "elision": false
    }
  }

  return chargeDef;
}