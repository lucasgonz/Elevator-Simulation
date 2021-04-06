import Environement from "./environement/Environement";
import { initListners } from "./utils/LisenersEnv";
import { OrdonencementState, PolitiqueR } from "./utils/Utils";

window.onload = initListners;

// setup drawing environement
window.setup = setup;
window.draw = draw;

export const CONFIG = {
    elevator: 1,
    floor: 6,
    ordonencement: OrdonencementState.FCFS,
    politiqueR: PolitiqueR.Millieu,
};

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
