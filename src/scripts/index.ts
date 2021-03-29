import * as $ from "jquery";
import Elevator from "../scripts/environement/Elevator";
import Environement from "./environement/Environement";
import { range } from "./utils/Utils";

// setup drawing environement
window.setup = setup;
window.draw = draw;

const CONFIG = {
    elevator: 1,
    floor: 6,
};

export var environement: Environement = new Environement(CONFIG);

function setup() {
    var canvas = createCanvas(window.innerWidth * 0.75, window.innerHeight, WEBGL);
    canvas.parent("canvasContainer");
    environement.init();
}

function draw() {
    // allow cursor rotation
    orbitControl();
    // setup camera initial
    translate(0, 90, -300);
    environement.render();

    rotateX(90);
}
