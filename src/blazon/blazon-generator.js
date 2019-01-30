import { toLabel } from './field-labeller';

export default function generateBlazon(model) {
  if (!model) {
    return "[empty]";
  }
  
  let label = toLabel(model);
  return capitalizeFirstLetter(label);
}

function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}