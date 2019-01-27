console.log("Start build-data");

const fs = require("fs");

buildCharges();

function buildCharges() {
  console.log(" - Build charges");
  let input = require("./charges.json");
  
  let visual = {};
  let blazon = {};
  let gui = [];

  for (let item of input) {

    if (item.type == "svg") {
      let xml = getVisualXml(item);
      let visualData = {
        id: item.id,
        width: item.width,
        height: item.height,
        xml: xml,
        seme: item.seme
      };
      visual[item.id] = visualData;

      let label = item.blazon.one;
      let niceLabel = label.charAt(0).toUpperCase() + label.slice(1);
      gui.push({
        id:item.id,
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
  if (item.file) {
    let data = fs.readFileSync("src/data/svg/" + item.file, "ascii");
    data = data.replace(/\r?\n|\r/g, "");
    return data;
  } else {
    return item.xml;
  }
}
