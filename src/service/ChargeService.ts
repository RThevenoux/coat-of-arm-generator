import { MyOption } from "./MyOptions.type";
import { ChargeData, SemeData, SVGVisualData } from "./ChargeData";
import { ChargeTextualInfo } from "@/service/textual.type";
import { ChargeVisualInfo, SemeVisualInfo } from "./visual.type";

// Load Data
import data from "./data/charges.json";
import defaultValues from "./data/charge-default.json";

interface ChargeRepo {
  visual: Record<string, ChargeVisualInfo>;
  semeVisual: Record<string, SemeVisualInfo>;
  blazon: Record<string, ChargeTextualInfo>;
  options: MyOption[];
  defaultChargeId: string;
}

let repo: ChargeRepo | null = null;
const defaultTextual: ChargeTextualInfo = defaultValues.textual;
const defaultVisual: ChargeVisualInfo = defaultValues.visual;
const defaultSeme = computeSemeInfo(defaultVisual, defaultValues.seme);

async function getRepo(): Promise<ChargeRepo> {
  if (repo == null) {
    repo = await loadData();
  }
  return repo;
}

async function loadData(): Promise<ChargeRepo> {
  const visual: Record<string, ChargeVisualInfo> = {};
  const semeVisual: Record<string, SemeVisualInfo> = {};
  const blazon: Record<string, ChargeTextualInfo> = {};
  const options: MyOption[] = [];
  let defaultChargeId: string | null = null;

  for (const item of data) {
    const chargeData = item as ChargeData;
    const visualData = chargeData.visual;
    if (visualData.type === "svg") {
      const visualInfo = await buildVisualInfo(chargeData.id, visualData);
      visual[chargeData.id] = visualInfo;
      semeVisual[chargeData.id] = computeSemeInfo(visualInfo, visualData.seme);

      options.push(buildOption(chargeData));

      if (defaultChargeId == null || chargeData.default) {
        defaultChargeId = chargeData.id;
      }
    }
    blazon[chargeData.id] = chargeData.blazon;
  }

  if (defaultChargeId == null) {
    throw new Error("No default charge found");
  }

  return {
    visual,
    semeVisual,
    blazon,
    options,
    defaultChargeId,
  };
}

async function buildVisualInfo(
  id: string,
  visual: SVGVisualData
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
  visual: SVGVisualData
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
  const info = repo.blazon[chargeId];

  if (!info) {
    console.log("Invalid chargeId:" + chargeId);
    return defaultTextual;
  }

  return info;
}

export async function getChargeVisualInfo(
  chargeId: string
): Promise<ChargeVisualInfo> {
  const repo = await getRepo();
  const info = repo.visual[chargeId];
  if (!info) {
    return defaultVisual;
  }
  return info;
}

export async function getSemeVisualInfo(
  chargeId: string
): Promise<SemeVisualInfo> {
  const repo = await getRepo();
  const info = repo.semeVisual[chargeId];
  if (!info) {
    return defaultSeme;
  }
  return info;
}

function computeSemeInfo(
  chargeDef: ChargeVisualInfo,
  semeDef: SemeData
): SemeVisualInfo {
  const tx = semeDef.tx;
  const ty = semeDef.ty;
  const y0 = -chargeDef.height / 2;
  const x0 = -chargeDef.width / 2;

  const translateCenter = `translate(${x0 + tx},${y0 + ty})`;
  const translateTopLeft = `translate(${x0},${y0})`;
  const translateBottomLeft = `translate(${x0},${y0 + 2 * ty})`;
  const translateTopRigth = `translate(${x0 + 2 * tx},${y0})`;
  const translateBottomRigth = `translate(${x0 + 2 * tx},${y0 + 2 * ty})`;

  return {
    charge: chargeDef,
    width: tx * 2,
    height: ty * 2,
    repetition: semeDef.repetition,
    copies: [
      translateCenter,
      translateTopLeft,
      translateBottomLeft,
      translateTopRigth,
      translateBottomRigth,
    ],
  };
}
