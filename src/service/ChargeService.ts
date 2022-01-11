import { MyOption } from "./MyOptions.type";
import { ChargeData, SemeData, ChargeVisualData } from "./ChargeData";
import { ChargeTextualInfo, TextualInfo } from "@/service/textual.type";
import { ChargeVisualInfo, SemeVisualInfo } from "./visual.type";

// Load Data
import defaultValues from "./data/charge-default.json";
import mobileChargeData from "./data/charges.json";
import stripBlazonData from "./data/strip-blazon.json";

interface ChargeRepo {
  defaultChargeId: string;
  mobileVisuals: Record<string, ChargeVisualInfo>;
  mobileBlazons: Record<string, ChargeTextualInfo>;
  options: MyOption[];
  semeVisuals: Record<string, SemeVisualInfo>;
  stripBlazons: Record<string, TextualInfo>;
}

let repo: ChargeRepo | null = null;
const defaultTextual: ChargeTextualInfo =
  defaultValues.textual as ChargeTextualInfo;
const defaultVisual: ChargeVisualInfo = defaultValues.visual;
const defaultSeme = computeSemeInfo(defaultVisual, defaultValues.seme);

async function getRepo(): Promise<ChargeRepo> {
  if (repo == null) {
    repo = await loadData();
  }
  return repo;
}

async function loadData(): Promise<ChargeRepo> {
  const mobileBlazons: Record<string, ChargeTextualInfo> = {};
  const mobileVisuals: Record<string, ChargeVisualInfo> = {};
  const options: MyOption[] = [];
  const semeVisuals: Record<string, SemeVisualInfo> = {};
  const stripBlazons: Record<string, TextualInfo> = {};
  let defaultChargeId: string | null = null;

  for (const item of mobileChargeData) {
    const chargeData = item as ChargeData;
    const visualData = chargeData.visual;

    const visualInfo = await buildVisualInfo(chargeData.id, visualData);
    mobileVisuals[chargeData.id] = visualInfo;
    semeVisuals[chargeData.id] = computeSemeInfo(visualInfo, visualData.seme);

    options.push(buildOption(chargeData));

    if (defaultChargeId == null || chargeData.default) {
      defaultChargeId = chargeData.id;
    }

    mobileBlazons[chargeData.id] = chargeData.blazon;
  }

  if (defaultChargeId == null) {
    throw new Error("No default charge found");
  }

  for (const blazon of stripBlazonData) {
    stripBlazons[blazon.id] = blazon.blazon as TextualInfo;
  }

  return {
    defaultChargeId,
    mobileVisuals,
    mobileBlazons,
    options,
    semeVisuals,
    stripBlazons,
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

function buildOption(item: ChargeData): MyOption {
  const label = item.blazon.one;
  const niceLabel = label.charAt(0).toUpperCase() + label.slice(1);
  return {
    id: item.id,
    label: niceLabel,
  };
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

export async function getChargeTextualInfo(
  chargeId: string
): Promise<ChargeTextualInfo> {
  const repo = await getRepo();
  const info = repo.mobileBlazons[chargeId];

  if (!info) {
    console.log("Invalid chargeId:" + chargeId);
    return defaultTextual;
  }

  return info;
}

export async function getStripTextualInfo(id: string): Promise<TextualInfo> {
  const repo = await getRepo();
  const info = repo.stripBlazons[id];

  if (!info) {
    console.log("Invalid id:" + id);
    return defaultTextual;
  }

  return info;
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
