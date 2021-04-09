import People from "../environement/People";
import Event from "./Event";
import { gen_poisson, hms } from "./Utils";
import { environement } from "..";
import { TIME_STATE } from "./Config";
import { PeopleState } from "../utils/Utils";

export default class ServerDiscret {
    public static instance: ServerDiscret;
    static walkingTime: number = 6;
    static clock: number;

    public eventQueue: Array<Event> = new Array<Event>();
    public debug: boolean = true;

    constructor() {
        ServerDiscret.clock = 0;
        setInterval(() => {
            this.run();
        }, 100);
    }

    public static getInstance(): ServerDiscret {
        return ServerDiscret.instance;
    }

    addRequest = (event: Event): void => {
        this.eventQueue.push(event);
    };

    getClosestEventTime = (events: Array<Event>, time: number): number => {
        if (events.length == 0) return time;
        if (events.length == 1) return events[0].processTime;

        const closest = events.reduce((prev: Event, curr: Event) => {
            return Math.abs(curr.processTime - time) < Math.abs(prev.processTime - time) ? curr : prev;
        });

        return closest.processTime;
    };

    process = (): void => {
        // get event to process ==> time under clock
        var toProcess = this.eventQueue.filter((event) => event.processTime <= ServerDiscret.clock);

        toProcess.forEach((el: Event) => {
            el.execute();
            //console.log(hms(ServerDiscret.clock), el.state, ` Process time ${getProcessTime(el.state)}`);
            this.eventQueue.splice(this.eventQueue.indexOf(el), 1);
        });
    };

    run(): void {
        // time to add for next arrival poisson number
        var events = new Array();

        //if (this.debug) {
        for (var processTime of gen_poisson(0.5, 0.05)) {
            // Scale number esier read
            processTime = Math.round(processTime * 100);
            //if (this.debug) {
            var people = new People();
            // register in environement
            environement.entities.push(people);
            // Schedule arrival
            events.push(new Event(people.intentions[0], 5, people));
            this.debug = false;
        }

        // fill events
        events.forEach((event: Event) => this.eventQueue.push(event));

        var lastClock = Number(ServerDiscret.clock);

        ServerDiscret.clock = this.getClosestEventTime(this.eventQueue, ServerDiscret.clock);

        environement
            .getEntity(People)
            .filter((people: People) => people.currState === PeopleState.Waiting)
            .forEach((people: People) => {
                people.waiting += ServerDiscret.clock - lastClock;
                //console.log(people.waiting);
            });

        // process event with right time
        this.process();
    }
}
