import SvgBuilder from './svg-builder';

let patterns = require("./patterns.json");
let charges = require("./charges.json");
let escutcheons = require("./escutcheons.json");
let palettes = require("./palettes.json");

export default function generateVisual(model, configuration) {

  let shape = escutcheons[configuration.shape];
  let palette = palettes[configuration.palette];
  let borderSize = configuration.borderSize;
  let defaultStrokeSize = configuration.defaultStrokeSize;

  let viewBoxSize = {
    x: -borderSize,
    y: -borderSize,
    width: parseInt(shape.width) + borderSize * 2,
    height: parseInt(shape.height) + borderSize * 2,
  };

  let builder = new SvgBuilder(viewBoxSize, palette, defaultStrokeSize);

  // Draw 
  let partitionShapes = _partitionShape(shape, model.type);
  if (partitionShapes.length == 0) {
    //Error case
    _addField(builder, "none", shape);
  } else {
    for (let i = 0; i < partitionShapes.length; i++) {
      let partitionModel = model.partitions[i].model;
      let subShape = partitionShapes[i];
      _addPartition(builder, partitionModel, subShape);
    }
  }

  // Visual effet
  let mainShapeId = _definePath(builder, shape.path);
  _addBorder(builder, borderSize, mainShapeId);
  if (configuration.reflect) {
    _addReflect(builder, shape, mainShapeId);
  }

  // Static size of 300x300 for the image
  // Should be more dynamic
  return builder.container
    .att("width", 300)
    .att("height", 300)
    .end();
}

function _partitionShape(shape, partitionningType) {
  switch (partitionningType) {
    case "plain": {
      return [shape];
    }
    case "parti": {
      let w = shape.width;
      let h = shape.height;
      let shape1 = {
        path: "M 0,0 L " + w / 2 + ",0 L" + w / 2 + "," + h + " L 0," + h + "z",
        width: w / 2,
        height: h
      };
      let shape2 = {
        path: "M " + w / 2 + ",0 L " + w + ",0 L" + w + "," + h + " L " + w / 2 + "," + h + "z",
        width: w / 2,
        height: h
      };
      return [shape1, shape2];
    }
    case "coupe": {
      let w = shape.width;
      let h = shape.height;
      let shape1 = {
        path: "M 0,0 L " + w + ",0 L" + w + "," + h / 2 + " L 0," + h / 2 + "z",
        width: w,
        height: h / 2
      };
      let shape2 = {
        path: "M " + 0 + "," + h / 2 + " L " + w + "," + h / 2 + " L" + w + "," + h + " L " + 0 + "," + h + "z",
        width: w,
        height: h / 2
      };
      return [shape1, shape2];
    }
    case "tierce_en_pairle": {
      let w = shape.width;
      let h = shape.height;
      let shape1 = {
        path: "M 0,0 L " + w + ",0 L" + w / 2 + "," + h / 2 + " z",
        width: w,
        height: h / 2
      };
      let shape2 = {
        path: "M " + 0 + "," + 0 + " L " + w / 2 + "," + h / 2 + " L" + w / 2 + "," + h + " L " + 0 + "," + h + "z",
        width: w / 2,
        height: h
      };
      let shape3 = {
        path: "M " + w / 2 + "," + h / 2 + " L " + w + "," + 0 + " L" + w + "," + h + " L " + w / 2 + "," + h + "z",
        width: w / 2,
        height: h
      };
      return [shape1, shape2, shape3];
    }
    case "ecartele": {
      let w = shape.width;
      let h = shape.height;
      let shape1 = {
        path: "M 0,0 L " + w / 2 + ",0 L" + w / 2 + "," + h / 2 +" L " + 0 + "," + h / 2 + " z",
        width: w / 2,
        height: h / 2
      };
      let shape2 = {
        path: "M " + w / 2 + "," + 0 + " L " + w + "," + 0 + " L" + w + "," + h / 2 + " L " + w / 2 + "," + h / 2 + "z",
        width: w / 2,
        height: h / 2
      };
      let shape3 = {
        path: "M " + 0 + "," + h / 2 + " L " + w / 2 + "," + h / 2 + " L" + w / 2 + "," + h + " L " + 0 + "," + h + "z",
        width: w / 2,
        height: h / 2
      };
      let shape4 = {
        path: "M " + w / 2 + "," + h / 2 + " L " + w + "," + h / 2 + " L" + w + "," + h + " L " + w / 2 + "," + h + "z",
        width: w / 2,
        height: h / 2
      };
      return [shape1, shape2, shape3, shape4];
    }
    default:
      return [];
  }
}

