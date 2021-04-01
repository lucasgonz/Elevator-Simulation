import Entity from "../utils/Entity";
import { gen_poisson, randomIntFromInterval, random_exponential, range } from "../utils/Utils";
import Elevator from "./Elevator";
import Floor from "./Floor";
import People from "./People";

export default class Environement {
    private config: Config;
    private second: number = 0;

    public entities: Array<Entity>;

    constructor(config: Config) {
        this.entities = new Array<Entity>();
        this.config = config;
    }

    init = () => {
        // Regsiter entities from config
        for (var floor of range(this.config.floor)) this.entities.push(new Floor(floor - 1));
        for (var elevator of range(this.config.elevator)) this.entities.push(new Elevator(elevator - 1));
    };

    registerEntity = (entity: Entity): void => {
        this.entities.push(entity);
    };

    getEntity = (type: InstanceType<any>): InstanceType<any>[] => {
        return this.entities.filter((entity) => entity instanceof type);
    };

    getEntityRandom = (type: InstanceType<any>, start: number = 0): InstanceType<any> => {
        var entities = this.getEntity(type);
        return entities[randomIntFromInterval(start, entities.length - 1)];
    };

    render = (): void => {
        background(240);

        // Generate new people poisson law
        if (this.second != second()) {
            for (var val of gen_poisson(0.3, 1)) {
                this.entities.push(new People());
            }

            this.second = second();
        }

        this.entities.forEach((entity) => {
            entity.events.shift()?.call(this);
            entity.render();
        });
    };
}
