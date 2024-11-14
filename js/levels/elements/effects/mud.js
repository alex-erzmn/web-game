import { Effect } from "./effect.js";
import { MudParticle } from "./mudParticle.js";

export class Mud extends Effect {
    constructor(x, y, width, height, slowdownFactor) {
        super(x, y, width, height);
        this.slowdownFactor = slowdownFactor; // Factor to slow down the player
    }

    applyEffect(player) {
        if (this.isPlayerInRange(player)) {
            // Apply the slowdown factor to the player's movement speed
            player.dx *= this.slowdownFactor;
            player.dy *= this.slowdownFactor;
        }
    }

    update() {
        // Generate new mud particles occasionally
        if (Math.random() < 0.2) {
            const particle = new MudParticle(
                this.x + Math.random() * this.width,
                this.y + Math.random() * this.height
            );
            this.particles.push(particle);
        }
    
        // Update particles and remove those that are expired
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => !p.isGone());
    }

    draw(ctx) {
        // Draw the mud area with a brown color to indicate mud
        ctx.save();
        this.particles.forEach(p => p.draw(ctx));
        ctx.restore();
    }
}
