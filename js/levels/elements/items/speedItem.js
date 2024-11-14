import { Item } from "./item.js";

export class SpeedItem extends Item {
    constructor(x, y) {
        super(x, y, "#00FF00", "assets/images/speed.png");
    }
}
