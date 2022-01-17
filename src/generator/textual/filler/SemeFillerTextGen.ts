import { FillerSeme } from "@/model/filler";
import { getChargeSemeInfo } from "@/service/ChargeService";
import { getColorText } from "@/service/ColorService";
import { getAdjective } from "@/service/FrenchService";
import { agreeAdjective, uncountableNounToLabel } from "../util";
import { _matchColors } from "./util";

export async function _seme(
  model: FillerSeme,
  masculine: boolean,
  plural: boolean
): Promise<string> {
  const semeInfo = await getChargeSemeInfo(model.chargeId);

  if (semeInfo.type == "custom") {
    const result = _matchColors(
      semeInfo.custom,
      model.fieldColor,
      model.chargeColor
    );

    const adjectiveId = result.value;
    const adjective = getAdjective(adjectiveId);
    const agreedAdjective = agreeAdjective(adjective, masculine, plural);

    if (result.matchColors) {
      return agreedAdjective;
    } else {
      return _addColors(agreedAdjective, model);
    }
  } else {
    // use-noun
    const adjective = getAdjective("seme");
    const agreedAdjective = agreeAdjective(adjective, masculine, plural);

    const noun = semeInfo.noun;
    const completeAdjectiveGroup = `${agreedAdjective} ${uncountableNounToLabel(
      noun
    )}`;

    return _addColors(completeAdjectiveGroup, model);
  }
}

function _addColors(agreedAdjective: string, model: FillerSeme): string {
  const color1 = getColorText(model.fieldColor);
  const color2 = getColorText(model.chargeColor);
  return `${color1} ${agreedAdjective} ${color2}`;
}
