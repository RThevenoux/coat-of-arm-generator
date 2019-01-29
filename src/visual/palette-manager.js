let palettes = require("./data/palettes.json");

export default function getPalette(id) {
    return palettes[id];
}