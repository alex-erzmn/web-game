import { Rectangle } from "../../../gamePhysics/shapes/rectangle.js";

export class Obstacle extends Rectangle {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}
