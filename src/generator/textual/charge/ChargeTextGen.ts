import { ChargeModel } from "@/model/charge";
import { getChargeTextualInfo } from "@/service/ChargeService";
import { crossToLabel } from "./CrossTextGen";
import { stripToLabel } from "./StripTextGen";
import { countableChargeToLabel } from "../util";

export async function chargeToLabel(charge: ChargeModel): Promise<string> {
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

export async function getCountableChargeLabel(
  chargeId: string,
  count: number
): Promise<string> {
  const chargeDef = await getChargeTextualInfo(chargeId);
  return countableChargeToLabel(chargeDef, count);
}
