import * as p5 from "p5";
import { environement, globalStats } from "../index";
import Entity from "../utils/Entity";
import Elevator from "./Elevator";
import Floor from "./Floor";
import { ElevatorState } from "../utils/Utils";
import Desk from "./Desk";
import ServerDiscret from "../utils/ServerDiscret";
import Event from "../utils/Event";
import { PeopleState } from "../utils/Utils";
import { getProcessTime } from "../utils/Config";

export default class People extends Entity {
    private currentElevator: Elevator;
    public currentFloor: Floor;

    private desiredDestination: p5.Vector;
    private desiredFloor: Floor;

    private color: any = color(random(255), random(255), random(255));

    public intentions: Array<PeopleState>;
    public currState: PeopleState | undefined;

    private workingTime: number = 10;
    public waiting: number = 0;

    constructor() {
        super();
        // Every one start first floor
        this.currentFloor = environement.getEntity(Floor)[0];
        this.currentElevator = this.getDesiredElevator();

        // get desired
        this.desiredDestination = this.currentElevator.getWaitingPosFloor(this.currentFloor).copy();
        this.desiredFloor = this.getDesiredFloor();

        this.intentions = [
            //Phase 1
            PeopleState.Mooving,
            PeopleState.CallElevator,
            PeopleState.Waiting,
            PeopleState.Boarding,
            PeopleState.Riding,
            PeopleState.Exiting,
            // Phase 2
            PeopleState.GoToWork,
            PeopleState.Mooving,
            PeopleState.Working,
            // Phase 3
            PeopleState.Mooving,
            PeopleState.CallElevator,
            PeopleState.Waiting,
            PeopleState.Boarding,
            PeopleState.Riding,
            PeopleState.Exiting,
            PeopleState.ExitBuilding,
            PeopleState.Mooving,
            PeopleState.Die,
        ];
        //
        this.pos = this.startPos;
    }

    get startPos() {
        var pos = this.currentFloor.getRelativeFloorPosition().copy();
        pos.x = pos.x = Math.round((width * this.randomSide) / 2);
        return pos;
    }

    // Get random flor from 1 to floor.length
    getDesiredFloor = (): Floor => {
        return environement.getEntityRandom(Floor, 1);
    };

    // Get desired elevator
    getDesiredElevator = (): Elevator => {
        return environement.getEntityRandom(Elevator);
    };

    // Add new request so elevator come to current floor
    callElevator = (number: number) => {
        var elevator = environement.getEntity(Elevator)[number];
        elevator.queueWaitingPeople.push(this);
        elevator.addRequest(this.currentFloor);
    };

    // add request to go to floor
    pressBtnFloor = (number: number) => {
        this.desiredFloor = environement.getEntity(Floor)[number];
        //@ts-ignore
        this.currentElevator?.addRequest(this.desiredFloor);
    };

    updateState = () => {
        this.currState = undefined;
        this.intentions.shift();
        var event = new Event(this.intentions[0], getProcessTime(this.intentions[0]), this);
        ServerDiscret.getInstance().addRequest(event);
    };

    run = (): void => {
        //console.log(this.currState);
        switch (this.currState) {
            // Wainting for destination
            case PeopleState.Mooving:
                if (this.hasArrived(this.desiredDestination, "Horz")) {
                    this.direction = undefined;
                    this.updateState();
                } else {
                    this.moveUpdate(this.desiredDestination);
                }
                break;

            // Moving to destination
            case PeopleState.CallElevator:
                this.events.push(this.callElevator(this.currentElevator.elevatorID));
                this.updateState();
                break;

            case PeopleState.Waiting:
                if (this.currentElevator?.currState == ElevatorState.Moving) return;
                if (this.currentElevator?.currentFloor == this.currentFloor) {
                    this.desiredDestination = this.currentElevator.pos.copy();
                    this.updateState();
                }
                break;

            case PeopleState.Boarding:
                if (this.hasArrived(this.desiredDestination, "Horz")) {
                    this.direction = undefined;
                    this.currentElevator?.removeFromWaiting(this);
                    this.pressBtnFloor(this.desiredFloor.floorNumber);
                    this.updateState();
                } else {
                    this.moveUpdate(this.desiredDestination);
                }
                break;

            case PeopleState.Riding:
                // Check si on est au floor desired
                if (this.currentElevator?.currentFloor != this.desiredFloor) {
                    //@ts-ignore
                    this.pos.y = this.currentElevator?.pos.copy().y;
                } else {
                    this.updateState();
                }
                break;
            case PeopleState.Exiting:
                //@ts-ignore
                this.currentFloor = this.currentElevator?.currentFloor;
                this.updateState();
                break;

            case PeopleState.GoToWork:
                this.desiredDestination = environement
                    .getEntity(Desk)
                    [this.currentFloor.floorNumber - 1].pos.copy();
                this.updateState();
                break;

            case PeopleState.Working:
                // if (this.workingTime == second()) {
                this.direction = undefined;
                this.currentElevator = this.getDesiredElevator();
                this.desiredDestination = this.currentElevator.getWaitingPosFloor(this.currentFloor);
                this.desiredFloor = environement.getEntity(Floor)[0];
                this.updateState();
                //}
                break;

            case PeopleState.ExitBuilding:
                var exitPos = environement.getEntity(Floor)[0].pos.copy();
                exitPos.x = width / 2;
                this.desiredDestination = exitPos;
                this.updateState();
                break;

            case PeopleState.Die:
                console.log(this.waiting);
                environement.removeEnity(this);
                break;
        }
    };

    render = (): void => {
        push();

        this.moveTo(this.pos);
        this.run();

        // draw shapes
        noStroke();
        if (this.currentElevator.elevatorID == 0) fill("rgba(224, 130, 131, 0.5)");
        if (this.currentElevator.elevatorID == 1) fill("rgba(11, 156, 49, 0.5)");
        if (this.currentElevator.elevatorID == 2) fill("rgba(58, 263, 155, 0.5)");
        //fill(this.color);
        ellipsoid(10, 20, 2, 4, 4);

        pop();
    };
}
