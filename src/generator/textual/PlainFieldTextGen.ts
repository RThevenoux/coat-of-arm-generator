import { ChargeModel } from "@/model/charge";
import { BorderModel, PlainFieldModel } from "@/model/field";
import { chargeToLabel } from "./charge/ChargeTextGen";
import { fillerToLabel } from "./filler/FillerTextGen";

export async function plainFieldToLabel(
  model: PlainFieldModel
): Promise<string> {
  if (!model) {
    return "[?]";
  }

  let label = await fillerToLabel(model.filler, true, false);

  if (model.charges.length > 0) {
    label += ` ${await _chargeList(model.charges)}`;
  }

  if (model.border) {
    label += ` ${await _border(model.border)}`;
  }

  return label;
}

async function _border(model: BorderModel): Promise<string> {
  const filler = await fillerToLabel(model.filler, false, false);
  return `à la bordure ${filler}`;
}

async function _chargeList(charges: ChargeModel[]): Promise<string> {
  const chargeLabels = await Promise.all(
    charges.map((item) => _singleCharge(item))
  );
  return chargeLabels.join(", ");
}

async function _singleCharge(charge: ChargeModel): Promise<string> {
  const nominalGroup = await chargeToLabel(charge);
  const masculine = nominalGroup.masculine;
  const plural = nominalGroup.plural;
  const filler = await fillerToLabel(charge.filler, masculine, plural);
  return `${nominalGroup.label} ${filler}`;
}
