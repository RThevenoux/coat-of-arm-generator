var colorNames = require("./colorNames.json");

export default function generateBlazon(model) {

    let label = getFiller(model)

    // Capitalize first letter
    return label.charAt(0).toUpperCase() + label.slice(1);
}

function getFiller(model) {
    switch (model.type) {
        case "plein": {
            return colorNames[model.color];
        }
        case "echiquete": {
            return "échiqueté " + colorNames[model.color1] + " et " + colorNames[model.color2];
        }
        case "losange": {
            return "losangé " + colorNames[model.color1] + " et " + colorNames[model.color2];
        }
        case "fusele": {
            let start = "fuselé ";
            switch (model.angle) {
                case "bande": start += "en bande "; break;
                case "barre": start += "en barre "; break;
                case "defaut": break;
                default: return "invalid-angle:" + model.angle;
            }
            return start + colorNames[model.color1] + " et " + colorNames[model.color2];
        }
        default: {
            return "unsupported-type:" + model.type;
        }
    }
}