import { FillerSeme } from "@/model/filler";
import { getChargeSemeInfo } from "@/service/ChargeService";
import { getColorAdjective } from "@/service/ColorService";
import { getAdjective } from "@/service/FrenchService";
import { FrenchNoun, LabelInfo } from "@/service/textual.type";
import { uncountableNounToLabel, NominalGroupBuilder } from "../util";
import { _matchColors } from "./util";

export async function addFillerSeme(
  model: FillerSeme,
  builder: NominalGroupBuilder
): Promise<void> {
  const semeInfo = await getChargeSemeInfo(model.chargeId);
  if (semeInfo.type == "custom") {
    _custom(builder, model, semeInfo.custom);
  } else {
    _useNoun(builder, model, semeInfo.noun);
  }
}

function _custom(
  builder: NominalGroupBuilder,
  model: FillerSeme,
  custom: LabelInfo<string>
): void {
  const result = _matchColors(custom, model.fieldColor, model.chargeColor);

  const adjectiveId = result.value;
  const adjective = getAdjective(adjectiveId);

  if (result.matchColors) {
    builder.addAdjective(adjective);
  } else {
    const color1 = getColorAdjective(model.fieldColor);
    const color2 = getColorAdjective(model.chargeColor);
    builder.addAdjective(color1).addAdjective(adjective).addAdjective(color2);
  }
}

function _useNoun(
  builder: NominalGroupBuilder,
  model: FillerSeme,
  noun: FrenchNoun
): void {
  const color1 = getColorAdjective(model.fieldColor);
  const color2 = getColorAdjective(model.chargeColor);

  const semeAdjective = getAdjective("seme");
  builder
    .addAdjective(color1)
    .addAdjective(semeAdjective)
    .addText(uncountableNounToLabel(noun))
    .addAdjective(color2);
}
