import { ChargeCross } from "@/generator/model.type";
import { createCross } from "../shape/cross.factory";
import { SvgBuilder } from "../svg/SvgBuilder";
import { FieldShape } from "../type";

export async function drawCrossCharge(
  builder: SvgBuilder,
  cross: ChargeCross,
  container: FieldShape
): Promise<void> {
  const shape = createCross(cross, container);
  await builder.fill(cross.filler, shape);
}
