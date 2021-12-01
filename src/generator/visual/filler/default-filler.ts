import SvgBuilder from "../svg/SvgBuilder";

export function createDefaultFiller(builder: SvgBuilder): string {
  const size = 50;
  const half = size / 2;
  const color1 = "white";
  const color2 = "grey";

  const pattern = builder.createPattern(size, size);

  pattern.addRectangleRawColor(0, 0, size, size, color1);
  pattern.addRectangleRawColor(half, 0, half, half, color2);
  pattern.addRectangleRawColor(0, half, half, half, color2);

  return pattern.id;
}
