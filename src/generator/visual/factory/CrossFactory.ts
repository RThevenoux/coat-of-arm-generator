import { createPal, createFasce, createDiagonal } from "./StripFactory";

export default function createCross(
  bounds: paper.Rectangle,
  rotate: boolean
): paper.PathItem {
  if (rotate) {
    const diagonal1 = createDiagonal(bounds, true);
    const diagonal2 = createDiagonal(bounds, false);
    return diagonal1.unite(diagonal2);
  } else {
    const pal = createPal(bounds);
    const fasce = createFasce(bounds);
    return pal.unite(fasce);
  }
}
