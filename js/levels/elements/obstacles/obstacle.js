export class Obstacle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(player) {
        return !(player.x + player.size < this.x || 
                 player.x > this.x + this.width || 
                 player.y + player.size < this.y || 
                 player.y > this.y + this.height);
    }
}
