import * as p5 from "p5";
import { environement } from "..";
import Entity from "../utils/Entity";
import Elevator from "./Elevator";
import Floor from "./Floor";

export default class Desk extends Entity {
    private width: number = 50;
    private height: number = 80;
    private depth: number = 20;

    public currFloor: Floor;

    constructor(floor: Floor) {
        super();
        this.currFloor = floor;
        this.pos = this.startPos;
    }

    get startPos() {
        var pos = this.currFloor.getRelativeFloorPosition().copy();
        pos.x = pos.x = Math.round((width * this.randomSide) / 2);
        pos.z -= 10;
        return pos;
    }

    render = (): void => {
        // set

        push();
        this.moveTo(this.pos);

        strokeWeight(2);
        fill("rgba(75%, 75%, 100%, 0.2)");

        box(this.width, this.height, this.depth);

        pop();
    };
}
