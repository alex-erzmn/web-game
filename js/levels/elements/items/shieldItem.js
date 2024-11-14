import { Item } from "./item.js";

export class ShieldItem extends Item {
    constructor(x, y) {
        super(x, y, "#0000FF", "assets/images/shield.png");
    }
}
