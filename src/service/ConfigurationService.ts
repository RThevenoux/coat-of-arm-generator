import { VisualConfModel } from "@/generator/visual/VisualConfModel";
import { getDefaultEscutcheonId } from "./EscutcheonService";

export function defaultVisualConf(): VisualConfModel {
  return {
    escutcheon: getDefaultEscutcheonId(),
    palette: "fr-wikipedia",
    reflect: true,
    border: {
      size: 5,
    },
    defaultStrokeSize: 2,
    outputSize: {
      width: 500,
      height: 500,
    },
  };
}
