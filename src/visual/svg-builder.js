import xmlBuilder from 'xmlbuilder';
import paper from 'paper-jsdom';

import getCharge from './charge-manager';

let patterns = require("./data/patterns.json");

export default class SvgBuilder {
  constructor(viewBox, palette, defaultStrokeWidth) {
    this.palette = palette;
    this.defaultStrokeWidth = defaultStrokeWidth;

    this.container = xmlBuilder.create('svg', { headless: true })
      .att("xmlns", "http://www.w3.org/2000/svg")
      .att("viewBox", viewBox.x + " " + viewBox.y + " " + viewBox.width + " " + viewBox.height);

    // Create "defs" section
    this.defs = this.container.ele("defs");

    this.patternCount = 0;
    this.definedSolidFiller = {};
    this.definedSymbol = {};
    this.defaultFillerId = null;
  }

  fill(fillerModel, path) {
    if (!fillerModel || fillerModel === "none" || !fillerModel.type) {
      let defaultFillerId = this._getDefaultFiller();
      this._fillPath(defaultFillerId, path);
      return;
    }

    if (fillerModel.type == "strip") {
      this._fillWithStrips(fillerModel, path);
    } else {
      let fillerId = this._getFillerId(fillerModel, path.bounds);
      this._fillPath(fillerId, path);
    }
  }

  _fillWithStrips(fillerModel, path) {
    let center = [0, 0];
    let angle;

    let pathAngle = Math.atan(path.bounds.height / path.bounds.width) * 180 / Math.PI;
    switch (fillerModel.angle) {
      case "0": angle = 0; break;
      case "45": angle = pathAngle; break;
      case "90": angle = 90; break;
      case "135": angle = -pathAngle; break;
    }

    let clone = path.clone();

    clone.rotate(angle, center);
    let x = clone.bounds.x;
    let y = clone.bounds.y;
    let w = clone.bounds.width;
    let h = clone.bounds.height;
    let hStrip = h / (2 * fillerModel.count);

    let color1Id = this._getSolidFiller(fillerModel.color1);
    let color2Id = this._getSolidFiller(fillerModel.color2);

    for (let i = 0; i < 2 * fillerModel.count; i++) {
      let stripPath = new paper.Path.Rectangle({
        point: [x, y + hStrip * i],
        size: [w, hStrip]
      });
      let strip = clone.intersect(stripPath).rotate(-angle, center);
      let colorId = (i % 2 == 0 ? color1Id : color2Id);
      this._fillPath(colorId, strip);
    }
  }

  _fillPath(fillerId, path) {
    this.container
      .ele("path")
      .att("d", path.pathData)
      .att("fill", "url(#" + fillerId + ")");
  }

  _getFillerId(fillerModel, shapeBox) {
    switch (fillerModel.type) {
      case "plein": {
        return this._getSolidFiller(fillerModel.color);
      };
      case "pattern": {
        let patternDef = patterns[fillerModel.patternName];
        let parameters = this._getPatternParameters(fillerModel, shapeBox);
        return this._addPattern(patternDef, parameters);
      };
      case "seme": {
        let parameters = this._getSemeParameters(fillerModel);
        return this._addSeme(parameters, shapeBox.width);
      }
      default: {
        console.log("visual-generator - unsupported-filler-type:" + fillerModel.type);
        return this._getDefaultFiller();
      }
    }
  }

  _getFillColorProp(key) {
    return "fill:#" + this._getColor(key) + ";";
  }

  _stroke(width) {
    return "stroke:black;stroke-width:" + width + "px;"
  }

  _getColor(key) {
    return this.palette[key];
  }

  _getDefaultFiller() {
    if (!this.defaultFillerId) {
      this.defaultFillerId = "default-filler";

      let size = 50;
      let half = size / 2;
      let color1 = "white";
      let color2 = "grey";

      let patternNode = this.defs.ele("pattern")
        .att("id", this.defaultFillerId)
        .att("x", 0).att("y", 0)
        .att("width", size)
        .att("height", size)
        .att("patternUnits", "userSpaceOnUse");

      patternNode.ele("rect")
        .att("x", 0).att("y", 0)
        .att("width", size).att("height", size)
        .att("fill", color1);
      patternNode.ele("rect")
        .att("x", half).att("y", 0)
        .att("width", half).att("height", half)
        .att("fill", color2);
      patternNode.ele("rect")
        .att("x", 0).att("y", half)
        .att("width", half).att("height", half)
        .att("fill", color2);
    }
    return this.defaultFillerId;
  }

