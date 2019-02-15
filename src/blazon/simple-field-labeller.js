import { getCountableChargeLabel } from './charge-labeller';
import getFiller from './filler-labeller';

export function toLabel(model) {

  if (!model || model == "none") {
    return "[?]";
  }

  let label = "";

  label += getFiller(model.filler);

  if (model.charges.length > 0) {
    let chargesLabel = _chargeList(model.charges);
    label += " " + chargesLabel;
  }

  if (model.border) {
    label += _border(model.border);
  }

  return label;
}

function _border(model) {
  return " à la bordure " + getFiller(model.filler);
}

function _chargeList(charges) {
  return charges.map(item => _singleCharge(item)).join(", ");
}

function _singleCharge(charge) {
  let chargeId = _getChargeId(charge);
  let chargeLabel = getCountableChargeLabel(chargeId, charge.count);
  return chargeLabel + " " + getFiller(charge.filler);
}

function _getChargeId(charge) {
  switch (charge.type) {
    case "strip": {
      switch (charge.angle) {
        case "0": return 'fasce';
        case "45": return 'barre';
        case "90": return 'pal';
        case "135": return 'bande';
        default: return 'strip:' + charge.angle;
      }
    }
    case "cross": {
      switch (charge.angle) {
        case "0": return 'croix';
        case "45": return 'sautoir';
      }
    }
    case "symbol": {
      return charge.chargeId;
    }
    default: return "[invalid-type:" + charge.type + "]";
  }
}