import { SvgBuilder } from "../svg/SvgBuilder";

export function createDefaultFiller(builder: SvgBuilder): string {
  const size = 50;
  const half = size / 2;

  const pattern = builder.createPattern(size, size);

  pattern.addRectangle(0, 0, size, size, { rawColor: "white" });
  pattern.addRectangle(half, 0, half, half, { rawColor: "grey" });
  pattern.addRectangle(0, half, half, half, { rawColor: "grey" });

  return pattern.id;
}
