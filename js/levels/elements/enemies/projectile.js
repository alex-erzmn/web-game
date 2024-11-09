// projectile.js
export class Projectile {
    constructor(x, y, direction, speed = 5) {
        this.x = x;
        this.y = y;
        this.direction = direction; // Could be an angle or a simple 'up', 'down', etc.
        this.speed = speed;
        this.width = 5; // Example size
        this.height = 5;
        this.color = 'black'; // Example color for visibility
    }

    update() {
        // Update projectile position based on direction
        if (this.direction === 'up') {
            this.y -= this.speed;
        } else if (this.direction === 'down') {
            this.y += this.speed;
        } else if (this.direction === 'left') {
            this.x -= this.speed;
        } else if (this.direction === 'right') {
            this.x += this.speed;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
