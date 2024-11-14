export class ExplosionParticle {
    constructor(x, y, dx, dy, size, life) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.life = life;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        this.life -= 1;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = "rgba(128, 0, 128, 0.7)";
        context.fill();
        context.closePath();
    }

    isAlive() {
        return this.life > 0;
    }
}
