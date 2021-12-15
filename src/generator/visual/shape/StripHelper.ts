import { ChargeStrip } from "@/generator/model.type";
import { StripShape } from "../type";

export class StripHelper {
  private readonly mainDelta: number;
  private readonly groupOrigin: number;
  private readonly groupCount: number;
  private readonly stripByGroup: number;
  private readonly stripWidth: number;

  constructor(model: ChargeStrip, totalSize: number, origin: number) {
    this.groupCount = model.count;

    const minimalStripRatio = this._minimalGroupRatio(model);

    const groupWidth =
      totalSize / Math.max(minimalStripRatio, 2 * this.groupCount + 1);
    this.mainDelta = totalSize / (2 * this.groupCount + 1);
    this.stripByGroup = this._stripByGroup(model);

    this.stripWidth = groupWidth / (2 * this.stripByGroup - 1);
    this.groupOrigin = origin + (this.mainDelta - groupWidth) / 2;
  }

  private stripPosition(groupIndex: number, stripIndex: number): number {
    const groupPosition =
      this.groupOrigin + (2 * groupIndex + 1) * this.mainDelta;
    return groupPosition + this.stripWidth * 2 * stripIndex;
  }

  public build(
    stripBuilder: (postion: number, width: number) => StripShape
  ): StripShape[] {
    const result = [];

    for (let groupIndex = 0; groupIndex < this.groupCount; groupIndex++) {
      for (let stripIndex = 0; stripIndex < this.stripByGroup; stripIndex++) {
        const position = this.stripPosition(groupIndex, stripIndex);
        const strip = stripBuilder(position, this.stripWidth);
        result.push(strip);
      }
    }

    return result;
  }

  _stripByGroup(model: ChargeStrip): number {
    switch (model.size) {
      case "default":
      case "reduced":
      case "minimal":
        return 1;
      case "gemel":
        return 2;
      case "triplet":
        return 3;
    }
  }

  _minimalGroupRatio(model: ChargeStrip): number {
    switch (model.size) {
      case "default":
      case "gemel":
      case "triplet":
        return 3;
      case "reduced":
        return 6;
      case "minimal":
        return 12;
    }
  }
}
