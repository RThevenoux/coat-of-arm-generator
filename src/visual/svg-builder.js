import xmlBuilder from 'xmlbuilder';

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

  _fillColor(key) {
    return "fill:#" + this._getColor(key) + ";";
  }

  _stroke(width) {
    return "stroke:black;stroke-width:" + width + "px;"
  }

  _getColor(key) {
    return this.palette[key];
  }

  getDefaultFiller() {
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

  getSolidFiller(key) {
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

  addSeme(parameters, shapeWidth) {
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
      .att("style", this._fillColor(parameters.fieldColor));

    let strokeWidth = this.defaultStrokeWidth / scaleCoef;

    for (let copyTransform of parameters.seme.copies) {
      patternNode.ele("use")
        .att("xlink:href", "#" + symbolId)
        .att("transform", copyTransform)
        .att("style", this._fillColor(parameters.charge.color) + this._stroke(strokeWidth));
    }

    return id;
  }

  addPattern(pattern, parameters) {
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
      .att("style", this._fillColor(parameters.backgroundColor));

    let originalId = id + "_original";
    patternNode.ele("path")
      .att("d", pattern.path)
      .att("id", originalId)
      .att("style", this._fillColor(parameters.patternColor));

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

}