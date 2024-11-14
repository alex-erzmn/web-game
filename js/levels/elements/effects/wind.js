import { WindParticle } from "./windParticle.js";
import { Effect } from "./effect.js";

export class Wind extends Effect {
    constructor(x, y, dx, dy, width, height, force) {
        super(x, y, width, height);
        this.dx = dx;
        this.dy = dy;
        this.force = force; // Blowing strength
    }

    update() {
        // Generate new particles occasionally
        if (Math.random() < 0.3) {
            // Use the fan's direction vector (dx, dy) and scale by force for particle movement
            const particle = new WindParticle(
                this.x + Math.random() * this.width,     // Start within fan area
                this.y + Math.random() * this.height,    // Start within fan area
                this.dx * this.force + (Math.random() - 0.5) * 2,  // Small random variation for "natural" look
                this.dy * this.force + (Math.random() - 0.5) * 2   // Small random variation for "natural" look
            );
            this.particles.push(particle);
        }

        // Update all particles and remove ones that are gone
        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(p => !p.isGone());
    }

    draw(ctx) {
        ctx.save();
        this.particles.forEach(particle => particle.draw(ctx));
        ctx.restore();
    }

    applyEffect(player) {
        if (this.isPlayerInRange(player)) {
            // Apply the fan's force in its direction to the player's velocity
            player.dx += this.dx * this.force;
            player.dy += this.dy * this.force;
        }
    }
}
