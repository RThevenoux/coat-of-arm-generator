import generateVisual from './visual/visual-generator';
import generateBlazon from './blazon/blazon-generator';

var shapes = require("./shapes.json");
var palettes = require("./palettes.json");

var model = {
  'visual': {
    'shape': 'none',
    'palette': 'none'
  },
  'description': {
    'color': 'none'
  }
}

window.onload = () => {
  init();
  update();
}

function init() {
  initColorSelector();
  initShapeSelector();
  initPaletteSelector();
}

function initColorSelector() {
  let colorSelector = document.getElementById("color-selector");

  let colorOptions = {
    "or": { "background": "yellow", "label": "Or" },
    "argent": { "background": "white", "label": "Argent" },
    "azur": { "background": "blue", "label": "Azur" },
    "gueules": { "background": "red", "label": "Gueules" },
    "sinople": { "background": "green", "label": "Sinople" },
    "sable": { "background": "black", "label": "Sable" },
    "pourpre": { "background": "violet", "label": "Pourpre" }
  };

  for (let key in colorOptions) {
    let data = colorOptions[key];
    let option = new Option(data.label, key);
    option.style = "background-color:" + data.background;
    colorSelector.options[colorSelector.options.length] = option;
  }
  colorSelector.addEventListener("change", () => {
    model.description.color = colorSelector.value;
    update();
  });
  model.description.color = colorSelector.value;
}

function initShapeSelector() {
  let shapeSelector = document.getElementById("shape-selector");
  for (let index in shapes) {
    shapeSelector.options[shapeSelector.options.length] = new Option(shapes[index].label, index);
  }
  shapeSelector.addEventListener("change", () => {
    model.visual.shape = shapeSelector.value;
    updateVisual();
  });
  model.visual.shape = shapeSelector.value;
}

function initPaletteSelector() {
  let paletteSelector = document.getElementById("palette-selector");
  for (let i = 0; i < palettes.length; i++) {
    let palette = palettes[i];
    paletteSelector.options[paletteSelector.options.length] = new Option(palette.label, i);
  }
  paletteSelector.addEventListener("change", () => {
    model.visual.paletteIndex = paletteSelector.value;
    updateVisual();
  });
  model.visual.paletteIndex = paletteSelector.value;
}

function update() {
  updateVisual();
  updateTextual();
}

function updateVisual() {
  let configuration = {
    shape: shapes[model.visual.shape],
    palette: palettes[model.visual.paletteIndex]
  };
  let svg = generateVisual(model.description, configuration);
  let visual = document.getElementById("visual-area");
  visual.innerHTML = svg;
}

function updateTextual() {
  let textual = document.getElementById("textual-area");
  let result = generateBlazon(model.description);
  textual.innerText = result;
}
