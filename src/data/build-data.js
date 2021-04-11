console.log("Start build-data");

const fs = require("fs");

buildCharges();
buildPartitions();
buildEscutcheons();
buildPatterns();
buildColors();
buildPalettes();

function writeJSON(destFile, data) {
  fs.mkdirSync(destFile.substring(0, destFile.lastIndexOf('/')), { recursive: true })
  fs.writeFileSync(destFile, JSON.stringify(data));
}

function buildCharges() {
  console.log(" - Build charges");
  let input = JSON.parse(fs.readFileSync("src/data/charges.json", "utf8"));

  let visual = {};
  let blazon = {};
  let gui = [];

  for (let item of input) {

    if (item.visual.type == "svg") {
      let xml = getVisualXml(item);
      let visualData = {
        id: item.id,
        width: item.visual.width,
        height: item.visual.height,
        xml: xml,
        seme: item.visual.seme
      };
      visual[item.id] = visualData;

      let label = item.blazon.one;
      let niceLabel = label.charAt(0).toUpperCase() + label.slice(1);
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
  }

  writeJSON("src/visual/data/charges.json", visual);
  writeJSON("src/blazon/data/charges.json", blazon);
  writeJSON("src/gui/data/charges.json", gui);
}

function getVisualXml(item) {
  if (item.visual.file) {
    let data = fs.readFileSync("src/data/charges/" + item.visual.file, "ascii");
    data = data.replace(/\r?\n|\r/g, "");
    return data;
  } else {
    return item.visual.xml;
  }
}

function buildPartitions() {
  console.log(" - Build partitions");
  let input = JSON.parse(fs.readFileSync("src/data/partitions.json", "utf8"));

  let visual = {};
  let blazon = {};
  let gui = [];

  for (let item of input) {
    blazon[item.id] = item.blazon;
    let count = 1;

    if (item.visual) {
      count = item.visual.paths.length;
      visual[item.id] = item.visual
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
  console.log(" - Build escutcheons");
  let input = JSON.parse(fs.readFileSync("src/data/escutcheons.json", "utf8"));

  let visual = {};
  let gui = [];

  for (let item of input) {
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
  console.log(" - Build patterns");
  let input = JSON.parse(fs.readFileSync("src/data/patterns.json", "utf8"));

  let visual = {};
  let blazon = {};

  for (let item of input) {
    visual[item.id] = item.visual;
    blazon[item.id] = item.blazon;
  }

  writeJSON("src/blazon/data/patterns.json", blazon);
  writeJSON("src/visual/data/patterns.json", visual);
}

function buildColors() {
  console.log(" - Build colors");
  let input = JSON.parse(fs.readFileSync("src/data/colors.json", "utf8"));

  // Colors
  let blazon = {};
  let gui = [];

  for (let item of input) {
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
  console.log(" - Build palettes");
  let input = JSON.parse(fs.readFileSync("src/data/palettes.json", "utf8"));

  let visual = {};
  let gui = [];

  for (let item of input) {
    visual[item.id] = item.values;
    gui.push({
      id: item.id,
      label: item.label
    });
  }

  writeJSON("src/visual/data/palettes.json", visual);
  writeJSON("src/gui/data/palettes.json", gui);
}