import { getPal, getFasce, getDiagonal } from './strip-drawer';

export default function getCross(bounds, rotate) {
  if (rotate) {
    let diagonal1 = getDiagonal(bounds, true);
    let diagonal2 = getDiagonal(bounds, false);
    return diagonal1.unite(diagonal2);
  } else {
    let pal = getPal(bounds);
    let fasce = getFasce(bounds);
    return pal.unite(fasce);
  }
}