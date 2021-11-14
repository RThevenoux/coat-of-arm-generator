import { BorderModel, ChargeModel, PlainFieldModel } from "../model.type";
import { getCountableChargeLabel } from "./ChargeTextualGenerator";
import { fillerToLabel } from "./FillerTextualGenerator";

export async function plainFieldToLabel(
  model: PlainFieldModel
): Promise<string> {
  if (!model) {
    return "[?]";
  }

  let label = await fillerToLabel(model.filler);

  if (model.charges.length > 0) {
    const chargesLabel = await _chargeList(model.charges);
    label += " " + chargesLabel;
  }

  if (model.border) {
    const border = await _border(model.border);
    label += " " + border;
  }

  return label;
}

async function _border(model: BorderModel): Promise<string> {
  const filler = await fillerToLabel(model.filler);
  return "à la bordure " + filler;
}

async function _chargeList(charges: ChargeModel[]): Promise<string> {
  const chargeLabels = await Promise.all(
    charges.map((item) => _singleCharge(item))
  );
  return chargeLabels.join(", ");
}

async function _singleCharge(charge: ChargeModel): Promise<string> {
  const chargeId = _getChargeId(charge);
  const chargeLabel = await getCountableChargeLabel(chargeId, charge.count);
  const filler = await fillerToLabel(charge.filler);
  return chargeLabel + " " + filler;
}

function _getChargeId(charge: ChargeModel): string {
  switch (charge.type) {
    case "strip": {
      switch (charge.direction) {
        case "0":
          return "fasce";
        case "45":
          return "barre";
        case "90":
          return "pal";
        case "135":
          return "bande";
        default:
          return "strip:" + charge.direction;
      }
    }
    case "cross": {
      switch (charge.direction) {
        case "0":
          return "croix";
        case "45":
          return "sautoir";
        default:
          return "cross:" + charge.direction;
      }
    }
    case "symbol": {
      return charge.chargeId;
    }
    default:
      return "[invalid charge]";
  }
}
