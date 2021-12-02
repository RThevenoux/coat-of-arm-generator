import { BorderModel, ChargeModel, PlainFieldModel } from "../model.type";
import { getCountableChargeLabel } from "./ChargeTextualGenerator";
import { crossToLabel } from "./CrossTextualGenerator";
import { fillerToLabel } from "./FillerTextualGenerator";
import { stripToLabel } from "./StripTextualGenerator";

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
  const chargeLabel = await _chargeLabel(charge);
  const filler = await fillerToLabel(charge.filler);
  return `${chargeLabel} ${filler}`;
}

async function _chargeLabel(charge: ChargeModel): Promise<string> {
  switch (charge.type) {
    case "strip":
      return stripToLabel(charge);
    case "cross":
      return crossToLabel(charge);
    case "symbol": {
      return getCountableChargeLabel(charge.chargeId, charge.count);
    }
  }
}
