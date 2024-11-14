export class Particle {
    constructor(x, y, dx, dy, size, life) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.life = life;
    }

    update() {
        // Update position based on speed
        this.x += this.dx;
        this.y += this.dy;

        // Reduce life with each frame
        this.life -= 1;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = "rgba(128, 0, 128, 0.7)";  // Orange color with transparency
        context.fill();
        context.closePath();
    }

    isAlive() {
        return this.life > 0;
    }
}
