import { ChargeCross } from "@/model/charge";
import { getNoun } from "@/service/FrenchService";
import { NominalGroupBuilder } from "../util";

export function crossToLabel(cross: ChargeCross): NominalGroupBuilder {
  if (cross.diagonal) {
    return _diagonal(cross);
  } else {
    return _straight(cross);
  }
}

function _straight(cross: ChargeCross): NominalGroupBuilder {
  switch (cross.size) {
    case "default": {
      const noun = getNoun("croix");
      return NominalGroupBuilder.fromNoun(noun);
    }
    case "reduced": {
      const noun = getNoun("estrez");
      return NominalGroupBuilder.fromNoun(noun);
    }
    case "minimal": {
      const noun = getNoun("filet");
      return NominalGroupBuilder.fromNoun(noun).addText("en croix");
    }
  }
}

function _diagonal(cross: ChargeCross): NominalGroupBuilder {
  switch (cross.size) {
    case "default": {
      const noun = getNoun("sautoir");
      return NominalGroupBuilder.fromNoun(noun);
    }
    case "reduced":
    case "minimal": {
      const noun = getNoun("filet");
      return NominalGroupBuilder.fromNoun(noun).addText("en sautoir");
    }
  }
}
