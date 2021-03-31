import * as p5 from "p5";
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
    CallElevator,
}

export default class People extends Entity {
    private currentElevator: Elevator | undefined;
    private currentFloor: Floor;
    private desiredDestination: p5.Vector;
    private desiredFloor: Floor | undefined;
    private color: any = color(random(255), random(255), random(255));

    public currState: PeopleState;

    constructor() {
        super();
        //environement.registerEntity(this);
        this.currentFloor = environement.getEntity(Floor)[0];
        this.desiredDestination = environement.getEntity(Elevator)[0].waitingPos;
        this.currState = PeopleState.Mooving;

        //
        this.pos = this.currentFloor.getRelativeFloorPosition();
        this.pos.x = Math.round(-width / 2);
    }

    get randomSide() {
        return Math.random() < 0.5 ? "right" : "left";
    }

    callElevator = (number: number) => {
        var elevator = environement.getEntity(Elevator)[number];
        elevator.queueWaitingPeople.push(this);
        elevator.addRequest(this.currentFloor);
    };

    pressBtnFloor = (number: number) => {
        this.desiredFloor = environement.getEntity(Floor)[number];
        //@ts-ignore
        this.currentElevator?.addRequest(this.desiredFloor);
    };

    run = (): void => {
        switch (this.currState) {
            // Wainting for destination
            case PeopleState.Mooving:
                if (this.hasArrived(this.desiredDestination, "Horz")) {
                    this.currState = PeopleState.CallElevator;
                    this.direction = undefined;
                } else {
                    this.moveUpdate(this.desiredDestination);
                }
                break;

            // Moving to destination
            case PeopleState.CallElevator:
                this.events.push(this.callElevator(0));
                this.currentElevator = environement.getEntity(Elevator)[0];
                this.currState = PeopleState.Waiting;
                break;

            case PeopleState.Waiting:
                if (this.currentElevator?.currentFloor == this.currentFloor) {
                    this.desiredDestination = this.currentElevator.pos;
                    this.currState = PeopleState.Boarding;
                }
                break;

            case PeopleState.Boarding:
                if (this.hasArrived(this.desiredDestination, "Horz")) {
                    this.currState = PeopleState.Riding;
                    this.direction = undefined;
                    this.pressBtnFloor(3);
                } else {
                    this.moveUpdate(this.desiredDestination);
                }

            case PeopleState.Riding:
                if (this.currentElevator?.currentFloor != this.desiredFloor)
                    //@ts-ignore
                    this.pos.y = this.currentElevator?.pos.y;
                else {
                    this.currState = PeopleState.Exiting;
                    console.log("I exited");
                }
                break;
            case PeopleState.Exiting:
            case PeopleState.Exited:
        }
    };

    render = (): void => {
        push();

        this.moveTo(this.pos);
        this.run();

        // draw shapes
        noStroke();
        fill(this.color);
        ellipsoid(10, 20, 2, 4, 4);
        pop();
    };
}
