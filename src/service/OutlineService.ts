import { MyOption } from "./MyOptions.type";

export function getOutlineOptions(): MyOption[] {

  return [
    { label: "Droit", id: "straight" },
    { label: "Crénelé", id: "square" },
    { label: "Dentelé", id: "triangle" },
    { label: "test _/\\_", id: "remi" }
  ];
}