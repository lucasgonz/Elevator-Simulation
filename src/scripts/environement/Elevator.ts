import * as p5 from "p5";
import { environement } from "..";
import Entity from "../utils/Entity";
import Floor from "./Floor";
import People from "./People";

export enum ElevatorState {
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
    private doorDisplacement: number = Elevator.width / 4;

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
        this.pos = this.currentFloor.getRelativeFloorPosition().copy();

        //this.goToFloor(3);
    }

    // return direction for closest destination

    // return wating position given the number of people waiting
    get waitingPos() {
        var pos = createVector(this.pos.x - (this.queueWaitingPeople.length + 1) * 40, this.pos.y, this.pos.z);
        return pos;
    }

    isDoorOpen = (): boolean => {
        return this.doorDisplacement >= Elevator.width / 2;
    };

    isDoorClose = (): boolean => {
        return this.doorDisplacement <= Elevator.width / 4;
    };

    goToFloor = (floor: number) => {
        this.queueDestination.push(environement.getEntity(Floor)[floor]);
    };

    updateFloor = () => {};

    addRequest = (floor: Floor) => {
        if (!this.queueDestination.includes(floor)) return this.queueDestination.push(floor);
    };

    removeFromWaiting = (people: People): void => {
        var index = this.queueWaitingPeople.indexOf(people);
        this.queueWaitingPeople.splice(index, 1);
    };

    peopleWaitingForFloor = (floor: Floor): Array<People> => {
        return this.queueWaitingPeople.filter((people) => people.currentFloor === this.currentFloor);
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
                    this.currState = ElevatorState.Opening;
                } else {
                    this.moveUpdate(this.queueDestination[0].getRelativeFloorPosition());
                }
                break;

            case ElevatorState.Opening:
                if (!this.isDoorOpen()) {
                    this.doorDisplacement += 0.1;
                    break;
                }
                if (this.peopleWaitingForFloor(this.currentFloor).length == 0)
                    this.currState = ElevatorState.Closing;
                break;
            case ElevatorState.Closing:
                if (!this.isDoorClose()) {
                    this.doorDisplacement -= 0.1;
                    break;
                }
                this.currState = ElevatorState.Waiting;
                break;
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
        [-1, 1].forEach((sign) => {
            push();
            translate(this.doorDisplacement * sign, 0, 20);
            box(this.doorWidth, this.doorHeight, this.doorDepth);
            pop();
        });

        pop();
    };
}
