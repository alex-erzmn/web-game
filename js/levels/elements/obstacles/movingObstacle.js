import { Obstacle } from "./obstacle.js";
import { Sounds } from "../../../background/sounds.js";

export class MovingObstacle extends Obstacle {
    constructor(x, y, width, height, color, speed, direction) {
        super(x, y, width, height, color);

        // Speed is the magnitude of the movement vector
        this.speed = speed;

        // Direction is a vector [dx, dy] indicating the direction of movement
        this.direction = direction; // direction is an object { x: dx, y: dy }
        
        // Normalize the direction vector to maintain consistent speed
        const magnitude = Math.sqrt(this.direction.dx ** 2 + this.direction.dy ** 2);
        if (magnitude !== 0) {
            this.direction.dx /= magnitude;
            this.direction.dy /= magnitude;
        }
    }

    update() {
        // Update position based on direction and speed
        this.x += this.direction.dx * this.speed;
        this.y += this.direction.dy * this.speed;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}
