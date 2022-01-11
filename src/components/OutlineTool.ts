import { MyOption } from "@/service/MyOptions.type";

export const STRAIGHT_OPTION_ID = "__straight__";

export function getStraightOption(): MyOption {
  return {
    label: "Droit",
    id: STRAIGHT_OPTION_ID,
  };
}
