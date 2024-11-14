export class InverterParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3 + Math.random() * 3; // Slightly larger for a spiral look
        this.alpha = 0.9; // Start with high opacity for strong visibility
        this.lifeSpan = 60 + Math.random() * 30; // Slightly longer lifespan
        this.age = 0;
        
        // Hypnotic color gradient from purple to light blue
        this.color = `rgba(${128 + Math.random() * 50}, 0, ${128 + Math.random() * 50},`;
        
        // Unique rotational motion parameters
        this.angle = Math.random() * Math.PI * 2; // Random starting angle
        this.angularVelocity = 0.05 + Math.random() * 0.03; // Spiral rotation speed
        this.radius = 1.5; // Orbit radius for spiral effect

        // Velocity with slight random drift
        this.dx = Math.cos(this.angle) * 0.3 + (Math.random() - 0.5) * 0.2;
        this.dy = Math.sin(this.angle) * 0.3 + (Math.random() - 0.5) * 0.2;
    }

    update() {
        // Update position with swirling spiral motion
        this.angle += this.angularVelocity;
        this.x += this.dx + Math.cos(this.angle) * this.radius;
        this.y += this.dy + Math.sin(this.angle) * this.radius;

        // Gradually fade out and shrink slightly for a trailing effect
        this.alpha = Math.max(0, this.alpha - 0.015); 
        this.size *= 0.98; // Shrink gradually
        this.age++;

        // Mark particle as expired after lifespan
        this.isExpired = this.age > this.lifeSpan;
    }

    draw(ctx) {
        ctx.save();
        
        // Set up gradient for hypnosis effect
        let gradient = ctx.createRadialGradient(this.x, this.y, this.size * 0.3, this.x, this.y, this.size);
        gradient.addColorStop(0, `${this.color}${this.alpha})`);
        gradient.addColorStop(1, `rgba(0, 128, 255, ${this.alpha * 0.5})`);

        ctx.fillStyle = gradient;
        
        // Draw particle as a circle with a hypnotic gradient
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw additional swirl lines radiating from center for a hypnotic look
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.5})`;
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 4; i++) {
            const angle = this.angle + (i * Math.PI) / 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + Math.cos(angle) * this.size * 1.2, this.y + Math.sin(angle) * this.size * 1.2);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    isGone() {
        return this.isExpired;
    }
}