  _getSolidFiller(key) {
    let id = this.definedSolidFiller[key];

    if (!id) {
      id = "solid-" + key;
      this.defs.ele("linearGradient")
        .att("id", id)
        .ele("stop")
        .att("stop-color", "#" + this._getColor(key));

      this.definedSolidFiller[key] = id;
    }

    return id;
  }

  _addSeme(parameters, shapeWidth) {
    let id = "pattern" + (this.patternCount++);

    let box = { width: parameters.seme.width, height: parameters.seme.height };

    let symbolId = this.addSymbol(parameters.charge);

    let scaleCoef = shapeWidth / (box.width * parameters.seme.repetition);
    let transform = "scale(" + scaleCoef + "," + scaleCoef + ")";

    let patternNode = this.defs.ele("pattern")
      .att("id", id)
      .att("x", 0).att("y", 0)
      .att("width", box.width)
      .att("height", box.height)
      .att("patternUnits", "userSpaceOnUse")
      .att("patternTransform", transform);

    patternNode.ele("rect")
      .att("x", 0).att("y", 0)
      .att("width", box.width).att("height", box.height)
      .att("style", this._getFillColorProp(parameters.fieldColor));

    let strokeWidth = this.defaultStrokeWidth / scaleCoef;

    for (let copyTransform of parameters.seme.copies) {
      patternNode.ele("use")
        .att("xlink:href", "#" + symbolId)
        .att("transform", copyTransform)
        .att("style", this._getFillColorProp(parameters.color) + this._stroke(strokeWidth));
    }

    return id;
  }

  _addPattern(pattern, parameters) {
    let id = "pattern" + (this.patternCount++);

    let scaleCoef = parameters.shapeWidth / (pattern.patternWidth * pattern.patternRepetition)
    let transform = "scale(" + scaleCoef + "," + scaleCoef + ")";
    if (parameters.rotation) {
      transform += "rotate(" + parameters.rotation + ")";
    }

    let patternNode = this.defs.ele("pattern")
      .att("id", id)
      .att("x", 0).att("y", 0)
      .att("width", pattern.patternWidth)
      .att("height", pattern.patternHeight)
      .att("patternUnits", "userSpaceOnUse")
      .att("patternTransform", transform);

    patternNode.ele("rect")
      .att("x", 0).att("y", 0)
      .att("width", pattern.patternWidth).att("height", pattern.patternHeight)
      .att("style", this._getFillColorProp(parameters.backgroundColor));

    let originalId = id + "_original";
    patternNode.ele("path")
      .att("d", pattern.path)
      .att("id", originalId)
      .att("style", this._getFillColorProp(parameters.patternColor));

    if (pattern.copies) {
      for (let copyTransform of pattern.copies) {
        patternNode.ele("use")
          .att("xlink:href", "#" + originalId)
          .att("transform", copyTransform)
      }
    }

    return id;
  }

  addSymbol(symbolDef) {
    let symbolId = this.definedSymbol[symbolDef.id];

    if (!symbolId) {
      symbolId = "symbol_" + symbolDef.id;
      this.definedSymbol[symbolDef.id] = symbolId;

      this.defs.ele("symbol")
        .att("id", symbolId)
        .att("width", symbolDef.width)
        .att("height", symbolDef.height)
        .att("viewBox", "0 0 " + symbolDef.width + " " + symbolDef.height)
        .raw(symbolDef.xml);
    }

    return symbolId;
  }

  _getSemeParameters(description) {
    let chargeDef = getCharge(description.chargeId);

    let tx = chargeDef.seme.tx;
    let ty = chargeDef.seme.ty;
    let h = chargeDef.height;
    let w = chargeDef.width;

    let parameters = {
      charge: chargeDef,
      color: description.chargeColor,
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

  _getPatternParameters(description, shapeBox) {
    let param = {
      backgroundColor: description.color1,
      patternColor: description.color2,
      shapeWidth: shapeBox.width
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
}