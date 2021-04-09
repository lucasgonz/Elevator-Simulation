import Environement from "./environement/Environement";
import { initListners } from "./utils/LisenersEnv";
import { CONFIG } from "./utils/Config";
import { ElevatorState, random_exponential } from "./utils/Utils";

window.onload = initListners;

// setup drawing environement
window.setup = setup;
window.draw = draw;

export const globalStats = {
    waitingPerception: new Array<number>(),
};

export var environement: Environement = new Environement(CONFIG);

export function resetSimulation() {
    environement = new Environement(CONFIG);
    environement.init();
}

function setup() {
    var canvas = createCanvas(window.innerWidth * 0.7, window.innerHeight, WEBGL);
    canvas.parent("canvasContainer");
    resetSimulation();
}

function draw() {
    // allow cursor rotation
    orbitControl();
    // setup camera initial
    translate(0, 90, -300);
    // environement life cycle
    environement.render();
}
