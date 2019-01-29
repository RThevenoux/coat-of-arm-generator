import fillerDefaultValue from './fillerTool';

export default function partitionDefaultValue() {
  return {
    filler: fillerDefaultValue(),
    charges: []
  }
}