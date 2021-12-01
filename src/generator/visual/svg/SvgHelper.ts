import { ChargeVisualInfo } from "@/service/visual.type";
import xmlbuilder, { XMLElement } from "xmlbuilder";
import { PatternTransform, SvgStyle } from "./svg.type";

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
    pattern.att("x", transform.x);
    pattern.att("y", transform.y);
    pattern.att("patternTransform", transform.transform);
  }

  return pattern;
}

export function addUse(
  parentNode: XMLElement,
  refId: string,
  style?: SvgStyle,
  transform?: string
): XMLElement {
  const use = parentNode.ele("use").att("href", `#${refId}`);
  addStyle(use, style);
  if (transform) {
    use.att("transform", transform);
  }
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

export function svgTranslate(tx: number, ty: number): string {
  return `translate(${tx},${ty})`;
}

// rotation : in degree and clockwise
export function svgTransform(scaleCoef: number, rotation?: number): string {
  let result = "";

  if (scaleCoef != 1) {
    result += `scale(${scaleCoef},${scaleCoef})`;
  }

  if (rotation && rotation != 0) {
    result += `rotate(${rotation})`;
  }

  return result;
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
