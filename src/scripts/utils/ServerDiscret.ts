import People from "../environement/People";
import Event from "./Event";
import { gen_poisson, hms, random_exponential, toSeconds } from "./Utils";
import { environement } from "..";
import { TIME_STATE } from "./Config";
import { PeopleState } from "../utils/Utils";

export default class ServerDiscret {
    public static instance: ServerDiscret;
    public static clock: number;
    public eventQueue: Array<Event> = new Array<Event>();

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
            this.eventQueue.splice(this.eventQueue.indexOf(el), 1);
        });
    };

    run(): void {
        // time to add for next arrival poisson number
        var events = new Array();

        for (var processTime of gen_poisson(3, 0.01)) {
            // process Time to seconds
            processTime = toSeconds(processTime * 60);

            var people = new People();
            // register in environement
            environement.entities.push(people);
            // Schedule arrival
            events.push(new Event(people.intentions[0], processTime, people));
        }

        // fill events
        events.forEach((event: Event) => this.eventQueue.push(event));

        var lastClock = Number(ServerDiscret.clock);

        // Avance clock to closest event
        ServerDiscret.clock = this.getClosestEventTime(this.eventQueue, ServerDiscret.clock);

        environement
            .getEntity(People)
            .filter((people: People) => people.currState === PeopleState.Waiting)
            .forEach((people: People) => {
                people.waiting += ServerDiscret.clock - lastClock;
            });

        // process event with right time
        this.process();
        //console.log(hms(ServerDiscret.clock));
    }
}
