import Entity from "../utils/Entity";
import { range } from "../utils/Utils";
import Elevator from "./Elevator";
import Floor from "./Floor";
import People from "./People";

export default class Environement {
    private config: Config;

    public entities: Array<Entity>;

    constructor(config: Config) {
        this.entities = new Array<Entity>();
        this.config = config;
    }

    init = () => {
        // Regsiter entities from config
        for (var floor of range(this.config.floor)) this.entities.push(new Floor(floor - 1));
        for (var elevator of range(this.config.elevator)) this.entities.push(new Elevator(elevator - 1));
        let p = new People();
    };

    registerEntity = (entity: Entity): void => {
        this.entities.push(entity);
    };

    getEntity = (type: InstanceType<any>): InstanceType<any>[] => {
        return this.entities.filter((entity) => entity instanceof type);
    };

    render = (): void => {
        background(240);
        this.entities.forEach((entity) => {
            entity.events.shift()?.call(this);
            entity.render();
        });
    };
}
