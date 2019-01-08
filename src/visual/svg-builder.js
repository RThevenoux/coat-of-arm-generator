import xmlBuilder from 'xmlbuilder';

export default class SvgBuilder {
  constructor(viewBoxSize, palette) {
    this.palette = palette;

    this.container = xmlBuilder.create('svg', { headless: true })
      .att("xmlns", "http://www.w3.org/2000/svg")
      .att("viewBox", viewBoxSize.x + " " + viewBoxSize.y + " " + viewBoxSize.width + " " + viewBoxSize.height);

    // Create "defs" section
    this.defs = this.container.ele("defs");

    this.patternCount = 0;
    this.definedSolidFiller = {};
  }

  _fillColor(key) {
    return "fill:#" + this._getColor(key);
  }

  _getColor(key) {
    return this.palette[key];
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

}