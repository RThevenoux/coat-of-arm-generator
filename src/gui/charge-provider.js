let options = require("./data/charges.json");
let defaultOptionId = 'billette';

export default function getChargeOptions() {
  return {
    options: options,
    defaultOptionId: defaultOptionId
  }
}