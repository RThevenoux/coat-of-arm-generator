let charges = require("./data/charges.json");

export default function getCharge(chargeId) {
  let chargeDef = charges[chargeId];
  if (!chargeDef) {
    chargeDef = charges["$default"];
  }
  return chargeDef;
}