import xmlbuilder, { XMLElement } from "xmlbuilder";
import {
  PatternTransform,
  SvgStyle,
  Transform,
  TransformList,
} from "./svg.type";

export function createSVG(): XMLElement {
  return xmlbuilder
    .create("svg", { headless: true })
    .att("xmlns", "http://www.w3.org/2000/svg");
}

export function addViewBoxAndDimensions(
  node: XMLElement,
  viewBox: { x?: number; y?: number; width: number; height: number }
): XMLElement {
  return addViewBox(node, viewBox)
    .att("width", viewBox.width)
    .att("height", viewBox.height);
}

export function addViewBox(
  node: XMLElement,
  viewBox: { x?: number; y?: number; width: number; height: number }
): XMLElement {
  const x = viewBox.x ? viewBox.x : 0;
  const y = viewBox.y ? viewBox.y : 0;

  return node.att("viewBox", `${x} ${y} ${viewBox.width} ${viewBox.height}`);
}

export function createGroup(parent: XMLElement): XMLElement {
  return parent.ele("g");
}

export function addRadialGradient(
  parentNode: XMLElement,
  id: string,
  cx: number,
  cy: number,
  radius: number
): XMLElement {
  return parentNode
    .ele("radialGradient")
    .att("id", id)
    .att("gradientUnits", "userSpaceOnUse")
    .att("cx", cx)
    .att("cy", cy)
    .att("r", radius);
}

export function addGradientStop(
  gradient: XMLElement,
  offset: number,
  color: string,
  opacity: number
): XMLElement {
  return gradient
    .ele("stop")
    .att("style", `stop-color:${color};stop-opacity:${opacity}`)
    .att("offset", offset);
}

export function addPattern(
  parentNode: XMLElement,
  id: string,
  width: number,
  height: number,
  transform?: PatternTransform
): XMLElement {
  const pattern = parentNode
    .ele("pattern")
    .att("id", id)
    .att("width", width)
    .att("height", height)
    .att("patternUnits", "userSpaceOnUse");

  if (transform) {
    const transformValue = transformListToString(transform.transformList);
    pattern.att("x", transform.x);
    pattern.att("y", transform.y);
    pattern.att("patternTransform", transformValue);
  }

  return pattern;
}

export function addUse(
  parentNode: XMLElement,
  refId: string,
  style?: SvgStyle,
  transform?: TransformList
): XMLElement {
  const use = parentNode.ele("use").att("href", `#${refId}`);
  addStyle(use, style);
  addTransform(use, transform);
  return use;
}

export function addPath(
  parentNode: XMLElement,
  pathData: string,
  style?: SvgStyle,
  id?: string
): XMLElement {
  const path = parentNode.ele("path").att("d", pathData);
  addStyle(path, style);
  if (id) {
    path.att("id", id);
  }
  return path;
}

export function addRectangle(
  parentNode: XMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  style?: SvgStyle
): XMLElement {
  const rect = parentNode
    .ele("rect")
    .att("x", x)
    .att("y", y)
    .att("width", width)
    .att("height", height);

  addStyle(rect, style);

  return rect;
}

export function addSymbol(
  parentNode: XMLElement,
  symbolId: string
): XMLElement {
  return parentNode.ele("symbol").att("id", symbolId);
}

export function addClipPath(
  parentNode: XMLElement,
  clipPathId: string,
  pathData: string
): XMLElement {
  const node = parentNode.ele("clipPath").att("id", clipPathId);
  addPath(node, pathData);
  return node;
}

export function addClipPathAttribute(
  node: XMLElement,
  clipPathId: string
): void {
  node.att("clip-path", `url(#${clipPathId})`);
}

export function svgTranslate(tx: number, ty: number): string {
  return `translate(${tx},${ty})`;
}

export function addStyle(node: XMLElement, style?: SvgStyle): void {
  if (style?.fillerId) {
    node.att("fill", `url(#${style.fillerId})`);
  }

  if (style?.color || style?.strokeWidth) {
    let styleValue = "";
    if (style.color) {
      styleValue += `fill:${style.color};`;
    }
    if (style.strokeWidth && style.strokeWidth > 0) {
      styleValue += `stroke:black;stroke-width:${style.strokeWidth}px;`;
    }

    node.att("style", styleValue);
  }
}

export function addTransform(
  node: XMLElement,
  transform?: TransformList
): void {
  if (transform) {
    const transformValue = transformListToString(transform);
    node.att("transform", transformValue);
  }
}

function transformListToString(transforms: TransformList): string {
  return transforms.map((t) => transformToString(t)).join(" ");
}

function transformToString(transform: Transform): string {
  switch (transform.type) {
    case "rotate":
      return `rotate(${transform.angle})`;
    case "scale":
      return `scale(${transform.sx},${
        transform.sy ? transform.sy : transform.sx
      })`;
    case "translate":
      return `translate(${transform.tx},${transform.ty})`;
    default:
      throw new Error("Unsupported tranfrom " + JSON.stringify(transform));
  }
}
