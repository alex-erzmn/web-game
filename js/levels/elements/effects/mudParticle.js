export class MudParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 2 + Math.random() * 3; // Small random size
        this.alpha = 0.8; // Starting opacity
        this.lifeSpan = 60 + Math.random() * 30; // Lifespan of the particle
        this.age = 0;
        this.color = 'rgba(139, 69, 19, '; // Brown color base

        // Random movement to simulate slow spreading mud
        this.dx = (Math.random() - 0.5) * 0.5;
        this.dy = (Math.random() - 0.5) * 0.5;
    }

    update() {
        // Update position
        this.x += this.dx;
        this.y += this.dy;

        // Update opacity and lifespan
        this.alpha = Math.max(0, this.alpha - 0.01); // Fade out slowly
        this.age++;

        // Mark particle as expired after its lifespan
        this.isExpired = this.age > this.lifeSpan;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isGone() {
        return this.isExpired;
    }
}
