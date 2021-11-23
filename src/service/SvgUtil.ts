export function toVersionOneOne(svg: string): string {
  // Quick and dirty replace to match Svg 1.1
  // Inskcape do not (yet) support "href"
  return svg.replaceAll(" href", " xlink:href");
}
