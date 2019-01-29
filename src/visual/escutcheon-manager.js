import paper from 'paper-jsdom';

let escutcheons = require("./data/escutcheons.json");

export default function getEscutcheonPath(id) {
    console.log("getEscutcheonPath "+id);
    let escutcheonData = escutcheons[id];
    let escutcheonPath = new paper.Path(escutcheonData);
    return escutcheonPath;
}