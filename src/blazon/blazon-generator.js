var colorNames = require("./colorNames.json");

export default function generateBlazon(model) {
    let label = colorNames[model.color];

    // Capitalize first letter
    return label.charAt(0).toUpperCase() + label.slice(1);
}