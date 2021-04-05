import * as p5 from "p5";
import { CONFIG, environement } from "..";
import Entity from "../utils/Entity";
import { FCFS, isEven, OrdonencementState, SSTF, posFractionInterval } from "../utils/Utils";
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
    private doorSpeed: number = 0.15;
    private ordonencement: OrdonencementState = OrdonencementState.FCFS;

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
        this.currentFloor = environement.getEntityRandom(Floor);
        this.pos = this.getStartPos();
    }

    getStartPos = (): p5.Vector => {
        if (CONFIG.elevator == 1) return this.currentFloor.getRelativeFloorPosition().copy();
        else {
            var pos = this.currentFloor.getRelativeFloorPosition().copy();

            pos.x = posFractionInterval(
                Math.round(-width / 2),
                Math.round(width / 2),
                // 1+1 /2
                (1 + this.elevatorID) / (CONFIG.elevator + 1)
            );

            return pos;
        }
    };

    // return wating position given the number of people waiting
    getWaitingPosFloor(floor: Floor) {
        var waitingNb = this.queueWaitingPeople.filter((people) => people.currentFloor == floor).length;
        console.log(waitingNb);
        var pos = createVector(this.pos.x - (waitingNb + 1) * 40, this.pos.y, this.pos.z);
        return pos;
    }

    // return if door finisehd opened
    isDoorOpen = (): boolean => {
        return this.doorDisplacement >= Elevator.width / 2;
    };

    // return if door finisehd closed
    isDoorClose = (): boolean => {
        return this.doorDisplacement <= Elevator.width / 4;
    };

    // add floor to queue destination
    goToFloor = (floor: number) => {
        this.queueDestination.push(environement.getEntity(Floor)[floor]);
    };

    // add floor to queue dest if does not alearady exist
    addRequest = (floor: Floor) => {
        if (!this.queueDestination.includes(floor)) return this.queueDestination.push(floor);
    };

    // remove people from waiting list
    removeFromWaiting = (people: People): void => {
        var index = this.queueWaitingPeople.indexOf(people);
        this.queueWaitingPeople.splice(index, 1);
    };

    //  add people to waiting list
    peopleWaitingForFloor = (floor: Floor): Array<People> => {
        return this.queueWaitingPeople.filter((people) => people.currentFloor === this.currentFloor);
    };

    run = (): void => {
        switch (this.currState) {
            // Wait if does't have any panned destination
            case ElevatorState.Waiting:
                if (this.queueDestination.length > 0) this.currState = ElevatorState.Moving;
                break;

            // Update dest until arried to desired destination
            case ElevatorState.Moving:
                // Fix position
                var destination = this.queueDestination[0].getRelativeFloorPosition();
                destination.x = this.pos.x;
                //
                if (this.hasArrived(destination, "Vert")) {
                    this.currentFloor = this.queueDestination[0];
                    this.direction = undefined;

                    var previusFloor = this.queueDestination.shift();
                    switch (this.ordonencement) {
                        case OrdonencementState.FCFS:
                            this.queueDestination = FCFS(this.queueDestination);
                            break;
                        case OrdonencementState.SSTF:
                            //@ts-ignore
                            this.queueDestination = SSTF(previusFloor, this.queueDestination);
                    }

                    this.currState = ElevatorState.Opening;
                } else {
                    this.moveUpdate(destination);
                }
                break;

            // Open gate with given spped && wait for people waiting to be in
            case ElevatorState.Opening:
                if (!this.isDoorOpen()) {
                    this.doorDisplacement += this.doorSpeed;
                    break;
                }
                if (this.peopleWaitingForFloor(this.currentFloor).length == 0)
                    this.currState = ElevatorState.Closing;
                break;

            // Close gate with given spped
            case ElevatorState.Closing:
                if (!this.isDoorClose()) {
                    this.doorDisplacement -= this.doorSpeed;
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
