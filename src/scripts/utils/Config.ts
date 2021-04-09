import { OrdonencementState, PolitiqueR, randomIntFromInterval, toSeconds } from "./Utils";
import { ElevatorState } from "../utils/Utils";
import { PeopleState } from "../utils/Utils";

export const CONFIG = {
    elevator: 1,
    floor: 5,
    ordonencement: OrdonencementState.FCFS,
    politiqueR: PolitiqueR.Millieu,
    realTime: false,
};

// seconds

export const TIME_STATE = {
    [ElevatorState.Waiting]: 0,
    [ElevatorState.Closing]: 0,
    [ElevatorState.Opening]: 0,
    [ElevatorState.Waiting]: 0,
    [ElevatorState.Moving]: 10,
    [PeopleState.Boarding]: 0,
    [PeopleState.CallElevator]: 0,
    [PeopleState.Die]: 0,
    [PeopleState.ExitBuilding]: 0,
    [PeopleState.Exiting]: 0,
    [PeopleState.GoToWork]: 5,
    [PeopleState.Mooving]: 0,
    [PeopleState.Riding]: 0,
    [PeopleState.Waiting]: 0,
    [PeopleState.Working]: toSeconds(randomIntFromInterval(0, 60)),
};

/*export function getProcessTime(state: any) {
    switch (state) {
        case ElevatorState.Closing:
            return 3;
        case ElevatorState.Opening:
            return 3;
        case ElevatorState.Waiting:
            return 0;
        case ElevatorState.Moving:
            return 10;

        case PeopleState.Boarding:
            return 2;
        case PeopleState.CallElevator:
            return 1;
        case PeopleState.Die:
            return 0;
        case PeopleState.ExitBuilding:
            return 5;
        case PeopleState.Exiting:
            return 2;
        case PeopleState.GoToWork:
            return 5;
        case PeopleState.Mooving:
            return 10;
        case PeopleState.Riding:
            return 0;
        case PeopleState.Waiting:
            return 0;
        case PeopleState.Working:
            return toSeconds(randomIntFromInterval(0, 60));

        default:
            return 0;
    }
}*/
