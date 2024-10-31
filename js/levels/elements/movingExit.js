import { Exit } from "./exit";

export class MovingExit extends Exit {
    constructor(x, y) {
        super(x, y, speed, direction);
        this.speed = speed;
        this.direction = direction;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
    }

    checkPlayerReached(player) {
        const dist = Math.hypot(player.x - this.x, player.y - this.y);
        return dist < this.radius + 10;
    }
}