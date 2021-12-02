import {
  ChargeModel,
  FieldModel,
  FillerModel,
  FillerPattern,
  PlainFieldModel,
} from "@/generator/model.type";
import { getDefaultChargeId } from "@/service/ChargeService";
import { FieldEditorModel, PlainFieldEditorModel } from "./FieldEditorModel";
import { FillerEditorModel } from "./FillerEditorModel";
import { SingleChargePickerModel } from "./SingleChargePickerModel";

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
    filler: await initialFiller(),
    strip: {
      angle: "pal",
      count: 1,
      size: "default",
    },
    cross: {
      angle: "fasce",
      size: "default",
    },
    symbol: {
      chargeId: await getDefaultChargeId(),
      count: 1,
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
        filler: fillerToModel(viewModel.filler),
        size: viewModel.strip.size,
      };
    case "cross":
      return {
        type: "cross",
        count: 1,
        direction: viewModel.cross.angle,
        filler: fillerToModel(viewModel.filler),
        size: viewModel.cross.size,
      };
    case "symbol":
      return {
        type: "symbol",
        count: viewModel.symbol.count,
        chargeId: viewModel.symbol.chargeId,
        filler: fillerToModel(viewModel.filler),
      };
  }
}
