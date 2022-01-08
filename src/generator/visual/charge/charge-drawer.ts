import { SvgBuilder } from "../svg/SvgBuilder";
import { ChargeModel } from "../../model.type";
import { FieldShape } from "../type";
import { drawCrossCharge } from "./cross-drawer";
import { drawMobileCharge } from "./mobile-drawer";
import { drawStripCharge } from "./strip/strip-drawer";

export async function drawCharge(
  builder: SvgBuilder,
  charge: ChargeModel,
  container: FieldShape
): Promise<void> {
  switch (charge.type) {
    case "strip":
      return drawStripCharge(builder, charge, container);
    case "cross":
      return drawCrossCharge(builder, charge, container);
    case "symbol":
      return drawMobileCharge(builder, charge, container);
    default:
      console.log("-- unsupported charge-type: " + JSON.stringify(charge));
      break;
  }
}
