import * as p5 from "p5";
import { CONFIG, TIME_STATE } from "../utils/Config";
import { environement } from "../index";
import Entity from "../utils/Entity";
import { FCFS, OrdonencementState, SSTF, posFractionInterval, PolitiqueR } from "../utils/Utils";
import Floor from "./Floor";
import People from "./People";
import ServerDiscret from "../utils/ServerDiscret";
import Event from "../utils/Event";
import { ElevatorState } from "../utils/Utils";

export default class Elevator extends Entity {
    static width: number = 50;
    static height: number = 100;
    static depth: number = 40;

    private doorWidth: number = Elevator.width / 2;
    private doorHeight: number = Elevator.height;
    private doorDepth: number = Elevator.depth / 10;
    private doorDisplacement: number = Elevator.width / 4;
    private doorSpeed: number = 0.15;
    private ordonencement: OrdonencementState;
    private poliiqueR: PolitiqueR;
    private previusFloor: Floor | undefined;

    public currentFloor: Floor;
    public currState: ElevatorState | undefined;
    public elevatorID: number;
    public auth: boolean = false;

    public queueDestination: Array<Floor>;
    public queueWaitingPeople: Array<People>;
    public intentions: Array<ElevatorState>;

    constructor(elevatorID: number) {
        super();
        this.elevatorID = elevatorID;
        // queues
        this.queueDestination = new Array<Floor>();
        this.queueWaitingPeople = new Array<People>();
        this.intentions = new Array<ElevatorState>();
        this.intentions.push(ElevatorState.Waiting);
        this.currState = ElevatorState.Waiting;

        // Config
        this.ordonencement = CONFIG.ordonencement;
        this.poliiqueR = CONFIG.politiqueR;

        // infos
        this.currentFloor = environement.getEntityRandom(Floor, 1);
        this.previusFloor = this.currentFloor;
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

    getTimeBetweenFloors = (floor1: Floor, floor2: Floor): number => {
        return Math.abs(floor1.floorNumber - floor2.floorNumber);
    };

    updateState = () => {
        this.currState = undefined;
        this.intentions.shift();
        var processTime;
        if (this.intentions[0] === ElevatorState.Moving)
            processTime =
                TIME_STATE[this.intentions[0]] *
                this.getTimeBetweenFloors(this.currentFloor, this.queueDestination[0]);
        else {
            processTime = TIME_STATE[this.intentions[0]];
        }
        var event = new Event(this.intentions[0], processTime, this);
        ServerDiscret.getInstance().addRequest(event);
    };

    run = (): void => {
        switch (this.currState) {
            // Wait if does't have any panned destination
            case ElevatorState.Waiting:
                if (this.queueDestination.length > 0) {
                    // Change with given ordonencement methode
                    switch (this.ordonencement) {
                        case OrdonencementState.FCFS:
                            this.queueDestination = FCFS(this.queueDestination);
                            break;
                        case OrdonencementState.SSTF:
                            //@ts-ignore
                            this.queueDestination = SSTF(this.previusFloor, this.queueDestination);
                            break;
                    }
                    this.intentions.push(ElevatorState.Moving);
                    this.updateState();
                    this.auth = true;
                } /*else if (this.auth == true) {
                    this.auth = false;
                    switch (this.poliiqueR) {
                        case PolitiqueR.Millieu:
                            var floors = environement.getEntity(Floor);
                            this.queueDestination.push(floors[Math.round(floors.length / 2)]);
                            break;
                        case PolitiqueR.Inferieur:
                            if (this.currentFloor.floorNumber != 0) {
                                var floors = environement.getEntity(Floor);
                                this.queueDestination.push(floors[this.currentFloor.floorNumber - 1]);
                            }
                            break;
                    }
                }*/
                break;

            // Update dest until arried to desired destination
            case ElevatorState.Moving:
                // Fix position
                var destination = this.queueDestination[0].getRelativeFloorPosition();
                destination.x = this.pos.x;

                if (this.hasArrived(destination, "Vert")) {
                    this.currentFloor = this.queueDestination[0];
                    this.direction = undefined;
                    this.intentions.push(ElevatorState.Opening);
                    this.updateState();
                    //if (this.queueWaitingPeople.length <= 0) this.currState = ElevatorState.Waiting;
                } else {
                    this.moveUpdate(destination);
                }
                break;

            // Open gate with given spped && wait for people waiting to be in
            case ElevatorState.Opening:
                if (!this.isDoorOpen()) {
                    CONFIG.realTime
                        ? (this.doorDisplacement += this.doorSpeed)
                        : (this.doorDisplacement = Elevator.width / 2);
                    break;
                }
                // Wait for every one waiting to get in
                //if (this.peopleWaitingForFloor(this.currentFloor).length == 0)
                this.intentions.push(ElevatorState.Closing);
                this.updateState();
                break;

            // Close gate with given spped
            case ElevatorState.Closing:
                if (!this.isDoorClose()) {
                    CONFIG.realTime
                        ? (this.doorDisplacement -= this.doorSpeed)
                        : (this.doorDisplacement = Elevator.width / 4);
                    break;
                }
                this.intentions.push(ElevatorState.Waiting);
                this.updateState();
                this.previusFloor = this.queueDestination.shift();
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
        if (this.elevatorID == 0) fill("rgba(224, 130, 131, 0.5)");
        if (this.elevatorID == 1) fill("rgba(11, 156, 49, 0.5)");
        if (this.elevatorID == 2) fill("rgba(0,0, 255, 0.6)");

        [-1, 1].forEach((sign) => {
            push();
            translate(this.doorDisplacement * sign, 0, 20);
            box(this.doorWidth, this.doorHeight, this.doorDepth);
            pop();
        });

        pop();
    };
}
