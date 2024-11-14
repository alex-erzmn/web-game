export class WindParticle {
    constructor(x, y, dx, dy) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.opacity = 1;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.opacity -= 0.02; 
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(173, 216, 230, ${this.opacity})`; 
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); 
        ctx.fill();
    }

    isGone() {
        return this.opacity <= 0;
    }
}