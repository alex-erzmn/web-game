import { Obstacle } from "./obstacle.js";

export class MovingObstacle extends Obstacle {
    constructor(x, y, dx, dy, width, height, color) {
        super(x, y, width, height, color);
        this.dx = dx;
        this.dy = dy;
        this.speed = 300
        
        // Normalize the direction vector to maintain consistent speed
        const magnitude = Math.sqrt(this.dx ** 2 + this.dy ** 2);
        if (magnitude !== 0) {
            this.dx /= magnitude;
            this.dy /= magnitude;
        }
    }

    update(delta) {
        this.x += this.dx * this.speed * delta;
        this.y += this.dy * this.speed * delta;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}
