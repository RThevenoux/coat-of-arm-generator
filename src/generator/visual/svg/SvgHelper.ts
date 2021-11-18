import { ChargeVisualInfo } from "@/service/visual.type";
import xmlbuilder, { XMLElement } from "xmlbuilder";

export function createSVG(): XMLElement {
  return xmlbuilder
    .create("svg", { headless: true })
    .att("xmlns", "http://www.w3.org/2000/svg");
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

export function addSolidGradient(
  parentNode: XMLElement,
  id: string,
  color: string
): XMLElement {
  const gradient = addLinearGradient(parentNode, id);
  gradient.ele("stop").att("stop-color", `${color}`);
  return gradient;
}

function addLinearGradient(parentNode: XMLElement, id: string): XMLElement {
  return parentNode.ele("linearGradient").att("id", id);
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

export interface PatternTransform {
  x: number;
  y: number;
  transform: string;
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
    pattern.att("x", transform.x);
    pattern.att("y", transform.y);
    pattern.att("patternTransform", transform.transform);
  }

  return pattern;
}

export function addUse(
  parentNode: XMLElement,
  refId: string,
  fill?: string,
  style?: string,
  transform?: string
): XMLElement {
  const use = parentNode.ele("use").att("href", `#${refId}`);

  if (fill) {
    use.att("fill", fill);
  }
  if (style) {
    use.att("style", style);
  }
  if (transform) {
    use.att("transform", transform);
  }
  return use;
}

export function addPath(
  parentNode: XMLElement,
  pathData: string,
  id?: string,
  fill?: string,
  style?: string
): XMLElement {
  const path = parentNode.ele("path").att("d", pathData);
  if (id) {
    path.att("id", id);
  }
  if (fill) {
    path.att("fill", fill);
  }
  if (style) {
    path.att("style", style);
  }
  return path;
}

export function addRectangle(
  parentNode: XMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
): XMLElement {
  return parentNode
    .ele("rect")
    .att("x", x)
    .att("y", y)
    .att("width", width)
    .att("height", height)
    .att("style", fillColorStyle(color));
}

export function addSymbol(
  parentNode: XMLElement,
  symbolId: string,
  symbolDef: ChargeVisualInfo
): XMLElement {
  return parentNode
    .ele("symbol")
    .att("id", symbolId)
    .att("width", symbolDef.width)
    .att("height", symbolDef.height)
    .att("viewBox", `0 0 ${symbolDef.width} ${symbolDef.height}`)
    .raw(symbolDef.xml);
}

export function fillColorStyle(color: string): string {
  return `fill:${color};`;
}

export function strokeStyle(width: number): string {
  return `stroke:black;stroke-width:${width}px;`;
}

export function refStyle(refId: string): string {
  return `url(#${refId})`;
}

export function svgTransform(scaleCoef: number, rotation?: number): string {
  let result = "";

  if (scaleCoef != 1) {
    result += `scale(${scaleCoef},${scaleCoef})`;
  }

  if (rotation && rotation != 0) {
    // svg rotation is clockwise
    result += `rotate(${-rotation})`;
  }

  return result;
}
