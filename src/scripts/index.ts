import Environement from "./environement/Environement";
import { initListners } from "./utils/LisenersEnv";

window.onload = initListners;

// setup drawing environement
window.setup = setup;
window.draw = draw;

export const CONFIG = {
    elevator: 3,
    floor: 6,
    ordonencement: "FCFS",
    politiqueR: "Millieu",
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
