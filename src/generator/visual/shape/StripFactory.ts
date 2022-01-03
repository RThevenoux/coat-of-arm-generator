import { getOutlineInfo } from "@/service/OutlineService";
import * as paper from "paper";
import { ChargeStrip, StripOutline } from "../../model.type";
import { origin, point } from "../tool/point";
import { FieldShape, StripShape } from "../type";
import { RotationDef, StripeOutlineData } from "./StripFactoryData.type";
import { createOutline } from "./OutlineFactory";
import { StripHelper } from "./StripHelper";

export function createStrips(
  strip: ChargeStrip,
  container: FieldShape
): StripShape[] {
  switch (strip.direction) {
    case "fasce":
      return createFasces(container, strip);
    case "pal":
      return createPals(container, strip);
    case "bande":
    case "barre":
      return createDiagonals(container, strip);
    default:
      console.log("invalid angle " + strip.direction);
      return [];
  }
}

function createFasces(container: FieldShape, model: ChargeStrip): StripShape[] {
  const helper = new StripHelper(model, container, "fasce");

  const outline = getStripOutlineData(model.outline);
  const stripPattern = createHorizontalStripPath(
    helper.stripLength,
    helper.stripWidth,
    outline
  );

  return helper.build(stripPattern);
}

function createPals(container: FieldShape, model: ChargeStrip): StripShape[] {
  const helper = new StripHelper(model, container, "pal");

  const outline = getStripOutlineData(model.outline);
  const stripPattern = createVerticalStripPath(
    helper.stripWidth,
    helper.stripLength,
    outline
  );

  return helper.build(stripPattern);
}

function createDiagonals(container: FieldShape, model: ChargeStrip) {
  const rotation = computeDiagonalRotation(container, model);

  const helper = new StripHelper(model, container, rotation);

  const outline = getStripOutlineData(model.outline);
  const stripPattern = createVerticalStripPath(
    helper.stripWidth,
    helper.stripLength,
    outline
  );

  return helper.build(stripPattern);
}

function computeDiagonalRotation(
  container: FieldShape,
  model: ChargeStrip
): RotationDef {
  const path = container.path;

  const angleRad = Math.atan2(path.bounds.height, path.bounds.width);
  const angleDeg = (angleRad * 180) / Math.PI;
  const angle = model.direction == "barre" ? 90 - angleDeg : angleDeg - 90;
  const center = origin();
  return { angle, center };
}

function createHorizontalStripPath(
  stripWidth: number,
  stripHeight: number,
  outline: StripeOutlineData
): paper.Path {
  const topPath = createOutline(
    stripWidth,
    stripHeight,
    outline.outline1,
    false
  );

  const bottomPath = createOutline(
    stripWidth,
    stripHeight,
    outline.outline2,
    outline.outline2Shifted
  );
  bottomPath.scale(1, -1, origin());
  bottomPath.reverse();
  bottomPath.translate(point(0, stripHeight));

  const path = new paper.Path();
  path.join(topPath);
  path.lineTo(bottomPath.firstCurve.point1);
  path.join(bottomPath);
  path.lineTo(topPath.firstCurve.point1);
  path.closePath();

  return path.reduce({});
}

function createVerticalStripPath(
  stripWidth: number,
  stripHeight: number,
  outline: StripeOutlineData
): paper.Path {
  const path = createHorizontalStripPath(stripHeight, stripWidth, outline);
  path.rotate(90, origin());
  path.translate(point(stripWidth, 0));
  return path.reduce({});
}

function getStripOutlineData(model: StripOutline): StripeOutlineData {
  switch (model.type) {
    case "simple": {
      const info = getOutlineInfo(model.outline);
      const defaultReversed =
        info.type == "pattern" ? info.reverseShifted : false;
      const outline2Shifted = model.shifted != defaultReversed; // XOR
      // shifted => true if :
      // - model.shifted=true  && defaultReversed=false
      // - model.shifted=false && defaultReversed=true

      return {
        outline1: info,
        outline2: info,
        outline2Shifted,
      };
    }
    case "double":
      return {
        outline1: getOutlineInfo(model.outline1),
        outline2: getOutlineInfo(model.outline2),
        outline2Shifted: false,
      };
    case "straight":
    default:
      return {
        outline1: { type: "straight" },
        outline2: { type: "straight" },
        outline2Shifted: false,
      };
  }
}
