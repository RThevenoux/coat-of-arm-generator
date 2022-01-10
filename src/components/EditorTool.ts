import {
  ChargeModel,
  FieldModel,
  FillerModel,
  FillerPattern,
  PlainFieldModel,
  StripOutline,
} from "@/generator/model.type";
import { getDefaultChargeId } from "@/service/ChargeService";
import { FieldEditorModel, PlainFieldEditorModel } from "./FieldEditorModel";
import { FillerEditorModel } from "./FillerEditorModel";
import { SingleChargePickerModel } from "./SingleChargePickerModel";
import { StripEditorModel } from "./StripModel";

export async function initialFieldEditorValue(): Promise<FieldEditorModel> {
  return {
    plain: await initialPlain(),
    partitionType: "plain",
    partitions: [],
  };
}

export async function initialChargeModel(): Promise<SingleChargePickerModel> {
  return {
    type: "strip",
    strip: {
      angle: "pal",
      count: 1,
      size: "default",
      filler: await initialFiller(),
      outlineType: "straight",
      outline1: "straight",
      outline2: "straight",
      shifted: false,
    },
    cross: {
      angle: "fasce",
      size: "default",
      filler: await initialFiller(),
    },
    symbol: {
      chargeId: await getDefaultChargeId(),
      count: 1,
      filler: await initialFiller(),
    },
  };
}

async function initialPlain(): Promise<PlainFieldEditorModel> {
  return {
    filler: await initialFiller(),
    border: {
      filler: await initialFiller(),
      present: false,
    },
    charges: [],
  };
}

async function initialFiller(): Promise<FillerEditorModel> {
  return {
    type: "none",
    color1: "azur",
    color2: "or",
    patternAngle: "bande",
    patternName: "echiquete",
    semeChargeId: await getDefaultChargeId(),
    stripAngle: "pal",
    stripCount: 3,
  };
}

export function fieldToModel(viewModel: FieldEditorModel): FieldModel {
  if (viewModel.partitionType == "plain") {
    return plainFieldToModel(viewModel.plain);
  } else {
    return {
      type: "partition",
      partitionType: viewModel.partitionType,
      fields: viewModel.partitions.map((subModel) =>
        fieldToModel(subModel.model)
      ),
    };
  }
}

function plainFieldToModel(viewModel: PlainFieldEditorModel): PlainFieldModel {
  let border = undefined;
  if (viewModel.border.present) {
    border = {
      filler: fillerToModel(viewModel.border.filler),
    };
  }

  return {
    type: "plain",
    filler: fillerToModel(viewModel.filler),
    charges: viewModel.charges.map((item) => chargeToModel(item.model)),
    border: border,
  };
}

function fillerToModel(viewModel: FillerEditorModel): FillerModel {
  switch (viewModel.type) {
    case "plein":
      return {
        type: "plein",
        color: viewModel.color1,
      };
    case "seme":
      return {
        type: "seme",
        chargeId: viewModel.semeChargeId,
        chargeColor: viewModel.color2,
        fieldColor: viewModel.color1,
      };
    case "strip":
      return {
        type: "strip",
        direction: viewModel.stripAngle,
        count: viewModel.stripCount,
        color1: viewModel.color1,
        color2: viewModel.color2,
      };
    case "pattern": {
      const model: FillerPattern = {
        type: "pattern",
        patternName: viewModel.patternName,
        color1: viewModel.color1,
        color2: viewModel.color2,
      };
      if (viewModel.patternName == "fusele") {
        model.angle = viewModel.patternAngle;
      }
      return model;
    }
    default: {
      return {
        type: "invalid",
      };
    }
  }
}

function chargeToModel(viewModel: SingleChargePickerModel): ChargeModel {
  switch (viewModel.type) {
    case "strip":
      return {
        type: "strip",
        direction: viewModel.strip.angle,
        count: viewModel.strip.count,
        filler: fillerToModel(viewModel.strip.filler),
        size: viewModel.strip.size,
        outline: stripOutlineToModel(viewModel.strip),
      };
    case "cross":
      return {
        type: "cross",
        count: 1,
        direction: viewModel.cross.angle,
        filler: fillerToModel(viewModel.cross.filler),
        size: viewModel.cross.size,
      };
    case "symbol":
      return {
        type: "symbol",
        count: viewModel.symbol.count,
        chargeId: viewModel.symbol.chargeId,
        filler: fillerToModel(viewModel.symbol.filler),
      };
  }
}

function stripOutlineToModel(model: StripEditorModel): StripOutline {
  switch (model.outlineType) {
    case "simple":
      return {
        type: "simple",
        outline: model.outline1,
        shifted: model.shifted,
      };
    case "double":
      return {
        type: "double",
        outline1: model.outline1,
        outline2: model.outline2,
      };
    case "gemel-potency":
      return { type: "gemelPotented" };
    case "straight":
    default:
      return { type: "straight" };
  }
}
