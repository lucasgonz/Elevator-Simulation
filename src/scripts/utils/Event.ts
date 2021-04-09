import ServerDiscret from "./ServerDiscret";

export default class Event {
    public processTime: number;
    public state: any;
    public self: any;

    public callback: Function | undefined;

    constructor(state: any, processTime: number, self: any) {
        this.processTime = processTime + ServerDiscret.clock;
        this.state = state;
        this.self = self;
    }

    execute = () => {
        //console.log(this.self);
        this.self.currState = this.state;
    };
}
