import { getOutlineInfo } from "@/service/OutlineService";
import * as paper from "paper";
import { ChargeStrip, StripOutline } from "../../model.type";
import { origin, point } from "../tool/point";
import { FieldShape, StripShape } from "../type";
import { HorizontalStripOutline, VerticalStripOutline } from "./Outline.type";
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
  const bounds = container.path.bounds;
  const helper = new StripHelper(model, bounds.height, bounds.y);
  const outline = getHorizontalOutlineData(model.outline);

  return helper.build((yStrip, stripWidth) =>
    createFasce(yStrip, stripWidth, container, outline)
  );
}

function createPals(container: FieldShape, model: ChargeStrip): StripShape[] {
  const bounds = container.path.bounds;
  const helper = new StripHelper(model, bounds.width, bounds.x);
  const outline = getVerticalOutlineData(model.outline);

  return helper.build((xStrip, stripWidth) =>
    createPal(xStrip, stripWidth, container, outline)
  );
}

function createFasce(
  position: number,
  stripWidth: number,
  container: FieldShape,
  outline: HorizontalStripOutline
): StripShape {
  const bounds = container.path.bounds;
  const topLeft = point(bounds.x, position);
  const strip = createHorizontalStripPath(
    topLeft,
    bounds.width,
    stripWidth,
    outline
  );
  const clippedStrip = _clip(strip, container);

  return {
    type: "strip",
    path: clippedStrip,
    root: container.root,
    stripDirection: "fasce",
    stripAngle: 90,
    stripWidth: stripWidth,
    patternAnchor: topLeft,
  };
}

function createPal(
  position: number,
  stripWidth: number,
  container: FieldShape,
  outline: VerticalStripOutline
): StripShape {
  const bounds = container.path.bounds;
  const topLeft = point(position, bounds.y);
  const strip = createVerticalStripPath(
    topLeft,
    stripWidth,
    bounds.height,
    outline
  );
  const clippedStrip = _clip(strip, container);

  return {
    type: "strip",
    path: clippedStrip,
    root: container.root,
    stripDirection: "pal",
    stripAngle: 0,
    stripWidth: stripWidth,
    patternAnchor: topLeft,
  };
}

function createDiagonals(container: FieldShape, model: ChargeStrip) {
  const rotation = computeDiagonalRotation(container, model);

  const clone = container.path.clone();
  clone.rotate(-rotation.angle, rotation.center);

  const bounds = clone.bounds;
  const outline = getVerticalOutlineData(model.outline);

  const helper = new StripHelper(model, bounds.width, bounds.x);

  return helper.build((xStrip, stripWidth) => {
    const stripData = createDiagonalData(
      xStrip,
      stripWidth,
      clone,
      rotation,
      outline
    );
    return createDiagonalShape(
      stripData,
      container,
      stripWidth,
      rotation.angle
    );
  });
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

function createDiagonalData(
  x: number,
  stripWidth: number,
  clone: paper.Path,
  rotation: RotationDef,
  outline: VerticalStripOutline
): {
  stripPath: paper.Path;
  anchor: paper.Point;
} {
  const bounds = clone.bounds;

  const topLeft = point(x, bounds.y);
  const stripPath = createVerticalStripPath(
    topLeft,
    stripWidth,
    bounds.height,
    outline
  );

  stripPath.rotate(rotation.angle, rotation.center);
  const anchor = topLeft.rotate(-rotation.angle, rotation.center); // Not clear why rotation must be negate...

  return { stripPath, anchor };
}

function createDiagonalShape(
  data: { stripPath: paper.Path; anchor: paper.Point },
  container: FieldShape,
  stripWidth: number,
  angle: number
): StripShape {
  const clippedStrip = _clip(data.stripPath, container);

  return {
    type: "strip",
    path: clippedStrip,
    root: container.root,
    stripDirection: angle > 0 ? "barre" : "bande",
    stripAngle: angle,
    stripWidth: stripWidth,
    patternAnchor: data.anchor,
  };
}
interface RotationDef {
  angle: number;
  center: paper.Point;
}

function _clip(path: paper.Path, container: FieldShape): paper.PathItem {
  return container.path.intersect(path);
}

function createHorizontalStripPath(
  topLeft: paper.Point,
  stripWidth: number,
  stripHeight: number,
  outline: HorizontalStripOutline
): paper.Path {
  const topPath = createOutline(stripWidth, stripHeight, outline.top);
  topPath.translate(topLeft);

  const bottomPath = createOutline(stripWidth, stripHeight, outline.bottom);
  bottomPath.scale(1, -1, origin());
  bottomPath.reverse();
  bottomPath.translate(point(topLeft.x, topLeft.y + stripHeight));

  const path = new paper.Path();
  path.addSegments(topPath.segments);
  path.addSegments(bottomPath.segments);
  path.closePath();

  return path;
}

function createVerticalStripPath(
  topLeft: paper.Point,
  stripWidth: number,
  stripHeight: number,
  outline: VerticalStripOutline
): paper.Path {
  const rightPath = createOutline(stripHeight, stripWidth, outline.right);
  rightPath.rotate(90, origin());
  rightPath.translate(point(topLeft.x + stripWidth, topLeft.y));

  const leftPath = createOutline(stripHeight, stripWidth, outline.left);
  leftPath.scale(1, -1, origin());
  leftPath.reverse();
  leftPath.rotate(90, origin());
  leftPath.translate(topLeft);

  const path = new paper.Path();
  path.addSegments(rightPath.segments);
  path.addSegments(leftPath.segments);
  path.closePath();

  return path;
}

function getVerticalOutlineData(model: StripOutline): VerticalStripOutline {
  switch (model.type) {
    case "simple": {
      const info = getOutlineInfo(model.outline);
      return {
        left: info,
        right: info,
      };
    }
    case "double":
      return {
        left: getOutlineInfo(model.outline1),
        right: getOutlineInfo(model.outline2),
      };
    case "straight":
    default:
      return {
        left: { type: "straight" },
        right: { type: "straight" },
      };
  }
}

function getHorizontalOutlineData(model: StripOutline): HorizontalStripOutline {
  switch (model.type) {
    case "simple": {
      const info = getOutlineInfo(model.outline);
      return {
        top: info,
        bottom: info,
      };
    }
    case "double":
      return {
        top: getOutlineInfo(model.outline1),
        bottom: getOutlineInfo(model.outline2),
      };
    case "straight":
    default:
      return {
        top: { type: "straight" },
        bottom: { type: "straight" },
      };
  }
}
