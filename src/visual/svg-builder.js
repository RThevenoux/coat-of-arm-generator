import xmlBuilder from 'xmlbuilder';

export default class SvgBuilder {
  constructor(shape, configuration) {
    this.configuration = configuration;

    let borderSize = configuration.borderSize;
    let viewBoxSize = {
      x: -borderSize,
      y: -borderSize,
      width: parseInt(shape.width) + borderSize * 2,
      height: parseInt(shape.height) + borderSize * 2,
    };

    this.container = xmlBuilder.create('svg', { headless: true })
      .att("xmlns", "http://www.w3.org/2000/svg")
      .att("width", shape.width)
      .att("height", shape.height)
      .att("viewBox", viewBoxSize.x + " " + viewBoxSize.y + " " + viewBoxSize.width + " " + viewBoxSize.height);

    // Create "defs" section with "main-shape"
    this.defs = this.container.ele("defs");

    this.defs
      .ele("path")
      .att("id", "main-shape")
      .att("d", shape.path);

    this.patternCount = 0;
    this.definedSolidFiller = {};
  }

  fillColor(key) {
    return "fill:#" + this.getColor(key);
  }

  getColor(key) {
    return this.configuration.palette[key];
  }

  getSolidFiller(key) {
    let id = this.definedSolidFiller[key];

    if (!id) {
      id = "solid-" + key;
      this.defs.ele("linearGradient")
        .att("id", id)
        .ele("stop")
        .att("stop-color", "#" + this.getColor(key));

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
      .att("x", 0).att("y", 0).att("width", pattern.patternWidth).att("height", pattern.patternHeight)
      .att("patternUnits", "userSpaceOnUse")
      .att("patternTransform", transform);

    patternNode.ele("rect")
      .att("x", 0).att("y", 0)
      .att("width", pattern.patternWidth).att("height", pattern.patternHeight)
      .att("style", this.fillColor(parameters.backgroundColor));

    patternNode.ele("path").att("d", pattern.path).att("style", this.fillColor(parameters.patternColor));

    return id;
  }
}