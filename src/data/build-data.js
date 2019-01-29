console.log("Start build-data");

const fs = require("fs");

buildCharges();
buildPartitions();
buildEscutcheons();
buildPatterns();
buildColors();
buildPalettes();

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

  fs.writeFileSync("src/visual/data/charges.json", JSON.stringify(visual));
  fs.writeFileSync("src/blazon/data/charges.json", JSON.stringify(blazon));
  fs.writeFileSync("src/gui/data/charges.json", JSON.stringify(gui));
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

  fs.writeFileSync("src/visual/data/partitions.json", JSON.stringify(visual));
  fs.writeFileSync("src/blazon/data/partitions.json", JSON.stringify(blazon));
  fs.writeFileSync("src/gui/data/partitions.json", JSON.stringify(gui));
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

  fs.writeFileSync("src/visual/data/escutcheons.json", JSON.stringify(visual));
  fs.writeFileSync("src/gui/data/escutcheons.json", JSON.stringify(gui));
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

  fs.writeFileSync("src/blazon/data/patterns.json", JSON.stringify(blazon));
  fs.writeFileSync("src/visual/data/patterns.json", JSON.stringify(visual));
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

  fs.writeFileSync("src/blazon/data/colors.json", JSON.stringify(blazon));
  fs.writeFileSync("src/gui/data/colors.json", JSON.stringify(gui));
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

  fs.writeFileSync("src/visual/data/palettes.json", JSON.stringify(visual));
  fs.writeFileSync("src/gui/data/palettes.json", JSON.stringify(gui));
}