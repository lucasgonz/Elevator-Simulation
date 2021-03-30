import * as p5 from "p5";
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
        this.currentFloor = environement.getEntity(Floor)[4];
        this.pos = this.currentFloor.getRelativeFloorPosition();
        //this.goToFloor(3);
    }

    // return direction for closest destination

    // return wating position given the number of people waiting
    get waitingPos() {
        var pos = createVector(this.pos.x - (this.queueWaitingPeople.length + 1) * 40, this.pos.y, this.pos.z);
        return pos;
    }

    goToFloor = (floor: number) => {
        console.log(environement.getEntity(Floor)[floor]);
        this.queueDestination.push(environement.getEntity(Floor)[floor]);
    };

    addRequest = (floor: Floor) => {
        if (!this.queueDestination.includes(floor)) this.queueDestination.push(floor);
    };

    run = (): void => {
        switch (this.currState) {
            // Wainting for destination
            case ElevatorState.Waiting:
                if (this.queueDestination.length > 0) this.currState = ElevatorState.Moving;
                break;

            // Moving to destination
            case ElevatorState.Moving:
                if (this.hasArrived(this.queueDestination[0].getRelativeFloorPosition(), "Vert")) {
                    this.currentFloor = this.queueDestination[0];
                    this.direction = undefined;
                    this.queueDestination.shift();
                    // Check if more dest to do
                    if (this.queueDestination.length == 0) this.currState = ElevatorState.Waiting;
                } else {
                    this.moveUpdate(this.queueDestination[0].getRelativeFloorPosition());
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
