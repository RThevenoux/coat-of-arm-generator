import { getOutlineAdjective } from "@/service/OutlineService";
import { ChargeStrip } from "@/model/charge";
import { directionToLabel } from "../util";
import { Direction } from "@/model/misc";
import { getAdjective, getNoun } from "@/service/FrenchService";
import { NominalGroup, NominalGroupBuilder } from "../util";

export function stripToLabel(model: ChargeStrip): NominalGroup {
  const nounInfo = getNounInfo(model);
  const noun = getNoun(nounInfo.nounId);

  const forcePlural = model.size == "gemel" || model.size == "triplet";
  const options = {
    contractedPrepositionIfPlural: true,
    forcePlural,
  };

  const builder = new NominalGroupBuilder(noun, model.count, options);

  if (nounInfo.direction) {
    builder.addText(directionToLabel(nounInfo.direction));
  }

  if (model.outline) {
    switch (model.outline.type) {
      case "simple":
        {
          const adjective = getOutlineAdjective(model.outline.outlineId);
          if (model.outline.shifted) {
            builder.addPatternAdjective("{0} et contre-{0}", [adjective]);
          } else {
            builder.addAdjective(adjective);
          }
        }
        break;
      case "double":
        {
          builder.addText("[double-outline]");
        }
        break;
      case "gemelPotented":
        {
          const adjective = getAdjective("potence");
          builder.addPatternAdjective("{0} et contre-{0}", [adjective]);
        }
        break;
    }
  }
  return builder.build();
}

function getNounInfo(strip: ChargeStrip): {
  nounId: string;
  direction?: Direction;
} {
  if (strip.size == "gemel") {
    const direction = strip.direction == "fasce" ? undefined : strip.direction;
    return { nounId: "jumelle", direction };
  }

  if (strip.size == "triplet") {
    const direction = strip.direction == "fasce" ? undefined : strip.direction;
    return { nounId: "tierce", direction };
  }

  switch (strip.direction) {
    case "fasce":
      switch (strip.size) {
        case "default":
          if (strip.count < 5) {
            return { nounId: "fasce" };
          } else {
            return { nounId: strip.count % 2 == 0 ? "burelle" : "trangle" };
          }
        case "reduced":
          if (strip.count == 1) {
            return { nounId: "divise" };
          } else {
            return { nounId: strip.count % 2 == 0 ? "burelle" : "trangle" };
          }
        case "minimal":
          return { nounId: "filet" };
      }
    // falls through unreachable
    case "barre":
      switch (strip.size) {
        case "default":
          return { nounId: strip.count < 5 ? "barre" : "traverse" };
        case "reduced":
          return { nounId: "traverse" };
        case "minimal":
          return { nounId: "filet", direction: "barre" };
      }
    // falls through unreachable
    case "pal":
      switch (strip.size) {
        case "default":
          return { nounId: strip.count < 5 ? "pal" : "vergette" };
        case "reduced":
          return { nounId: "vergette" };
        case "minimal":
          return { nounId: "filet", direction: "pal" };
      }
    // falls through unreachable
    case "bande":
      switch (strip.size) {
        case "default":
          return { nounId: strip.count < 5 ? "bande" : "cotice" };
        case "reduced":
          return { nounId: "cotice" };
        case "minimal":
          return { nounId: "baton" };
      }
  }
}
