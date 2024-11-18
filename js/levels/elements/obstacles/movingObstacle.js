import { Obstacle } from "./obstacle.js";

export class MovingObstacle extends Obstacle {
    constructor(x, y, dx, dy, width, height, color) {
        super(x, y, width, height, color);
        this.dx = dx;
        this.dy = dy;
        this.speed = 300;
    }

    update(i, delta, game) {
        for (let j = 0; j < i; j++) {
            this.x += this.dx * this.speed * delta / i;
            this.y += this.dy * this.speed * delta / i;
            game.collisionManager.checkMovingObstacleCollisions();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}