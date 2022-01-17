import { MyOption } from "./MyOptions.type";
import { SemeData, ChargeVisualData } from "./ChargeData";
import {
  AdjectiveId,
  FrenchNoun,
  LabelInfo,
  NounId,
} from "@/service/textual.type";
import { ChargeVisualInfo, SemeVisualInfo } from "./visual.type";

// Load Data
import defaultValues from "./data/charge-default.json";
import mobileChargeData from "./data/charges.json";
import { defaultNoun, getNoun } from "./FrenchService";

interface ChargeRepo {
  defaultChargeId: string;
  mobileVisuals: Record<string, ChargeVisualInfo>;
  mobileNounIds: Record<string, NounId>;
  mobileCustomSemes: Record<string, LabelInfo<AdjectiveId>>;
  options: MyOption[];
  semeVisuals: Record<string, SemeVisualInfo>;
}

let repo: ChargeRepo | null = null;
const defaultVisual: ChargeVisualInfo = defaultValues.visual;
const defaultSeme = computeSemeInfo(defaultVisual, defaultValues.seme);

async function getRepo(): Promise<ChargeRepo> {
  if (repo == null) {
    repo = await loadData();
  }
  return repo;
}

async function loadData(): Promise<ChargeRepo> {
  const mobileCustomSemes: Record<string, LabelInfo<AdjectiveId>> = {};
  const mobileNounIds: Record<string, NounId> = {};
  const mobileVisuals: Record<string, ChargeVisualInfo> = {};
  const options: MyOption[] = [];
  const semeVisuals: Record<string, SemeVisualInfo> = {};
  let defaultChargeId: string | null = null;

  for (const chargeData of mobileChargeData) {
    const visualData = chargeData.visual;

    const visualInfo = await buildVisualInfo(chargeData.id, visualData);
    mobileVisuals[chargeData.id] = visualInfo;
    semeVisuals[chargeData.id] = computeSemeInfo(visualInfo, visualData.seme);

    mobileNounIds[chargeData.id] = chargeData.noun;
    if (chargeData.seme) {
      mobileCustomSemes[chargeData.id] =
        chargeData.seme as LabelInfo<AdjectiveId>;
    }
    options.push(buildOption(chargeData.id, chargeData.noun));

    if (defaultChargeId == null || chargeData.default) {
      defaultChargeId = chargeData.id;
    }
  }

  if (defaultChargeId == null) {
    throw new Error("No default charge found");
  }

  return {
    defaultChargeId,
    mobileVisuals,
    mobileNounIds,
    mobileCustomSemes,
    options,
    semeVisuals,
  };
}

async function buildVisualInfo(
  id: string,
  visual: ChargeVisualData
): Promise<ChargeVisualInfo> {
  const xml = await getVisualXml(id, visual);
  return {
    id: id,
    width: visual.width,
    height: visual.height,
    xml: xml,
  };
}

function buildOption(id: string, nounId: NounId): MyOption {
  const label = getNoun(nounId).one;
  const niceLabel = label.charAt(0).toUpperCase() + label.slice(1);
  return { id, label: niceLabel };
}

async function getVisualXml(
  id: string,
  visual: ChargeVisualData
): Promise<string> {
  if (visual.file) {
    const ref = await import("./data/charges/" + visual.file);
    const response = await fetch(ref.default);
    const svg = await response.text();
    // remove End-Of-Line
    // ... maybe useless since data is no more store in JSON file
    return svg.replace(/\r?\n|\r/g, "");
  } else if (visual.xml) {
    return visual.xml;
  } else {
    throw new Error("Charge must defined 'file' or 'xml'. Id=" + id);
  }
}

export async function getChargeOptions(): Promise<MyOption[]> {
  return (await getRepo()).options;
}

export async function getDefaultChargeId(): Promise<string> {
  return (await getRepo()).defaultChargeId;
}

export async function getChargeNoun(chargeId: string): Promise<FrenchNoun> {
  const repo = await getRepo();
  const nounId = repo.mobileNounIds[chargeId];
  return getNoun(nounId);
}

export async function getChargeSemeInfo(
  chargeId: string
): Promise<
  | { type: "custom"; custom: LabelInfo<AdjectiveId> }
  | { type: "use-noun"; noun: FrenchNoun }
> {
  const repo = await getRepo();
  const custom = repo.mobileCustomSemes[chargeId];
  if (custom) {
    return {
      type: "custom",
      custom,
    };
  }

  const nounId = repo.mobileNounIds[chargeId];

  if (!nounId) {
    console.warn(`Invalid chargeId: ${chargeId}`);
    return {
      type: "use-noun",
      noun: defaultNoun(),
    };
  }

  return {
    type: "use-noun",
    noun: getNoun(nounId),
  };
}

export async function getChargeVisualInfo(
  chargeId: string
): Promise<ChargeVisualInfo> {
  const repo = await getRepo();
  const info = repo.mobileVisuals[chargeId];
  if (!info) {
    return defaultVisual;
  }
  return info;
}

export async function getSemeVisualInfo(
  chargeId: string
): Promise<SemeVisualInfo> {
  const repo = await getRepo();
  const info = repo.semeVisuals[chargeId];
  if (!info) {
    return defaultSeme;
  }
  return info;
}

function computeSemeInfo(
  chargeDef: ChargeVisualInfo,
  semeDef: SemeData
): SemeVisualInfo {
  return {
    charge: chargeDef,
    tx: semeDef.tx,
    ty: semeDef.ty,
    repetition: semeDef.repetition,
  };
}
