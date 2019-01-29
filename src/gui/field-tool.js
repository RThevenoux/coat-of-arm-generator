import fillerDefaultValue from './filler-tool';

export default function partitionDefaultValue() {
  return {
    filler: fillerDefaultValue(),
    charges: []
  }
}