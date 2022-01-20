import { ChargeModel } from "@/model/charge";
import { getChargeNoun } from "@/service/ChargeService";
import { crossToLabel } from "./CrossTextGen";
import { stripToLabel } from "./StripTextGen";
import { NominalGroup, NominalGroupBuilder } from "../util";

export async function chargeToLabel(
  charge: ChargeModel
): Promise<NominalGroup> {
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
): Promise<NominalGroup> {
  const noun = await getChargeNoun(chargeId);
  const builder = new NominalGroupBuilder(noun, count);
  return builder.build();
}
