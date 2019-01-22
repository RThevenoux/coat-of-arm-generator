import xmlBuilder from 'xmlbuilder';
import paper from 'paper-jsdom';

import getCharge from './charge-manager';

let patterns = require("./data/patterns.json");

export default class SvgBuilder {
  constructor(viewBoxSize, palette, defaultStrokeWidth) {
    this.palette = palette;
    this.defaultStrokeWidth = defaultStrokeWidth;

    this.container = xmlBuilder.create('svg', { headless: true })
      .att("xmlns", "http://www.w3.org/2000/svg")
      .att("viewBox", viewBoxSize.x + " " + viewBoxSize.y + " " + viewBoxSize.width + " " + viewBoxSize.height);

    // Create "defs" section
    this.defs = this.container.ele("defs");

    this.patternCount = 0;
    this.definedSolidFiller = {};
    this.definedSymbol = {};
    this.defaultFillerId = null;
  }

  fill(fillerModel, path) {
    if (!fillerModel) {
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
    let x = path.bounds.x;
    let y = path.bounds.y;
    let w = path.bounds.width;
    let h = path.bounds.height;

    switch (fillerModel.angle) {
      case "0": {
        let hStrip = h / (2 * fillerModel.count);
        let def = {
          point: [x, y],
          size: [w, hStrip]
        }
        let stripPath = new paper.Path.Rectangle(def);
        let stripVector = [0, hStrip];
        this._fillMultipleStrips(path, stripPath, stripVector, fillerModel.count, fillerModel.color1, fillerModel.color2);
      } break;
      case "45": {
        let wStrip = w / fillerModel.count;
        let stripPathData
          = "M " + (x) + "," + y
          + " L " + (x + wStrip) + "," + y
          + " " + (x - w + wStrip) + "," + (y + h)
          + " " + (x - w) + "," + (y + h)
          + " z";
        let stripPath = new paper.Path(stripPathData);
        let stripVector = [wStrip, 0];
        this._fillMultipleStrips(path, stripPath, stripVector, fillerModel.count, fillerModel.color1, fillerModel.color2);
      } break;
      case "90": {
        let wStrip = w / (2 * fillerModel.count);
        let def = {
          point: [x, y],
          size: [wStrip, h]
        }
        let stripPath = new paper.Path.Rectangle(def);
        let stripVector = [wStrip, 0];
        this._fillMultipleStrips(path, stripPath, stripVector, fillerModel.count, fillerModel.color1, fillerModel.color2);
      } break;
      case "135": {
        let wStrip = w / fillerModel.count;
        let stripPathData
          = "M " + (x - w) + "," + y
          + " L " + (x - w + wStrip) + "," + y
          + " " + (x + wStrip) + "," + (y + h)
          + " " + (x) + "," + (y + h)
          + " z";
        let stripPath = new paper.Path(stripPathData);
        let stripVector = [wStrip, 0];
        this._fillMultipleStrips(path, stripPath, stripVector, fillerModel.count, fillerModel.color1, fillerModel.color2);
      } break;
      default:
        let defaultFillerId = this._getDefaultFiller();
        this._fillPath(defaultFillerId, path);
    }
  }

  _fillMultipleStrips(container, stripPath, stripVector, count, color1, color2) {
    let color1Id = this._getSolidFiller(color1);
    let color2Id = this._getSolidFiller(color2);

    for (let i = 0; i < count; i++) {
      this._fillPath(color1Id, container.intersect(stripPath));
      stripPath.translate(stripVector);
      this._fillPath(color2Id, container.intersect(stripPath));
      stripPath.translate(stripVector);
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

    let symbolId = this._addSymbol(parameters.charge);

    let scaleCoef = shapeWidth / (box.width * parameters.seme.repetition)
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
        .att("style", this._getFillColorProp(parameters.charge.color) + this._stroke(strokeWidth));
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

  _addSymbol(symbol) {
    let symbolId = this.definedSymbol[symbol.id];

    if (!symbolId) {
      symbolId = "symbol_" + symbol.id;
      this.definedSymbol[symbol.id] = symbolId;

      this.defs.ele("symbol")
        .att("id", symbolId)
        .att("width", symbol.width)
        .att("height", symbol.height)
        .att("viewBox", "0 0 " + symbol.width + " " + symbol.height)
        .raw(symbol.xml);
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