
import { mkdirSync, writeFileSync, readFileSync } from "fs";

main();

function main() {
  console.log("Start *build-data*");

  console.log(" - Build charges");
  buildCharges();

  console.log(" - Build partitions");
  buildPartitions();

  console.log(" - Build escutcheons");
  buildEscutcheons();

  console.log(" - Build patterns");
  buildPatterns();

  console.log(" - Build colors");
  buildColors();

  console.log(" - Build palettes");
  buildPalettes();

  console.log("End *build-data*");
}

function buildCharges() {
  const input = readJSON("src/data/charges.json");

  const visual = {};
  const blazon = {};
  const gui = [];

  for (const item of input) {

    if (item.visual.type == "svg") {
      const xml = getVisualXml(item, "src/data/charges");
      const visualData = {
        id: item.id,
        width: item.visual.width,
        height: item.visual.height,
        xml: xml,
        seme: item.visual.seme
      };
      visual[item.id] = visualData;

      const label = item.blazon.one;
      const niceLabel = label.charAt(0).toUpperCase() + label.slice(1);
      gui.push({
        id: item.id,
        label: niceLabel
      });
    }

    blazon[item.id] = item.blazon;
  }

  visual["$default"] = {
    "id": "$default",
    "xml": "<circle cx=\"10\" cy=\"10\" r=\"10\"/>",
    "width": 20,
    "height": 20,
    "seme": {
      "tx": 20,
      "ty": 20,
      "repetition": 5
    }
  };

  writeJSON("src/visual/data/charges.json", visual);
  writeJSON("src/blazon/data/charges.json", blazon);
  writeJSON("src/gui/data/charges.json", gui);
}

function getVisualXml(item, chargesFolder) {
  if (item.visual.file) {
    return readXML(chargesFolder + "/" + item.visual.file);
  } else {
    return item.visual.xml;
  }
}

function buildPartitions() {
  const input = readJSON("src/data/partitions.json");

  const visual = {};
  const blazon = {};
  const gui = [];

  for (const item of input) {
    blazon[item.id] = item.blazon;
    let count = 1;

    if (item.visual) {
      count = item.visual.paths.length;
      visual[item.id] = item.visual;
    }

    gui.push({
      id: item.id,
      label: item.label,
      count: count
    });
  }

  writeJSON("src/visual/data/partitions.json", visual);
  writeJSON("src/blazon/data/partitions.json", blazon);
  writeJSON("src/gui/data/partitions.json", gui);
}

function buildEscutcheons() {
  const input = readJSON("src/data/escutcheons.json");

  const visual = {};
  const gui = [];

  for (const item of input) {
    visual[item.id] = item.path;
    gui.push({
      id: item.id,
      label: item.label
    });
  }

  writeJSON("src/visual/data/escutcheons.json", visual);
  writeJSON("src/gui/data/escutcheons.json", gui);
}

function buildPatterns() {
  const input = readJSON("src/data/patterns.json");

  const visual = {};
  const blazon = {};

  for (let item of input) {
    visual[item.id] = item.visual;
    blazon[item.id] = item.blazon;
  }

  writeJSON("src/blazon/data/patterns.json", blazon);
  writeJSON("src/visual/data/patterns.json", visual);
}

function buildColors() {
  const input = readJSON("src/data/colors.json");

  // Colors
  const blazon = {};
  const gui = [];

  for (const item of input) {
    blazon[item.id] = item.blazon;
    gui.push({
      id: item.id,
      label: item.picker.label,
      background: item.picker.background
    });
  }

  writeJSON("src/blazon/data/colors.json", blazon);
  writeJSON("src/gui/data/colors.json", gui);
}

function buildPalettes() {
  const input = readJSON("src/data/palettes.json");

  const visual = {};
  const gui = [];

  for (const item of input) {
    visual[item.id] = item.values;
    gui.push({
      id: item.id,
      label: item.label
    });
  }

  writeJSON("src/visual/data/palettes.json", visual);
  writeJSON("src/gui/data/palettes.json", gui);
}

// ---------------------
// I/O Utility functions
// ---------------------

function readJSON(filename) {
  return JSON.parse(readFileSync(filename, "utf8"));
}

function readXML(filename) {
  return readFileSync(filename, "ascii")
    .replace(/\r?\n|\r/g, "");
}

function writeJSON(destFile, data) {
  mkdirSync(destFile.substring(0, destFile.lastIndexOf('/')), { recursive: true });
  writeFileSync(destFile, JSON.stringify(data));
}