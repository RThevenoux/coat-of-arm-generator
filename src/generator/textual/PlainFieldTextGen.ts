import { ChargeModel } from "@/model/charge";
import { BorderModel, PlainFieldModel } from "@/model/field";
import { chargeToLabel } from "./charge/ChargeTextGen";
import { NominalGroup } from "./util";
import { fillerToLabel } from "./filler/FillerTextGen";

export async function plainFieldToLabel(
  model: PlainFieldModel
): Promise<string> {
  if (!model) {
    return "[?]";
  }

  const nominalGroup: NominalGroup = {
    label: "",
    masculine: true,
    plural: false,
  };
  const fillerLabel = await fillerToLabel(model.filler, nominalGroup);

  let label = `${nominalGroup.label} ${fillerLabel}`;

  if (model.charges.length > 0) {
    label += ` ${await _chargeList(model.charges)}`;
  }

  if (model.border) {
    label += ` ${await _border(model.border)}`;
  }

  return label;
}

async function _border(model: BorderModel): Promise<string> {
  const nominalGroup: NominalGroup = {
    label: "à la bordure",
    masculine: false,
    plural: false,
  };
  const filler = await fillerToLabel(model.filler, nominalGroup);
  return `${nominalGroup.label} ${filler}`;
}

async function _chargeList(charges: ChargeModel[]): Promise<string> {
  const chargeLabels = await Promise.all(
    charges.map((item) => _singleCharge(item))
  );
  return chargeLabels.join(", ");
}

async function _singleCharge(charge: ChargeModel): Promise<string> {
  const nominalGroup = await chargeToLabel(charge);
  const filler = await fillerToLabel(charge.filler, nominalGroup);
  return `${nominalGroup.label} ${filler}`;
}
