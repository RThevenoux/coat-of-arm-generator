import { ChargeStrip } from "../../model/charge";

export function stripToLabel(strip: ChargeStrip): string {
  switch (strip.direction) {
    case "fasce":
      return _fasce(strip);
    case "barre":
      return _barre(strip);
    case "pal":
      return _pal(strip);
    case "bande":
      return _bande(strip);
    default:
      return "strip:" + strip.direction;
  }
}

function _fasce(strip: ChargeStrip): string {
  switch (strip.size) {
    case "gemel": {
      if (strip.count == 1) {
        return "aux jumelles";
      } else {
        return `aux ${strip.count} jumelles`;
      }
    }
    case "triplet": {
      if (strip.count == 1) {
        return "aux tierces";
      } else {
        return `aux ${strip.count} tierces`;
      }
    }
    case "default": {
      if (strip.count == 1) {
        return "à la fasce";
      } else if (strip.count < 5) {
        return `aux ${strip.count} fasces`;
      } else if (strip.count % 2 == 0) {
        return `aux ${strip.count} burelles`;
      } else {
        return `aux ${strip.count} trangles`;
      }
    }
    case "reduced":
      if (strip.count == 1) {
        return "à la divise";
      } else if (strip.count % 2 == 0) {
        return `aux ${strip.count} burelles`;
      } else {
        return `aux ${strip.count} trangles`;
      }
    case "minimal": {
      if (strip.count == 1) {
        return "au filet";
      } else {
        return `aux ${strip.count} filets`;
      }
    }
  }
}

function _barre(strip: ChargeStrip): string {
  switch (strip.size) {
    case "gemel": {
      if (strip.count == 1) {
        return "aux jumelles en barre";
      } else {
        return `aux ${strip.count} jumelles en barre`;
      }
    }
    case "triplet": {
      if (strip.count == 1) {
        return "aux tierces en barre";
      } else {
        return `aux ${strip.count} tierces en barre`;
      }
    }
    case "default":
      if (strip.count == 1) {
        return "à la barre";
      } else if (strip.count < 5) {
        return `aux ${strip.count} barres`;
      } else {
        return `aux ${strip.count} traverses`;
      }
    case "reduced":
      if (strip.count == 1) {
        return "à la traverse";
      } else {
        return `aux ${strip.count} traverses`;
      }
    case "minimal": {
      if (strip.count == 1) {
        return "au filet en barre";
      } else {
        return `aux ${strip.count} filets en barre`;
      }
    }
  }
}

function _pal(strip: ChargeStrip): string {
  switch (strip.size) {
    case "gemel": {
      if (strip.count == 1) {
        return "aux jumelles en pal";
      } else {
        return `aux ${strip.count} jumelles en pal`;
      }
    }
    case "triplet": {
      if (strip.count == 1) {
        return "aux tierces en pal";
      } else {
        return `aux ${strip.count} tierces en pal`;
      }
    }
    case "default":
      if (strip.count == 1) {
        return "au pal";
      } else if (strip.count < 5) {
        return `aux ${strip.count} pals`;
      } else {
        return `aux ${strip.count} vergettes`;
      }
    case "reduced":
      if (strip.count == 1) {
        return "à la vergette";
      } else {
        return `aux ${strip.count} vergettes`;
      }
    case "minimal": {
      if (strip.count == 1) {
        return "au filet en pal";
      } else {
        return `aux ${strip.count} filets en pal`;
      }
    }
  }
}

function _bande(strip: ChargeStrip): string {
  switch (strip.size) {
    case "gemel": {
      if (strip.count == 1) {
        return "aux jumelles en bande";
      } else {
        return `aux ${strip.count} jumelles en bande`;
      }
    }
    case "triplet": {
      if (strip.count == 1) {
        return "aux tierces en bande";
      } else {
        return `aux ${strip.count} tierces en bande`;
      }
    }
    case "default":
      if (strip.count == 1) {
        return "à la bande";
      } else if (strip.count < 5) {
        return `aux ${strip.count} bandes`;
      } else {
        return `aux ${strip.count} cotices`;
      }
    case "reduced":
      if (strip.count == 1) {
        return "à la cotice";
      } else {
        return `aux ${strip.count} cotices`;
      }
    case "minimal": {
      if (strip.count == 1) {
        return "au bâton";
      } else {
        return `aux ${strip.count} bâtons`;
      }
    }
  }
}
