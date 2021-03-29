import { environement } from "..";
import Entity from "../utils/Entity";
import Elevator from "./Elevator";
import Floor from "./Floor";

enum PeopleState {
    Mooving,
    Waiting,
    Boarding,
    Riding,
    Exiting,
    Exited,
}

export default class People extends Entity {
    private currentElevator: Elevator | undefined;
    private currentFloor: Floor;

    public currState: PeopleState;

    constructor() {
        super();
        environement.registerEntity(this);
        this.currentFloor = environement.getEntity(Floor)[0];
        this.currState = PeopleState.Mooving;

        //
        this.pos = this.currentFloor.getRelativeFloorPosition();
        this.pos.x = -width / 2;

        this.callElevator(0);
    }

    get randomSide() {
        return Math.random() < 0.5 ? "right" : "left";
    }

    callElevator = (number: number) => {
        var elevator = environement.getEntity(Elevator)[number];
        elevator.queueWaitingPeople.push(this);
        elevator.queueDestination.push(this.currentFloor);
    };

    run = (): void => {
        switch (this.currState) {
            // Wainting for destination
            case PeopleState.Mooving:

            // Moving to destination
            case PeopleState.Waiting:
            case PeopleState.Boarding:
            case PeopleState.Riding:
            case PeopleState.Exiting:
            case PeopleState.Exited:
        }
    };

    render = (): void => {
        push();

        this.moveTo(this.pos);

        // draw shapes
        noStroke();
        fill("rgb(0,0,255)");
        ellipsoid(10, 20, 2, 4, 4);
        pop();
    };
}
