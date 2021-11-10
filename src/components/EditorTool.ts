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
    strip: {
      angle: "0",
      count: 1,
      filler: await initialFiller(),
    },
    cross: {
      angle: "0",
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
    pleinColor: "azur",
    patternColor1: "azur",
    patternColor2: "or",
    patternAngle: "bande",
    patternName: "echiquete",
    semeChargeId: await getDefaultChargeId(),
    semeFieldColor: "azur",
    semeChargeColor: "or",
    stripAngle: "0",
    stripColor1: "azur",
    stripColor2: "or",
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
        color: viewModel.pleinColor,
      };
    case "seme":
      return {
        type: "seme",
        chargeId: viewModel.semeChargeId,
        chargeColor: viewModel.semeChargeColor,
        fieldColor: viewModel.semeFieldColor,
      };
    case "strip":
      return {
        type: "strip",
        angle: viewModel.stripAngle,
        count: viewModel.stripCount,
        color1: viewModel.stripColor1,
        color2: viewModel.stripColor2,
      };
    case "pattern": {
      const model: FillerPattern = {
        type: "pattern",
        patternName: viewModel.patternName,
        color1: viewModel.patternColor1,
        color2: viewModel.patternColor2,
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
        angle: viewModel.strip.angle,
        count: viewModel.strip.count,
        filler: fillerToModel(viewModel.strip.filler),
      };
    case "cross":
      return {
        type: "cross",
        count: 1,
        angle: viewModel.cross.angle,
        filler: fillerToModel(viewModel.cross.filler),
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
