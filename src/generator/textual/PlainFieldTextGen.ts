import { ChargeModel } from "@/model/charge";
import { BorderModel, PlainFieldModel } from "@/model/field";
import { chargeToLabel } from "./charge/ChargeTextGen";
import { NominalGroupBuilder } from "./util";
import { addFiller } from "./filler/FillerTextGen";
import { getNoun } from "@/service/FrenchService";

export async function plainFieldToLabel(
  model: PlainFieldModel
): Promise<string> {
  if (!model) {
    return "[?]";
  }

  const builder = new NominalGroupBuilder("", true, false);

  await addFiller(model.filler, builder);

  if (model.charges.length > 0) {
    builder.addText(await _chargeList(model.charges));
  }

  if (model.border) {
    const border = await _border(model.border);
    builder.addText(border.label);
  }

  return builder.label;
}

async function _border(model: BorderModel): Promise<NominalGroupBuilder> {
  const noun = getNoun("bordure");
  const builder = NominalGroupBuilder.fromNoun(noun);
  await addFiller(model.filler, builder);
  return builder;
}

async function _chargeList(charges: ChargeModel[]): Promise<string> {
  const chargeLabels = await Promise.all(
    charges.map((item) => _singleCharge(item))
  );
  return chargeLabels.map((builder) => builder.label).join(", ");
}

async function _singleCharge(
  charge: ChargeModel
): Promise<NominalGroupBuilder> {
  const builder = await chargeToLabel(charge);
  await addFiller(charge.filler, builder);
  return builder;
}
