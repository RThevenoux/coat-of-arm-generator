import { ChargeTextualInfo, LabelInfo } from "../../service/textual.type";
import { getChargeTextualInfo } from "../../service/ChargeService";
import { countableChargeToLabel } from "./util";

export { getCountableChargeLabel, getSemeLabelInfo };

async function getCountableChargeLabel(
  chargeId: string,
  count: number
): Promise<string> {
  const chargeDef = await getChargeTextualInfo(chargeId);
  return countableChargeToLabel(chargeDef, count);
}

async function getSemeLabelInfo(chargeId: string): Promise<LabelInfo> {
  const chargeDef = await getChargeTextualInfo(chargeId);

  if (chargeDef.seme) {
    return chargeDef.seme;
  }

  return {
    type: "simple",
    label: "semé " + _uncountable(chargeDef),
  };
}

function _uncountable(chargeDef: ChargeTextualInfo): string {
  if (chargeDef.elision) {
    return `d'${chargeDef.plural}`;
  } else {
    return `de ${chargeDef.plural}`;
  }
}
