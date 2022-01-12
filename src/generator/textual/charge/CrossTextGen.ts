import { ChargeCross } from "@/model/charge";

export function crossToLabel(cross: ChargeCross): string {
  switch (cross.direction) {
    case "pal":
    case "fasce":
      return _straight(cross);
    case "barre":
    case "bande":
      return _diagonal(cross);
    default:
      return "cross:" + cross.direction;
  }
}

function _straight(cross: ChargeCross): string {
  switch (cross.size) {
    case "default":
      return "à la croix";
    case "reduced":
      return "à l'estrez";
    case "minimal":
      return "au filet en croix";
  }
}

function _diagonal(cross: ChargeCross): string {
  switch (cross.size) {
    case "default":
      return "au sautoir";
    case "reduced":
    case "minimal":
      return "au filet en sautoir";
  }
}