function _addPartition(builder, model, shape) {
  let filler = model.filler;
  _addField(builder, filler, shape);
  // TODO : add charges
}

function _definePath(builder, path) {
  let id = "main-shape";
  builder.defs
    .ele("path")
    .att("id", id)
    .att("d", path);
  return id;
}

function _addField(builder, filler, shape) {

  let fillerId = _getFiller(builder, filler, shape);

  if (fillerId) {
    builder.container
      .ele("path")
      .att("d", shape.path)
      .att("fill", "url(#" + fillerId + ")");
  }
}

function _getFiller(builder, filler, shape) {
  if (!filler) {
    return builder.getDefaultFiller();
  }

  switch (filler.type) {
    case "plein": {
      return builder.getSolidFiller(filler.color);
    };
    case "pattern": {
      let pattern = patterns[filler.patternName];
      let parameters = _getPatternParameters(filler, shape);
      return builder.addPattern(pattern, parameters);
    };
    case "seme": {
      let parameters = _getSemeParameters(filler);
      return builder.addSeme(parameters, shape.width);
    }
    default: {
      console.log("visual-generator - unsupported-filler-type:" + filler.type);
      return builder.getDefaultFiller();
    }
  }
}

function _getChargeDefinition(chargeId) {
  let chargeDef = charges[chargeId];
  if (!chargeDef) {
    chargeDef = charges["$default"];
  }
  return chargeDef;
}

function _getSemeParameters(description) {
  let chargeDef = _getChargeDefinition(description.chargeId);

  let tx = chargeDef.seme.tx;
  let ty = chargeDef.seme.ty;
  let h = chargeDef.height;
  let w = chargeDef.width;

  let parameters = {
    charge: {
      id: description.chargeId,
      xml: chargeDef.xml,
      color: description.chargeColor,
      width: w,
      height: h
    },
    seme: {
      width: tx * 2,
      height: ty * 2,
      repetition: chargeDef.seme.repetition,
      copies: [
        "translate(" + (-w / 2 + tx) + "," + (-h / 2 + ty) + ")",
        "translate(" + (-w / 2) + "," + (-h / 2) + ")",
        "translate(" + (-w / 2) + "," + (-h / 2 + 2 * ty) + ")",
        "translate(" + (-w / 2 + 2 * tx) + "," + (-h / 2) + ")",
        "translate(" + (-w / 2 + 2 * tx) + "," + (-h / 2 + 2 * ty) + ")"
      ]
    },
    fieldColor: description.fieldColor
  }
  return parameters;
}

function _getPatternParameters(description, shape) {
  let param = {
    backgroundColor: description.color1,
    patternColor: description.color2,
    shapeWidth: shape.width
  }

  if (description.angle) {
    switch (description.angle) {
      case "bande": param.rotation = -45; break;
      case "barre": param.rotation = 45; break;
      case "defaut": break;
      default: console.log("Invalid angle" + description.angle);
    }
  }

  return param;
}

function _addBorder(builder, borderSize, mainShapeId) {
  builder.container.ele("use")
    .att("xlink:href", "#" + mainShapeId)
    .att("style", "fill:none;stroke:#000;stroke-width:" + borderSize);
}

function _addReflect(builder, shapeBox, mainShapeId) {
  let gradienId = "gradient-reflect";

  let cx = shapeBox.width / 3;
  let cy = shapeBox.height / 3;
  let radius = shapeBox.width * 2 / 3;

  let gradient = builder.defs.ele("radialGradient")
    .att("id", gradienId)
    .att("gradientUnits", "userSpaceOnUse")
    .att("cx", cx).att("cy", cy).att("r", radius);

  gradient.ele("stop").att("style", "stop-color:#fff;stop-opacity:0.31").att("offset", 0);
  gradient.ele("stop").att("style", "stop-color:#fff;stop-opacity:0.25").att("offset", 0.19);
  gradient.ele("stop").att("style", "stop-color:#6b6b6b;stop-opacity:0.125").att("offset", 0.6);
  gradient.ele("stop").att("style", "stop-color:#000;stop-opacity:0.125").att("offset", 1);

  builder.container.ele("use")
    .att("xlink:href", "#" + mainShapeId)
    .att("fill", "url(#" + gradienId + ")");
}