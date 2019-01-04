import generateVisual from './visual/visual-generator';
import generateBlazon from './blazon/blazon-generator';

var shapes = require("./shapes.json");
var palettes = require("./palettes.json");

var model = {
  'visual': {
    'shape': 'none',
    'palette': 'none',
    'borderSize': 3,
    'reflect': 'none'
  },
  'description': {
    'type': 'plain',
    'color': 'none'
  }
}

window.onload = () => {
  init();
  update();
}

function init() {
  // Model
  initFillerSelector();
  // Visual configuration
  initShapeSelector();
  initPaletteSelector();
  initReflectCheckbox();
}

function initReflectCheckbox() {
  let checkbox = document.getElementById("reflect-checkbox");
  checkbox.addEventListener("change", () => {
    model.visual.reflect = checkbox.checked;
    updateVisual();
  });
  model.visual.reflect = checkbox.value;
}

function initFillerSelector() {
  let container = document.getElementById("filler-selector");

  // Plein
  let model0 = {
    'type': 'plein',
    'color': 'none'
  };
  let div0 = document.createElement("div");
  let label0 = document.createElement("label");
  label0.innerText = "Plein";
  div0.appendChild(label0);

  let input0 = document.createElement("input");
  input0.setAttribute("type", "radio");
  input0.setAttribute("name", "filler-type");
  input0.addEventListener("change", () => {
    if (input0.checked) {
      model.description = model0;
      update();
    }
  });
  div0.appendChild(input0);
  input0.checked = true;
  model.description = model0;

  let colorSelector0 = createColorSelector();
  colorSelector0.addEventListener("change", () => {
    model0.color = colorSelector0.value;
    update();
  });
  model0.color = colorSelector0.value;
  div0.appendChild(colorSelector0);

  container.appendChild(div0);

  // Echiquete
  let model1 = {
    'type': 'echiquete',
    'color1': 'none',
    'color2': 'none'
  };
  let div1 = document.createElement("div");
  let label1 = document.createElement("label");
  label1.innerText = "Échiqueté";
  div1.appendChild(label1);
  let input1 = document.createElement("input");
  input1.setAttribute("type", "radio");
  input1.setAttribute("name", "filler-type");
  input1.addEventListener("change", () => {
    if (input1.checked) {
      model.description = model1;
      update();
    }
  });
  div1.appendChild(input1);
  let colorSelector1a = createColorSelector();
  colorSelector1a.addEventListener("change", () => {
    model1.color1 = colorSelector1a.value;
    update();
  });
  let colorSelector1b = createColorSelector();
  colorSelector1b.addEventListener("change", () => {
    model1.color2 = colorSelector1b.value;
    update();
  });
  div1.appendChild(colorSelector1a);
  div1.appendChild(colorSelector1b);
  colorSelector1b.value = "gueules";
  model1.color1 = colorSelector1a.value;
  model1.color2 = colorSelector1b.value;
  container.appendChild(div1);

  // Losange
  let model2 = {
    'type': 'losange',
    'color1': 'none',
    'color2': 'none'
  };
  let div2 = document.createElement("div");
  let label2 = document.createElement("label");
  label2.innerText = "Losangé";
  div2.appendChild(label2);
  let input2 = document.createElement("input");
  input2.setAttribute("type", "radio");
  input2.setAttribute("name", "filler-type");
  input2.addEventListener("change", () => {
    if (input2.checked) {
      model.description = model2;
      update();
    }
  });
  div2.appendChild(input2);
  let colorSelector2a = createColorSelector();
  let colorSelector2b = createColorSelector();
  div2.appendChild(colorSelector2a);
  colorSelector2a.addEventListener("change", () => {
    model2.color1 = colorSelector2a.value;
    update();
  });
  div2.appendChild(colorSelector2b);
  colorSelector2b.addEventListener("change", () => {
    model2.color2 = colorSelector2b.value;
    update();
  });
  colorSelector2b.value = "gueules";
  model2.color1 = colorSelector2a.value;
  model2.color2 = colorSelector2b.value;
  container.appendChild(div2);

  // Fusele
  let model3 = {
    'type': 'fusele',
    'color1': 'none',
    'color2': 'none',
    'angle': 'none'
  };
  let div3 = document.createElement("div");
  let label3 = document.createElement("label");
  label3.innerText = "Fuselé";
  div3.appendChild(label3);
  let input3 = document.createElement("input");
  input3.setAttribute("type", "radio");
  input3.setAttribute("name", "filler-type");
  input3.addEventListener("change", () => {
    if (input3.checked) {
      model.description = model3;
      update();
    }
  });
  div3.appendChild(input3);
  let colorSelector3a = createColorSelector();
  let colorSelector3b = createColorSelector();
  div3.appendChild(colorSelector3a);
  div3.appendChild(colorSelector3b);
  colorSelector3b.value = "gueules";
  let angleSelector = document.createElement("select");
  angleSelector.options[0] = new Option("défaut", "defaut");
  angleSelector.options[1] = new Option("en bande", "bande");
  angleSelector.options[2] = new Option("en barre", "barre");
  div3.appendChild(angleSelector);

  colorSelector3a.addEventListener("change", () => {
    model3.color1 = colorSelector3a.value;
    update();
  });
  colorSelector3b.addEventListener("change", () => {
    model3.color2 = colorSelector3b.value;
    update();
  });
  angleSelector.addEventListener("change", () => {
    model3.angle = angleSelector.value;
    update();
  });
  model3.color1 = colorSelector3a.value;
  model3.color2 = colorSelector3b.value;
  model3.angle = angleSelector.value;
  container.appendChild(div3);
}

function createColorSelector() {
  let colorSelector = document.createElement("select");
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
  return colorSelector;
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
    palette: palettes[model.visual.paletteIndex],
    borderSize: model.visual.borderSize,
    reflect: model.visual.reflect
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
