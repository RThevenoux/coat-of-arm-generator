import { getOutlineAdjective } from "@/service/OutlineService";
import {
  ChargeStrip,
  DoubleStripOutline,
  SimpleStripOutline,
  StripOutline,
} from "@/model/charge";
import { getDisplayAdjective, getPositionAdjective } from "../util";
import { Direction } from "@/model/misc";
import { getAdjective, getNoun } from "@/service/FrenchService";
import { NominalGroupBuilder } from "../util";
import { PositionId } from "@/service/PatternService";

export function stripToLabel(model: ChargeStrip): NominalGroupBuilder {
  const nounInfo = getNounInfo(model);
  const noun = getNoun(nounInfo.nounId);

  const forcePlural = model.size == "gemel" || model.size == "triplet";
  const options = {
    contractedPrepositionIfPlural: true,
    forcePlural,
  };

  const builder = NominalGroupBuilder.fromNoun(noun, model.count, options);

  if (nounInfo.direction) {
    builder.addAdjective(getDisplayAdjective(nounInfo.direction));
  }

  if (model.outline) {
    addOutline(builder, model.outline, model.direction);
  }
  return builder;
}

function addOutline(
  builder: NominalGroupBuilder,
  outline: StripOutline,
  direction: Direction
): void {
  switch (outline.type) {
    case "simple":
      return addSimpleOutline(builder, outline);
    case "double":
      return addDoubleOutline(builder, outline, direction);
    case "gemelPotented":
      return addGemelPotentedOutlin(builder);
  }
}

function addSimpleOutline(
  builder: NominalGroupBuilder,
  outline: SimpleStripOutline
): void {
  const adjective = getOutlineAdjective(outline.outlineId);
  if (outline.shifted) {
    builder.addPatternAdjective("{0} et contre-{0}", [adjective]);
  } else {
    builder.addAdjective(adjective);
  }
}

function addDoubleOutline(
  builder: NominalGroupBuilder,
  outline: DoubleStripOutline,
  direction: Direction
): void {
  if (outline.outlineId1) {
    const position = getOutline1Position(direction);

    const outlineAdjective = getOutlineAdjective(outline.outlineId1, position);
    builder.addAdjective(outlineAdjective);

    const positionAdjective = getPositionAdjective(position);
    builder.addAdjective(positionAdjective);
  }

  if (outline.outlineId2) {
    const position = getOutline2Position(direction);

    const outlineAdjective = getOutlineAdjective(outline.outlineId2, position);
    builder.addAdjective(outlineAdjective);

    const positionAdjective = getPositionAdjective(position);
    builder.addAdjective(positionAdjective);
  }
}

function getOutline1Position(direction: Direction): PositionId {
  switch (direction) {
    case "bande":
      return "chef";
    case "barre":
      return "pointe";
    case "fasce":
      return "pointe";
    case "pal":
      return "senestre";
  }
}

function getOutline2Position(direction: Direction): PositionId {
  switch (direction) {
    case "bande":
      return "pointe";
    case "barre":
      return "chef";
    case "fasce":
      return "chef";
    case "pal":
      return "dextre";
  }
}

function addGemelPotentedOutlin(builder: NominalGroupBuilder): void {
  const adjective = getAdjective("potence");
  builder.addPatternAdjective("{0} et contre-{0}", [adjective]);
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
