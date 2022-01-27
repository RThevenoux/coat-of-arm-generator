import { ChargeCross } from "@/model/charge";
import { getNoun } from "@/service/FrenchService";
import { DisplayId, getDisplayAdjective, NominalGroupBuilder } from "../util";

export function crossToLabel(cross: ChargeCross): NominalGroupBuilder {
  const data = _getData(cross);
  const builder = NominalGroupBuilder.fromNoun(getNoun(data.noun));
  if (data.display) {
    const display = getDisplayAdjective(data.display);
    builder.addAdjective(display);
  }
  return builder;
}

function _getData(cross: ChargeCross): { noun: string; display?: DisplayId } {
  switch (cross.size) {
    case "default":
      return { noun: cross.diagonal ? "sautoir" : "croix" };
    case "reduced": {
      if (!cross.diagonal) {
        return { noun: "estrez" };
      }
    }
    // falls through minimal if cross.diagonal = true
    case "minimal":
      return { noun: "filet", display: cross.diagonal ? "sautoir" : "croix" };
  }
}
