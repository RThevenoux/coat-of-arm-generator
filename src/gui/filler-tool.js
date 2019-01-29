import getChargeOptions from './charge-provider';

export default function fillerDefaultValue() {
  return {
    pleinColor: 'azur',
    patternColor1: 'azur',
    patternColor2: 'or',
    patternAngle: 'bande',
    patternName:'echiquete',
    semeChargeId: getChargeOptions().defaultOptionId,
    semeFieldColor: 'azur',
    semeChargeColor: 'or',
    stripAngle: "0",
    stripColor1: 'azur',
    stripColor2: 'or',
    stripCount: 3
  }
}