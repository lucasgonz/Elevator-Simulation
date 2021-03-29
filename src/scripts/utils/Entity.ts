import * as p5 from "p5";
import { Vector } from "p5";
import Environement from "../environement/Environement";

export default class Entity {
    public pos: Vector;

    public events: Array<Function>;

    constructor() {
        this.events = new Array();
        this.pos = createVector(0, 0, 0);
    }

    moveTo = (vector: p5.Vector): void => {
        translate(vector);
    };

    render = (): void => {};
}
