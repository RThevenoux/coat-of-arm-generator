let charges = require("./data/charges.json");

export function countableCharge(chargeId, count) {
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

export function uncountableCharge(chargeId) {
  let chargeDef = _getDefinition(chargeId);

  if (chargeDef.elision) {
    return "d'" + chargeDef.plural;
  } else {
    return "de " + chargeDef.plural;
  }
}

function _getDefinition(chargeId) {
  let chargeDef = charges[chargeId];

  if (!chargeDef) {
    return {
      "one": "[?]",
      "plural": "[?]",
      "genre": "m",
      "elision": false
    }
  }

  return chargeDef;
}