import { ChargeTextualInfo, LabelInfo } from "../../service/textual.type";
import { getChargeTextualInfo } from "../../service/ChargeService";

export { getCountableChargeLabel, getSemeLabelInfo };

async function getCountableChargeLabel(
  chargeId: string,
  count: number
): Promise<string> {
  const chargeDef = await getChargeTextualInfo(chargeId);

  if (count > 1) {
    return `à ${count} ${chargeDef.plural}`;
  }

  if (chargeDef.elision) {
    return `à l'${chargeDef.one}`;
  }

  if (chargeDef.genre == "m") {
    return `au ${chargeDef.one}`;
  }

  return `à la ${chargeDef.one}`;
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
