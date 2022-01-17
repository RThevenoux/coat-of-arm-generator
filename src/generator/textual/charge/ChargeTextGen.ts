import { ChargeModel } from "@/model/charge";
import { getChargeNoun } from "@/service/ChargeService";
import { crossToLabel } from "./CrossTextGen";
import { stripToLabel } from "./StripTextGen";
import { countableNounToLabel } from "../util";

export interface NominalGroup {
  label: string;
  masculine: boolean;
  plural: boolean;
}

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
  const label = countableNounToLabel(noun, count);
  return { label, masculine: noun.genre == "m", plural: count > 1 };
}
