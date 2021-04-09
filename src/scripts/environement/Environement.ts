import Entity from "../utils/Entity";
import ServerDiscret from "../utils/ServerDiscret";
import { randomIntFromInterval, range } from "../utils/Utils";
import Desk from "./Desk";
import Elevator from "./Elevator";
import Floor from "./Floor";

export default class Environement {
    private config: Config;

    public entities: Array<Entity>;
    public server: ServerDiscret | undefined;

    constructor(config: Config) {
        this.entities = new Array<Entity>();
        this.config = config;
    }

    init = () => {
        // Regsiter entities from config
        // Add floors
        for (var floor of range(this.config.floor)) this.entities.push(new Floor(floor - 1));
        // Add Elevators
        for (var elevator of range(this.config.elevator)) this.entities.push(new Elevator(elevator - 1));
        // Add working desk on floor
        for (var i = 1; i < this.getEntity(Floor).length; i++)
            this.entities.push(new Desk(this.getEntity(Floor)[i]));

        ServerDiscret.instance = new ServerDiscret();
    };

    // Add new entity to environement
    registerEntity = (entity: Entity): void => {
        this.entities.push(entity);
    };

    // Get array of Entity from Type
    getEntity = (type: InstanceType<any>): InstanceType<any>[] => {
        return this.entities.filter((entity) => entity instanceof type);
    };

    // Remove Specique entity
    removeEnity = (entity: Entity): void => {
        var index = this.entities.indexOf(entity);
        this.entities.splice(index, 1);
    };

    // Get randome entity from type
    getEntityRandom = (type: InstanceType<any>, start: number = 0): InstanceType<any> => {
        var entities = this.getEntity(type);
        return entities[randomIntFromInterval(start, entities.length - 1)];
    };

    render = (): void => {
        background(240);

        // Render each entity && execute any registered action from it
        this.entities.forEach((entity) => {
            entity.events.shift()?.call(this);
            entity.render();
        });
    };
}
