import * as p5 from "p5";
import { environement } from "..";
import Entity from "../utils/Entity";
import Elevator from "./Elevator";
import Floor from "./Floor";
import { ElevatorState } from "./Elevator";

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
    public currentFloor: Floor;
    private desiredDestination: p5.Vector;
    private desiredFloor: Floor;
    private color: any = color(random(255), random(255), random(255));

    public currState: PeopleState;

    constructor() {
        super();
        // Every one start first floor
        this.currentFloor = environement.getEntity(Floor)[0];
        this.desiredFloor = this.getDesiredFloor();
        this.desiredDestination = this.getDesiredElevator().waitingPos;
        this.currState = PeopleState.Mooving;
        //
        this.pos = this.startPos;
    }

    get randomSide() {
        // -1: left , 1 : right
        return Math.random() < 0.5 ? -1 : 1;
    }

    get startPos() {
        var pos = this.currentFloor.getRelativeFloorPosition().copy();
        pos.x = pos.x = Math.round((width * this.randomSide) / 2);
        return pos;
    }

    getDesiredFloor = (): Floor => {
        return environement.getEntityRandom(Floor, 1);
    };

    getDesiredElevator = (): Elevator => {
        return environement.getEntityRandom(Elevator);
    };

    callElevator = (number: number) => {
        var elevator = environement.getEntity(Elevator)[number];
        elevator.queueWaitingPeople.push(this);
        console.log(elevator.addRequest(this.currentFloor));
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
                    this.direction = undefined;
                    this.currState = PeopleState.CallElevator;
                } else {
                    this.moveUpdate(this.desiredDestination);
                }
                break;

            // Moving to destination
            case PeopleState.CallElevator:
                this.currentElevator = this.getDesiredElevator();
                this.events.push(this.callElevator(this.currentElevator.elevatorID));
                this.currState = PeopleState.Waiting;
                break;

            case PeopleState.Waiting:
                if (this.currentElevator?.currState == ElevatorState.Moving) return;
                if (this.currentElevator?.currentFloor == this.currentFloor) {
                    this.desiredDestination = this.currentElevator.pos.copy();
                    this.currState = PeopleState.Boarding;
                }
                break;

            case PeopleState.Boarding:
                if (this.hasArrived(this.desiredDestination, "Horz")) {
                    this.direction = undefined;
                    this.currentElevator?.removeFromWaiting(this);
                    console.log(this.currentElevator?.queueWaitingPeople);
                    this.pressBtnFloor(this.desiredFloor.floorNumber);
                    this.currState = PeopleState.Riding;
                } else {
                    this.moveUpdate(this.desiredDestination);
                }
                break;

            case PeopleState.Riding:
                if (this.currentElevator?.currentFloor != this.desiredFloor) {
                    //@ts-ignore
                    this.pos.y = this.currentElevator?.pos.copy().y;
                    //@ts-ignore
                    this.currentFloor = this.currentElevator?.currentFloor;
                } else {
                    this.currState = PeopleState.Exiting;
                }
                break;
            case PeopleState.Exiting:
                this.currentElevator = undefined;
                break;
            case PeopleState.Exited:
                break;
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
