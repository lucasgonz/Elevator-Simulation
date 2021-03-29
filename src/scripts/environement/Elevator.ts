import { environement } from "..";
import Entity from "../utils/Entity";
import Floor from "./Floor";
import People from "./People";

enum ElevatorState {
    Waiting,
    Moving,
    Opening,
    Closing,
}

export default class Elevator extends Entity {
    static width: number = 50;
    static height: number = 100;
    static depth: number = 40;

    private doorWidth: number = Elevator.width / 2;
    private doorHeight: number = Elevator.height;
    private doorDepth: number = Elevator.depth / 10;

    public currentFloor: Floor;
    public currState: ElevatorState;
    public elevatorID: number;

    public queueDestination: Array<Floor>;
    public queueWaitingPeople: Array<People>;

    constructor(elevatorID: number) {
        super();
        this.elevatorID = elevatorID;
        this.queueDestination = new Array<Floor>();
        this.queueWaitingPeople = new Array<People>();
        this.currState = ElevatorState.Waiting;
        this.currentFloor = environement.getEntity(Floor)[1];
        this.pos = this.currentFloor.getRelativeFloorPosition();
        //this.goToFloor(4);
    }

    // return direction for closest destination
    get direction() {
        if (this.currentFloor.floorNumber < this.queueDestination[0].floorNumber) return "up";
        else return "down";
    }

    // return wating position given the number of people waiting
    get waitingPos() {
        var pos = createVector(this.pos.x + this.queueWaitingPeople.length * 10, this.pos.y, this.pos.z);
        return pos;
    }

    goToFloor = (floor: number) => {
        this.queueDestination.push(environement.getEntity(Floor)[floor]);
    };

    hasArrived = (): boolean => {
        // division is for pixel translation floor
        return this.pos.y === this.queueDestination[0].getRelativeFloorPosition().y;
    };

    run = (): void => {
        switch (this.currState) {
            // Wainting for destination
            case ElevatorState.Waiting:
                if (this.queueDestination.length > 0) this.currState = ElevatorState.Moving;
                break;

            // Moving to destination
            case ElevatorState.Moving:
                if (this.hasArrived()) {
                    this.queueDestination.shift();
                    // Check if more dest to do
                    if (this.queueDestination.length == 0) this.currState = ElevatorState.Waiting;
                } else {
                    this.direction == "up" ? (this.pos.y -= 1) : (this.pos.y += 1);
                }
                break;

            case ElevatorState.Opening:
            case ElevatorState.Closing:
        }
    };

    render = (): void => {
        push();

        // move this to final position
        this.moveTo(this.pos);

        this.run();

        // then draw body
        strokeWeight(2);
        fill("rgba(75%, 75%, 100%, 0.2)");
        translate(0, 0, -25);
        box(Elevator.width, Elevator.height, Elevator.depth);

        // draw dors
        fill("rgba(75%, 100%, 75%, 0.5)");
        translate(0, 0, 20);
        box(this.doorWidth, this.doorHeight, this.doorDepth);

        pop();
    };
}
