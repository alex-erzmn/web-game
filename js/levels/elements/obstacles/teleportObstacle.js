import { Obstacle } from "./obstacle.js";

export class teleportObstacle extends Obstacle {
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(player) {
        return !(player.x + player.size < this.x || 
                 player.x > this.x + this.width || 
                 player.y + player.size < this.y || 
                 player.y > this.y + this.height);
    }


    onCollision(player) {
        player.x = player.width + Math.random() * 1180; 
        player.y = player.height + Math.random() * 680;
    }
}