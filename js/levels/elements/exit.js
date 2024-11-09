import { Circle } from "../../gamePhysics/shapes/circle.js";

export class Exit extends Circle {
    constructor(x, y) {
        super(x, y, 10, "yellow");
    }

    draw(ctx) {
        ctx.save();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();

        ctx.restore();
    }
}
