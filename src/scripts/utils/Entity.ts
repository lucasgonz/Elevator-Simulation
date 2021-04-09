import * as p5 from "p5";
import { Vector } from "p5";
import { CONFIG } from "./Config";

export default class Entity {
    private speed: number = 5;

    public pos: Vector;
    public events: Array<any>;
    public direction: string | undefined;

    constructor() {
        this.events = new Array();
        this.pos = createVector(0, 0, 0);
    }

    get randomSide() {
        // -1: left , 1 : right
        return Math.random() < 0.5 ? -1 : 1;
    }

    // update position and direction with given Vector
    moveUpdate = (destination: p5.Vector) => {
        if (CONFIG.realTime) {
            if (this.pos.x < destination.x) return (this.pos.x += this.speed), (this.direction = "right");

            if (this.pos.x > destination.x) return (this.pos.x -= this.speed), (this.direction = "left");

            if (this.pos.y <= destination.y) return (this.pos.y += this.speed), (this.direction = "down");

            if (this.pos.y >= destination.y) return (this.pos.y -= this.speed), (this.direction = "up");
        } else {
            if (this.pos.x < destination.x) return (this.pos.x = destination.x), (this.direction = "right");

            if (this.pos.x > destination.x) return (this.pos.x = destination.x), (this.direction = "left");

            if (this.pos.y <= destination.y) return (this.pos.y = destination.y), (this.direction = "down");

            if (this.pos.y >= destination.y) return (this.pos.y = destination.y), (this.direction = "up");
        }
    };

    // Apply concreate translation on environement
    moveTo = (vector: p5.Vector): void => {
        translate(vector);
    };

    // Check if arrived with vector comparaison
    // Manual check x && y cause we dont use z axis
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
