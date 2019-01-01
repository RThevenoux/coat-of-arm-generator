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
  for (index in forms) {
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
  let svg = generateVisual(model.description, model.visual);
  let visual = document.getElementById("visual-area");
  visual.innerHTML = svg;

  // TEXTUAL
  let textual = document.getElementById("textual-area");
  textual.innerText = colors[model.description.color].label;
}

function generateVisual(description, visualModel) {
  let borderSize = 3;

  let color = colors[description.color].rgb;
  let form = forms[visualModel.form];

  let viewBoxSize = {
    x: -borderSize,
    y: -borderSize,
    width: parseInt(form.width) + borderSize * 2,
    height: parseInt(form.height) + borderSize * 2,
  }

  let defs = buildDefs(form);

  let background = "<use xlink:href=\"#shape\" style=\"fill:#"+color+"\"/>";
  let border = "<use xlink:href=\"#shape\" style=\"fill:none;stroke:#000;stroke-width:3\"/>";
  let reflect = "<use xlink:href=\"#shape\" fill=\"url(#gradient-reflect)\"/>";

  let svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + form.width + "\" height=\"" + form.height + "\""
    + "viewBox=\"" + viewBoxSize.x + " " + viewBoxSize.y + " " + viewBoxSize.width + " " + viewBoxSize.height + "\""
    + ">"
    + defs
    + background
    + border + reflect
    + "</svg>";

    return svg;
}

function buildDefs(form) {
  let cx = form.width / 3;
  let cy = form.height / 3;
  let radius = form.width * 2 / 3;

  let gradient = "<radialGradient id=\"gradient-reflect\" gradientUnits=\"userSpaceOnUse\" cx=\"" + cx + "\" cy=\"" + cy + "\" r=\"" + radius + "\">" +
    "<stop style=\"stop-color:#fff;stop-opacity:0.31\" offset=\"0\"/>" +
    "<stop style=\"stop-color:#fff;stop-opacity:0.25\" offset=\"0.19\"/>" +
    "<stop style=\"stop-color:#6b6b6b;stop-opacity:0.125\" offset=\"0.6\"/>" +
    "<stop style=\"stop-color:#000;stop-opacity:0.125\" offset=\"1\"/>" +
    "</radialGradient>";
  let clipPath = "<clipPath id=\"shape_cut\">" +
    "<path id=\"shape\" d=\"" + form.shape + "\"/>" +
    "</clipPath>";

  return "<defs>" + gradient + clipPath + "</defs>";
}
