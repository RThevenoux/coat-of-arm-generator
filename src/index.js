import generateVisual from './visualGenerator';

var forms = require("./forms.json");
var colors = require("./colors.json");

var model = {
  'visual': {
    'form': 'none'
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
  let colorSelector = document.getElementById("color-selector");
  colorSelector.addEventListener("change", () => {
    model.description.color = colorSelector.value;
    update();
  });
  model.description.color = colorSelector.value;
  let formSelector = document.getElementById("form-selector");
  for (let index in forms) {
    formSelector.options[formSelector.options.length] = new Option(forms[index].label, index);
  }

  formSelector.addEventListener("change", () => {
    model.visual.form = formSelector.value;
    update();
  });
  model.visual.form = formSelector.value;
}

function update() {
  // VISUAL
  let configuration = {
    form: forms[model.visual.form],
    colors: colors
  };

  let svg = generateVisual(model.description, configuration);
  let visual = document.getElementById("visual-area");
  visual.innerHTML = svg;

  // TEXTUAL
  let textual = document.getElementById("textual-area");
  textual.innerText = colors[model.description.color].label;
}
