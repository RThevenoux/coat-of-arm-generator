import { ChargeCross } from "@/model/charge";
import { NominalGroup } from "../util";

export function crossToLabel(cross: ChargeCross): NominalGroup {
  if (cross.diagonal) {
    return _diagonal(cross);
  } else {
    return _straight(cross);
  }
}

function _straight(cross: ChargeCross): NominalGroup {
  switch (cross.size) {
    case "default":
      return { label: "à la croix", masculine: false, plural: false };
    case "reduced":
      return { label: "à l'estrez", masculine: true, plural: false };
    case "minimal":
      return { label: "au filet en croix", masculine: true, plural: false };
  }
}

function _diagonal(cross: ChargeCross): NominalGroup {
  switch (cross.size) {
    case "default":
      return { label: "au sautoir", masculine: true, plural: false };
    case "reduced":
    case "minimal":
      return { label: "au filet en sautoir", masculine: true, plural: false };
  }
}
