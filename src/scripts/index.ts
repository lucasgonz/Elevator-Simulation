import Environement from "./environement/Environement";
import { initListners } from "./utils/LisenersEnv";
import { CONFIG } from "./utils/Config";
import Chart from "chart.js/auto";
import ServerDiscret from "./utils/ServerDiscret";

window.onload = initListners;

// setup drawing environement
window.setup = setup;
window.draw = draw;

export const globalStats = {
    waitingPerception: new Array<number>(),
    death: 0,
};

export var environement: Environement = new Environement(CONFIG);

export function resetSimulation() {
    environement = new Environement(CONFIG);
    environement.init();
    myChart.data.labels = [];
    myChart.data.datasets[0].data = [];

    myChart.update();
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

// @ts-ignore
var ctx = document.getElementById("myChart").getContext("2d");

export var myChart = new Chart(ctx, {
    type: "line",
    data: {
        //@ts-ignore
        labels: [],
        datasets: [
            {
                label: "waitingTime",
                data: [],
                backgroundColor: "rgba(54, 49, 235, 1)",
                borderColor: "rgba(54, 49, 235, 1)",
                borderWidth: 1,
            },
        ],
    },
    options: {
        scales: {},
    },
});
