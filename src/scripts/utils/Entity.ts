import * as p5 from "p5";
import { Vector } from "p5";
import Environement from "../environement/Environement";

export default class Entity {
    private speed: number = 3;

    public pos: Vector;
    public events: Array<any>;
    public direction: string | undefined;

    constructor() {
        this.events = new Array();
        this.pos = createVector(0, 0, 0);
    }

    /*getPos() {
        this.pos.x = Math.round(this.pos.x);
        this.pos.y = Math.round(this.pos.y);
        this.pos.z = Math.round(this.pos.z);
        return this.pos;
    }*/

    moveUpdate = (destination: p5.Vector) => {
        if (this.pos.x < destination.x) return (this.pos.x += this.speed), (this.direction = "right");

        if (this.pos.x > destination.x) return (this.pos.x -= this.speed), (this.direction = "left");

        if (this.pos.y <= destination.y) return (this.pos.y += this.speed), (this.direction = "down");

        if (this.pos.y >= destination.y) return (this.pos.y -= this.speed), (this.direction = "up");
    };

    moveTo = (vector: p5.Vector): void => {
        translate(vector);
    };

    hasArrived = (destination: p5.Vector, axis: string): boolean => {
        if (axis === "Horz") {
            if (this.direction == "right") return this.pos.x >= destination.x;
            if (this.direction == "left") return this.pos.x <= destination.x;
        }

        if (axis === "Vert") {
            if (this.direction == "up") return this.pos.y <= destination.y;
            if (this.direction == "down") return this.pos.y >= destination.y;
        }
        return false;
    };

    render = (): void => {};
}
