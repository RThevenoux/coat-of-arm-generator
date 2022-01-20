import { ChargeModel } from "@/model/charge";
import { getChargeNoun } from "@/service/ChargeService";
import { crossToLabel } from "./CrossTextGen";
import { stripToLabel } from "./StripTextGen";
import { NominalGroupBuilder } from "../util";

export async function chargeToLabel(
  charge: ChargeModel
): Promise<NominalGroupBuilder> {
  switch (charge.type) {
    case "strip":
      return stripToLabel(charge);
    case "cross":
      return crossToLabel(charge);
    case "symbol": {
      return await getCountableChargeLabel(charge.chargeId, charge.count);
    }
  }
}

async function getCountableChargeLabel(
  chargeId: string,
  count: number
): Promise<NominalGroupBuilder> {
  const noun = await getChargeNoun(chargeId);
  return NominalGroupBuilder.fromNoun(noun, count);
}
