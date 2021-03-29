import * as p5 from "p5";
import Entity from "../utils/Entity";
import Elevator from "./Elevator";

export default class Floor extends Entity {
    private width: number = width;
    private height: number = 2;
    private depth: number = 20;
    private floorDisplacement: number = Elevator.height + 50;

    public floorNumber: number;

    constructor(floorNumber: number) {
        super();
        this.floorNumber = floorNumber;
        this.floorDisplacement *= floorNumber;
        this.pos.y = height / 2 - this.floorDisplacement;
    }

    getRelativeFloorPosition = (): p5.Vector => {
        var pos = createVector(this.pos.x, this.pos.y - 55, this.depth);
        return pos;
    };

    render = (): void => {
        // set
        push();
        strokeWeight(2);
        if (this.floorNumber == 0) stroke(255, 204, 0);
        translate(this.pos);
        box(this.width, this.height, this.depth);
        pop();
    };
}
