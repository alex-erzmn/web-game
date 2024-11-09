import { Exit } from "./exit";

export class MovingExit extends Exit {
    constructor(x, y) {
        super(x, y, speed, direction);
        this.speed = speed;
        this.direction = direction;
    }
}