import { Circle } from "../../../gamePhysics/shapes/circle.js";

export class Item extends Circle {
    constructor(x, y, color, imagePath) {
        super(x, y, 15, color);
        this.image = new Image();
        this.image.src = imagePath;
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.stroke();
        }
    }
}
