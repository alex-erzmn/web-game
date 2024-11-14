import { Effect } from "./effect.js";
import { MudParticle } from "./mudParticle.js";

export class Mud extends Effect {
    constructor(x, y, width, height, slowdownFactor) {
        super(x, y, width, height);
        this.slowdownFactor = slowdownFactor;
    }

    applyEffect(player) {
        if (this.isPlayerInRange(player)) {
            player.dx *= this.slowdownFactor;
            player.dy *= this.slowdownFactor;
        }
    }

    update() {
        if (Math.random() < 0.2) {
            const particle = new MudParticle(
                this.x + Math.random() * this.width,
                this.y + Math.random() * this.height
            );
            this.particles.push(particle);
        }
    
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => !p.isGone());
    }

    draw(ctx) {
        ctx.save();
        this.particles.forEach(p => p.draw(ctx));
        ctx.restore();
    }
}
